import { describe, expect, it } from 'vitest';
import { site } from '@/data/site';
import {
  toMultiline,
  toSingleLine,
  validateInquiry,
} from '@/lib/contact/validation';

const validPayload = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  inquiry: site.contact.form.inquiryTypes[0],
  artist: 'Acme Band',
  message: 'Looking for representation.',
};

describe('validateInquiry', () => {
  it('accepts a valid payload and trims whitespace', () => {
    const result = validateInquiry({
      ...validPayload,
      name: '  Jane Doe  ',
      artist: '  Acme Band  ',
    });
    expect(result).toEqual({
      ok: true,
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        inquiry: site.contact.form.inquiryTypes[0],
        artist: 'Acme Band',
        message: 'Looking for representation.',
      },
    });
  });

  it('normalizes a missing artist to null', () => {
    const result = validateInquiry({ ...validPayload, artist: '' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.artist).toBeNull();
  });

  it('rejects missing required fields', () => {
    const result = validateInquiry({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual([
        'email',
        'inquiry',
        'message',
        'name',
      ]);
    }
  });

  it('rejects malformed email addresses', () => {
    for (const email of ['not-an-email', 'a@b', 'a b@c.com', '@example.com']) {
      const result = validateInquiry({ ...validPayload, email });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.email).toBeDefined();
    }
  });

  it('rejects overlong fields', () => {
    const result = validateInquiry({
      ...validPayload,
      name: 'a'.repeat(101),
      message: 'b'.repeat(5001),
      artist: 'c'.repeat(151),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.message).toBeDefined();
      expect(result.errors.artist).toBeDefined();
    }
  });

  it('rejects inquiry types outside the allowlist', () => {
    const result = validateInquiry({ ...validPayload, inquiry: 'Money transfer' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.inquiry).toBeDefined();
  });

  it('strips CR/LF from single-line fields to prevent header injection', () => {
    const result = validateInquiry({
      ...validPayload,
      name: 'Jane\r\nBcc: victim@example.com',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).not.toMatch(/[\r\n]/);
      expect(result.data.name).toBe('Jane Bcc: victim@example.com');
    }
  });

  it('rejects CR/LF smuggling through the inquiry allowlist field', () => {
    const result = validateInquiry({
      ...validPayload,
      inquiry: `${site.contact.form.inquiryTypes[0]}\r\nX-Injected: yes`,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.inquiry).toBeDefined();
  });
});

describe('field helpers', () => {
  it('toSingleLine collapses newlines and whitespace', () => {
    expect(toSingleLine('a\r\nb\t c')).toBe('a b c');
  });

  it('toMultiline keeps newlines but strips CR and control chars', () => {
    expect(toMultiline('line1\r\nline2\u0000\u0007')).toBe('line1\nline2');
  });
});
