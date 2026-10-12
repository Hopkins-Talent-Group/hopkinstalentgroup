import { getClientIpKey } from '@/lib/contact/clientIp';
import { readJsonBody } from '@/lib/contact/bodyLimit';
import { describeMailError, MailConfigError, sendInquiryMail } from '@/lib/contact/mail';
import { parseRateLimitConfig, rateLimitAllows } from '@/lib/contact/rateLimit';
import { validateInquiry } from '@/lib/contact/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function bodyError(status: 400 | 413 | 415): Response {
  if (status === 413) {
    return json(413, {
      ok: false,
      error: 'Request body is too large.',
    });
  }
  if (status === 415) {
    return json(415, {
      ok: false,
      error: 'Unsupported content type. Send application/json.',
    });
  }
  return json(400, { ok: false, error: 'Invalid request.' });
}

export async function POST(request: Request): Promise<Response> {
  const { max, windowMs } = parseRateLimitConfig();

  if (!rateLimitAllows(getClientIpKey(request), max, windowMs)) {
    return json(429, {
      ok: false,
      error: 'Too many submissions from this device. Please try again later.',
    });
  }

  const body = await readJsonBody(request);
  if (!body.ok) {
    return bodyError(body.status);
  }

  if (!body.value || typeof body.value !== 'object' || Array.isArray(body.value)) {
    return json(400, { ok: false, error: 'Invalid request.' });
  }

  const payload = body.value as Record<string, unknown>;

  const honeypot = payload.website;
  if (
    honeypot !== undefined &&
    honeypot !== null &&
    String(honeypot).trim() !== ''
  ) {
    return json(200, { ok: true });
  }

  const result = validateInquiry(payload);
  if (!result.ok) {
    return json(422, {
      ok: false,
      error: 'Please review the form fields.',
      errors: result.errors,
    });
  }

  try {
    await sendInquiryMail(result.data);
  } catch (error) {
    if (error instanceof MailConfigError) {
      console.error('Inquiry mail not configured:', error.message);
      return json(503, {
        ok: false,
        error:
          'Inquiry delivery is temporarily unavailable. Please try again later.',
      });
    }
    console.error('Inquiry mail send failed:', describeMailError(error));
    return json(502, {
      ok: false,
      error: 'We could not send your inquiry right now. Please try again shortly.',
    });
  }

  return json(200, { ok: true });
}
