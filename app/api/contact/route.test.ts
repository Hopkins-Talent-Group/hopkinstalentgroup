import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { site } from '@/data/site';
import { MAX_BODY_BYTES } from '@/lib/contact/bodyLimit';
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
  {
    ip = '1.1.1.1',
    contentType = 'application/json',
    extraHeaders,
  }: {
    ip?: string;
    contentType?: string | null;
    extraHeaders?: Record<string, string>;
  } = {},
): Request {
  const headers: Record<string, string> = {
    'x-forwarded-for': ip,
  };
  if (contentType !== null) headers['Content-Type'] = contentType;
  if (extraHeaders) Object.assign(headers, extraHeaders);

  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function makeStreamRequest(
  chunks: Uint8Array[],
  { contentType = 'application/json', contentLength }: { contentType?: string; contentLength?: string } = {},
): Request {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
  const headers: Record<string, string> = { 'Content-Type': contentType };
  if (contentLength !== undefined) headers['Content-Length'] = contentLength;

  const init = {
    method: 'POST',
    headers,
    body: stream,
    duplex: 'half',
  } as RequestInit & { duplex: 'half' };
  return new Request('http://localhost/api/contact', init);
}

beforeEach(() => {
  resetRateLimits();
  sendInquiryMailMock.mockReset();
  sendInquiryMailMock.mockResolvedValue(undefined);
  process.env.CONTACT_RATE_LIMIT_MAX = '100';
  process.env.CONTACT_RATE_LIMIT_WINDOW_MS = '600000';
  delete process.env.VERCEL;
});

afterEach(() => {
  delete process.env.CONTACT_RATE_LIMIT_MAX;
  delete process.env.CONTACT_RATE_LIMIT_WINDOW_MS;
  delete process.env.VERCEL;
});

describe('POST /api/contact — happy path', () => {
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

describe('POST /api/contact — honeypot and validation', () => {
  it('ignores honeypot submissions without sending', async () => {
    const response = await POST(
      makeRequest({ ...validBody, website: 'spam.example' }),
    );
    expect(response.status).toBe(200);
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
});

describe('POST /api/contact — request parsing', () => {
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

  it('rejects an empty body with 400', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('rejects unsupported content types with 415', async () => {
    const response = await POST(
      makeRequest(validBody, { contentType: 'text/plain' }),
    );
    expect(response.status).toBe(415);
    const body = (await response.json()) as { ok: boolean };
    expect(body.ok).toBe(false);
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('rejects a missing content type with 415', async () => {
    const response = await POST(
      makeRequest(validBody, { contentType: null }),
    );
    expect(response.status).toBe(415);
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('accepts application/json with a charset parameter', async () => {
    const response = await POST(
      makeRequest(validBody, { contentType: 'application/json; charset=utf-8' }),
    );
    expect(response.status).toBe(200);
  });
});

describe('POST /api/contact — body size limits', () => {
  it('rejects an oversized declared Content-Length early with 413', async () => {
    const response = await POST(
      makeRequest(validBody, {
        extraHeaders: { 'Content-Length': String(MAX_BODY_BYTES + 1) },
      }),
    );
    expect(response.status).toBe(413);
    const body = (await response.json()) as { ok: boolean; error: string };
    expect(body.ok).toBe(false);
    expect(body.error).not.toContain('stack');
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('rejects a streamed body over the limit with 413 when Content-Length is absent', async () => {
    const oversized = new TextEncoder().encode('a'.repeat(MAX_BODY_BYTES + 1));
    const request = makeStreamRequest([oversized]);
    expect(request.headers.get('content-length')).toBeNull();
    const response = await POST(request);
    expect(response.status).toBe(413);
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('enforces the streaming limit even when Content-Length understates the size', async () => {
    const oversized = new TextEncoder().encode('a'.repeat(MAX_BODY_BYTES + 1));
    const request = makeStreamRequest([oversized], {
      contentLength: '100',
    });
    const response = await POST(request);
    expect(response.status).toBe(413);
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid Content-Length with 400', async () => {
    const response = await POST(
      makeRequest(validBody, { extraHeaders: { 'Content-Length': 'abc' } }),
    );
    expect(response.status).toBe(400);
    expect(sendInquiryMailMock).not.toHaveBeenCalled();
  });

  it('accepts a streamed body within the limit', async () => {
    const json = new TextEncoder().encode(JSON.stringify(validBody));
    const response = await POST(makeStreamRequest([json]));
    expect(response.status).toBe(200);
    expect(sendInquiryMailMock).toHaveBeenCalledTimes(1);
  });
});

describe('POST /api/contact — failure handling', () => {
  it('returns a generic 502 when delivery fails and hides SMTP details', async () => {
    sendInquiryMailMock.mockRejectedValueOnce(
      new Error('SMTP 454 auth failed'),
    );
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(502);
    const body = (await response.json()) as { ok: boolean; error: string };
    expect(body.ok).toBe(false);
    expect(body.error).not.toContain('SMTP');
    expect(body.error).not.toContain('454');
  });

  it('never returns success after a failed send', async () => {
    sendInquiryMailMock.mockRejectedValueOnce(new Error('boom'));
    const response = await POST(makeRequest(validBody));
    expect(response.status).not.toBe(200);
  });

  it('returns 503 when mail is not configured', async () => {
    sendInquiryMailMock.mockRejectedValueOnce(
      new MailConfigError('missing config'),
    );
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(503);
  });

  it('never logs raw exception messages on send failure', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      sendInquiryMailMock.mockRejectedValueOnce(
        new Error(
          'connect ECONNREFUSED smtp-fake.internal.example.invalid:587 FAKE_PASS_DO_NOT_LOG_123',
        ),
      );
      await POST(makeRequest(validBody));
      const logged = spy.mock.calls.flat().map(String).join(' ');
      expect(logged).not.toContain('smtp-fake.internal.example.invalid');
      expect(logged).not.toContain('FAKE_PASS_DO_NOT_LOG_123');
      expect(logged).not.toContain('ECONNREFUSED');
      expect(logged).toContain('Inquiry mail send failed:');
      expect(logged).toContain('Error');
    } finally {
      spy.mockRestore();
    }
  });

  it('logs only the sanitized description for configuration errors', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      sendInquiryMailMock.mockRejectedValueOnce(
        new MailConfigError('SMTP configuration is incomplete'),
      );
      await POST(makeRequest(validBody));
      expect(spy).toHaveBeenCalledWith(
        'Inquiry mail not configured:',
        'MailConfigError: SMTP configuration is incomplete',
      );
    } finally {
      spy.mockRestore();
    }
  });
});

describe('POST /api/contact — client IP trust and rate limiting', () => {
  it('does not trust x-forwarded-for outside the trusted platform', async () => {
    process.env.CONTACT_RATE_LIMIT_MAX = '2';
    const first = await POST(makeRequest(validBody, { ip: '203.0.113.1' }));
    expect(first.status).toBe(200);
    const second = await POST(makeRequest(validBody, { ip: '203.0.113.2' }));
    expect(second.status).toBe(200);
    const third = await POST(makeRequest(validBody, { ip: '203.0.113.3' }));
    expect(third.status).toBe(429);
    expect(sendInquiryMailMock).toHaveBeenCalledTimes(2);
  });

  it('rate limits repeated submissions sharing one untrusted bucket', async () => {
    process.env.CONTACT_RATE_LIMIT_MAX = '2';
    expect((await POST(makeRequest(validBody))).status).toBe(200);
    expect((await POST(makeRequest(validBody))).status).toBe(200);
    expect((await POST(makeRequest(validBody))).status).toBe(429);
    expect(sendInquiryMailMock).toHaveBeenCalledTimes(2);
  });

  it('uses x-real-ip per client when running on the trusted platform', async () => {
    process.env.VERCEL = '1';
    process.env.CONTACT_RATE_LIMIT_MAX = '2';
    const request = (ip: string) =>
      makeRequest(validBody, { extraHeaders: { 'x-real-ip': ip } });
    expect((await POST(request('203.0.113.10'))).status).toBe(200);
    expect((await POST(request('203.0.113.10'))).status).toBe(200);
    expect((await POST(request('203.0.113.10'))).status).toBe(429);
    expect((await POST(request('203.0.113.11'))).status).toBe(200);
  });

  it('falls back to the last x-forwarded-for entry on the trusted platform', async () => {
    process.env.VERCEL = '1';
    process.env.CONTACT_RATE_LIMIT_MAX = '1';
    const request = (xff: string) =>
      makeRequest(validBody, { extraHeaders: { 'x-forwarded-for': xff } });
    expect(
      (await POST(request('198.51.100.1, 203.0.113.20'))).status,
    ).toBe(200);
    expect(
      (await POST(request('198.51.100.1, 203.0.113.20'))).status,
    ).toBe(429);
    expect(
      (await POST(request('198.51.100.2, 203.0.113.21'))).status,
    ).toBe(200);
  });

  it('falls back to the untrusted bucket when platform headers are invalid', async () => {
    process.env.VERCEL = '1';
    process.env.CONTACT_RATE_LIMIT_MAX = '1';
    const request = (headers: Record<string, string>) =>
      makeRequest(validBody, { extraHeaders: headers });
    const invalid = {
      'x-real-ip': 'not an ip!',
      'x-forwarded-for': 'also not an ip',
    };
    expect((await POST(request(invalid))).status).toBe(200);
    expect(
      (await POST(
        request({ 'x-real-ip': '999.999.999.999', 'x-forwarded-for': 'nope' }),
      )).status,
    ).toBe(429);
  });

  it('falls back to the default limit when env values are invalid', async () => {
    process.env.CONTACT_RATE_LIMIT_MAX = 'not-a-number';
    for (let i = 0; i < 5; i += 1) {
      expect((await POST(makeRequest(validBody))).status).toBe(200);
    }
    expect((await POST(makeRequest(validBody))).status).toBe(429);
    expect(sendInquiryMailMock).toHaveBeenCalledTimes(5);
  });

  it('treats an explicitly empty env value as the default, not as disabled', async () => {
    process.env.CONTACT_RATE_LIMIT_MAX = '';
    for (let i = 0; i < 5; i += 1) {
      expect((await POST(makeRequest(validBody))).status).toBe(200);
    }
    expect((await POST(makeRequest(validBody))).status).toBe(429);
  });
});
