import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { site } from '@/data/site';
import { MailConfigError, sendInquiryMail } from '@/lib/contact/mail';
import { resetRateLimits } from '@/lib/contact/rateLimit';
import { POST } from '@/app/api/contact/route';

vi.mock('@/lib/contact/mail', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/contact/mail')>();
  return {
    ...actual,
    sendInquiryMail: vi.fn(async () => {}),
  };
});

const sendInquiryMailMock = vi.mocked(sendInquiryMail);

const validBody = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  inquiry: site.contact.form.inquiryTypes[0],
  artist: '',
  message: 'Looking for representation.',
  website: '',
};

function makeRequest(
  body: unknown,
  { ip = '1.1.1.1' }: { ip?: string } = {},
): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  resetRateLimits();
  sendInquiryMailMock.mockReset();
  sendInquiryMailMock.mockResolvedValue(undefined);
  process.env.CONTACT_RATE_LIMIT_MAX = '100';
  process.env.CONTACT_RATE_LIMIT_WINDOW_MS = '600000';
});

afterEach(() => {
  delete process.env.CONTACT_RATE_LIMIT_MAX;
  delete process.env.CONTACT_RATE_LIMIT_WINDOW_MS;
});

describe('POST /api/contact', () => {
  it('sends a valid inquiry and returns 200', async () => {
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(sendInquiryMailMock).toHaveBeenCalledTimes(1);
    expect(sendInquiryMailMock).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      inquiry: site.contact.form.inquiryTypes[0],
      artist: null,
      message: 'Looking for representation.',
    });
  });

  it('ignores honeypot submissions without sending', async () => {
    const response = await POST(
      makeRequest({ ...validBody, website: 'spam.example' }),
    );
    expect(response.status).toBe(200);
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON with 400', async () => {
    const response = await POST(makeRequest('not-json'));
    expect(response.status).toBe(400);
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('rejects non-object bodies with 400', async () => {
    const response = await POST(makeRequest(['a', 'b']));
    expect(response.status).toBe(400);
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('returns 422 with field errors for invalid payloads', async () => {
    const response = await POST(
      makeRequest({ ...validBody, email: 'not-an-email' }),
    );
    expect(response.status).toBe(422);
    const body = (await response.json()) as { ok: boolean; errors: object };
    expect(body.ok).toBe(false);
    expect(body.errors).toHaveProperty('email');
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('returns a generic 502 when delivery fails', async () => {
    sendInquiryMailMock.mockRejectedValueOnce(new Error('SMTP 454 auth failed'));
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(502);
    const body = (await response.json()) as { ok: boolean; error: string };
    expect(body.ok).toBe(false);
    expect(body.error).not.toContain('SMTP');
    expect(body.error).not.toContain('454');
  });

  it('returns 503 when mail is not configured', async () => {
    sendInquiryMailMock.mockRejectedValueOnce(
      new MailConfigError('missing config'),
    );
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(503);
  });

  it('rate limits repeated submissions from one client', async () => {
    process.env.CONTACT_RATE_LIMIT_MAX = '2';
    const ip = '9.9.9.9';
    expect((await POST(makeRequest(validBody, { ip }))).status).toBe(200);
    expect((await POST(makeRequest(validBody, { ip }))).status).toBe(200);
    const third = await POST(makeRequest(validBody, { ip }));
    expect(third.status).toBe(429);
    expect(sendInquiryMailMock).toHaveBeenCalledTimes(2);
  });

  it('sanitizes header injection attempts before sending', async () => {
    const response = await POST(
      makeRequest({
        ...validBody,
        name: 'Jane\r\nBcc: victim@example.com',
      }),
    );
    expect(response.status).toBe(200);
    const sent = sendInquiryMailMock.mock.calls[0][0];
    expect(sent.name).not.toMatch(/[\r\n]/);
    expect(sent.email).toBe('jane@example.com');
  });
});
