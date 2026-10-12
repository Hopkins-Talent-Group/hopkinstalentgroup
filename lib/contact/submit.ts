import { site } from '@/data/site';

const form = site.contact.form;

export interface InquirySubmission {
  name: string;
  email: string;
  inquiry: string;
  artist: string;
  message: string;
  website: string;
}

export interface SubmitFailure {
  ok: false;
  status: number | null;
  message: string;
  fieldErrors: Record<string, string>;
}

export type SubmitResult = { ok: true } | SubmitFailure;

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

function parseFieldErrors(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const errors: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === 'string' && entry && key.length <= 64) {
      errors[key] = entry.slice(0, 200);
    }
  }
  return errors;
}

/**
 * Submits the inquiry to /api/contact and maps every failure mode to a safe,
 * user-facing message. Never throws; never surfaces internal details.
 */
export async function submitInquiry(
  payload: InquirySubmission,
  fetchImpl: FetchLike = fetch,
): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await fetchImpl('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      status: null,
      message: form.networkErrorMessage,
      fieldErrors: {},
    };
  }

  if (response.ok) {
    return { ok: true };
  }

  let body: Record<string, unknown> = {};
  try {
    const parsed: unknown = await response.json();
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>;
    }
  } catch {
    body = {};
  }

  const serverMessage =
    typeof body.error === 'string' && body.error ? body.error.slice(0, 300) : '';
  const fieldErrors = parseFieldErrors(body.errors);

  switch (response.status) {
    case 422:
      return {
        ok: false,
        status: 422,
        message: serverMessage || form.validationMessage,
        fieldErrors,
      };
    case 429:
      return {
        ok: false,
        status: 429,
        message: serverMessage || form.rateLimitMessage,
        fieldErrors: {},
      };
    case 413:
      return {
        ok: false,
        status: 413,
        message: form.tooLargeMessage,
        fieldErrors: {},
      };
    case 400:
    case 415:
      return {
        ok: false,
        status: response.status,
        message: serverMessage || form.requestErrorMessage,
        fieldErrors: {},
      };
    case 502:
    case 503:
      return {
        ok: false,
        status: response.status,
        message: serverMessage || form.errorMessage,
        fieldErrors: {},
      };
    default:
      return {
        ok: false,
        status: response.status,
        message: form.errorMessage,
        fieldErrors: {},
      };
  }
}
