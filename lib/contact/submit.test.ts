import { describe, expect, it, vi } from 'vitest';
import { site } from '@/data/site';
import { submitInquiry } from '@/lib/contact/submit';

const form = site.contact.form;

const payload = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  inquiry: form.inquiryTypes[0],
  artist: '',
  message: 'Hello',
  website: '',
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('submitInquiry', () => {
  it('returns ok on a 200 response', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(200, { ok: true }));
    const result = await submitInquiry(payload, fetchMock);
    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('maps 422 field errors for inline display', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(422, {
        ok: false,
        error: 'Please review the form fields.',
        errors: { email: 'Enter a valid email address.' },
      }),
    );
    const result = await submitInquiry(payload, fetchMock);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(422);
      expect(result.message).toBe('Please review the form fields.');
      expect(result.fieldErrors).toEqual({
        email: 'Enter a valid email address.',
      });
    }
  });

  it('falls back to the local validation message when a 422 has no body', async () => {
    const fetchMock = vi.fn(
      async () => new Response('nope', { status: 422 }),
    );
    const result = await submitInquiry(payload, fetchMock);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe(form.validationMessage);
    }
  });

  it('uses the server rate-limit message for 429', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(429, {
        ok: false,
        error: 'Too many submissions from this device. Please try again later.',
      }),
    );
    const result = await submitInquiry(payload, fetchMock);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(429);
      expect(result.message).toContain('Too many submissions');
    }
  });

  it('falls back to the local rate-limit message when the 429 body is not JSON', async () => {
    const fetchMock = vi.fn(async () => new Response('', { status: 429 }));
    const result = await submitInquiry(payload, fetchMock);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe(form.rateLimitMessage);
    }
  });

  it('shows the too-large message for 413 regardless of body content', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(413, { ok: false, error: 'Request body is too large.' }),
    );
    const result = await submitInquiry(payload, fetchMock);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(413);
      expect(result.message).toBe(form.tooLargeMessage);
    }
  });

  it('handles 400 and 415 with the request error fallback', async () => {
    for (const status of [400, 415]) {
      const fetchMock = vi.fn(async () => new Response('', { status }));
      const result = await submitInquiry(payload, fetchMock);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.status).toBe(status);
        expect(result.message).toBe(form.requestErrorMessage);
      }
    }
  });

  it('uses safe server messages for 502 and 503 when present', async () => {
    for (const status of [502, 503]) {
      const fetchMock = vi.fn(async () =>
        jsonResponse(status, { ok: false, error: 'Delivery is down.' }),
      );
      const result = await submitInquiry(payload, fetchMock);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toBe('Delivery is down.');
      }
    }
  });

  it('falls back to the generic error message for unexpected statuses', async () => {
    const fetchMock = vi.fn(async () => new Response('Internal', { status: 500 }));
    const result = await submitInquiry(payload, fetchMock);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(500);
      expect(result.message).toBe(form.errorMessage);
    }
  });

  it('returns the network message when fetch rejects', async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    const result = await submitInquiry(payload, fetchMock);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBeNull();
      expect(result.message).toBe(form.networkErrorMessage);
      expect(result.fieldErrors).toEqual({});
    }
  });

  it('ignores malformed field-error payloads', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(422, { ok: false, errors: ['unexpected', 42] }),
    );
    const result = await submitInquiry(payload, fetchMock);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toEqual({});
    }
  });
});
