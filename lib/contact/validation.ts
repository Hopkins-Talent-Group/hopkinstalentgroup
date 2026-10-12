import { site } from '@/data/site';

const INQUIRY_TYPES = site.contact.form.inquiryTypes;

const LIMITS = {
  name: 100,
  email: 254,
  artist: 150,
  message: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface InquiryPayload {
  name?: unknown;
  email?: unknown;
  inquiry?: unknown;
  artist?: unknown;
  message?: unknown;
}

export interface ValidatedInquiry {
  name: string;
  email: string;
  inquiry: string;
  artist: string | null;
  message: string;
}

export type ValidationResult =
  | { ok: true; data: ValidatedInquiry }
  | { ok: false; errors: Record<string, string> };

/** Collapse to a single line with no CR/LF — safe for headers and subjects. */
export function toSingleLine(value: unknown): string {
  return String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Keep newlines for the message body but strip CR and other control chars. */
export function toMultiline(value: unknown): string {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

export function validateInquiry(payload: InquiryPayload): ValidationResult {
  const errors: Record<string, string> = {};

  const name = toSingleLine(payload.name);
  const email = toSingleLine(payload.email);
  const inquiry = toSingleLine(payload.inquiry);
  const artist = toSingleLine(payload.artist);
  const message = toMultiline(payload.message);

  if (!name) {
    errors.name = 'Enter your name.';
  } else if (name.length > LIMITS.name) {
    errors.name = `Name must be ${LIMITS.name} characters or fewer.`;
  }

  if (!email) {
    errors.email = 'Enter your email address.';
  } else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!inquiry) {
    errors.inquiry = 'Choose an inquiry type.';
  } else if (!INQUIRY_TYPES.includes(inquiry)) {
    errors.inquiry = 'Choose a valid inquiry type.';
  }

  if (artist.length > LIMITS.artist) {
    errors.artist = `Artist / company must be ${LIMITS.artist} characters or fewer.`;
  }

  if (!message) {
    errors.message = 'Tell us about your inquiry.';
  } else if (message.length > LIMITS.message) {
    errors.message = `Message must be ${LIMITS.message} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      inquiry,
      artist: artist || null,
      message,
    },
  };
}
