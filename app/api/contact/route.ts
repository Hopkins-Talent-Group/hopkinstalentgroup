import { MailConfigError, sendInquiryMail } from '@/lib/contact/mail';
import { rateLimitAllows } from '@/lib/contact/rateLimit';
import { validateInquiry } from '@/lib/contact/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('cf-connecting-ip') ?? 'unknown';
}

export async function POST(request: Request): Promise<Response> {
  const limit = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5);
  const windowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 600_000);

  if (!rateLimitAllows(clientKey(request), limit, windowMs)) {
    return json(429, {
      ok: false,
      error: 'Too many submissions from this device. Please try again later.',
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid request.' });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json(400, { ok: false, error: 'Invalid request.' });
  }

  const payload = body as Record<string, unknown>;

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
    console.error(
      'Inquiry mail send failed:',
      error instanceof Error ? error.message : error,
    );
    return json(502, {
      ok: false,
      error: 'We could not send your inquiry right now. Please try again shortly.',
    });
  }

  return json(200, { ok: true });
}
