import { describe, expect, it } from 'vitest';
import { site } from '@/data/site';
import {
  buildHtmlBody,
  buildSubject,
  buildTextBody,
  buildTransportOptions,
  describeMailError,
  escapeHtml,
  getMailConfig,
  MailConfigError,
  SMTP_TIMEOUTS_MS,
} from '@/lib/contact/mail';

const details = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  inquiry: site.contact.form.inquiryTypes[0],
  artist: null,
  message: 'Hello <script>alert(1)</script>\nSecond line',
};

const env = {
  SMTP_HOST: 'mail.example.com',
  SMTP_PORT: '587',
  SMTP_USER: 'inquiries@example.com',
  SMTP_PASS: 'secret',
  CONTACT_FROM_EMAIL: 'inquiries@example.com',
  CONTACT_TO_EMAIL: 'owner@example.com',
};

describe('getMailConfig — valid configurations', () => {
  it('builds a STARTTLS config for port 587 by default', () => {
    const config = getMailConfig(env);
    expect(config).toMatchObject({
      host: 'mail.example.com',
      port: 587,
      secure: false,
      requireTls: true,
      user: 'inquiries@example.com',
      from: 'inquiries@example.com',
      to: 'owner@example.com',
    });
  });

  it('defaults to implicit TLS on port 465', () => {
    const config = getMailConfig({ ...env, SMTP_PORT: '465' });
    expect(config.secure).toBe(true);
    expect(config.requireTls).toBe(false);
  });

  it('accepts explicit true/false strings and 1/0 aliases', () => {
    const config = getMailConfig({
      ...env,
      SMTP_SECURE: 'false',
      SMTP_REQUIRE_TLS: '1',
    });
    expect(config.secure).toBe(false);
    expect(config.requireTls).toBe(true);
  });

  it('accepts a non-standard port when both TLS flags are explicit (Mailpit)', () => {
    const config = getMailConfig({
      ...env,
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: '1025',
      SMTP_SECURE: 'false',
      SMTP_REQUIRE_TLS: 'false',
    });
    expect(config.port).toBe(1025);
    expect(config.secure).toBe(false);
    expect(config.requireTls).toBe(false);
  });
});

describe('getMailConfig — required values', () => {
  it('throws MailConfigError when required variables are missing', () => {
    expect(() => getMailConfig({})).toThrow(MailConfigError);
    expect(() => getMailConfig({ ...env, SMTP_PASS: undefined })).toThrow(
      MailConfigError,
    );
    expect(() => getMailConfig({ ...env, SMTP_PASS: '' })).toThrow(
      MailConfigError,
    );
    expect(() => getMailConfig({ ...env, SMTP_USER: '  ' })).toThrow(
      MailConfigError,
    );
  });

  it('rejects invalid ports', () => {
    expect(() => getMailConfig({ ...env, SMTP_PORT: '0' })).toThrow(
      MailConfigError,
    );
    expect(() => getMailConfig({ ...env, SMTP_PORT: 'abc' })).toThrow(
      MailConfigError,
    );
    expect(() => getMailConfig({ ...env, SMTP_PORT: '99999' })).toThrow(
      MailConfigError,
    );
    expect(() => getMailConfig({ ...env, SMTP_PORT: '587.5' })).toThrow(
      MailConfigError,
    );
  });

  it('rejects hosts with spaces or special characters', () => {
    expect(() =>
      getMailConfig({ ...env, SMTP_HOST: 'mail example.com' }),
    ).toThrow(MailConfigError);
    expect(() =>
      getMailConfig({ ...env, SMTP_HOST: 'mail.example.com\r\nX-Evil: 1' }),
    ).toThrow(MailConfigError);
  });

  it('rejects invalid from/to addresses', () => {
    expect(() =>
      getMailConfig({ ...env, CONTACT_FROM_EMAIL: 'not-an-email' }),
    ).toThrow(MailConfigError);
    expect(() =>
      getMailConfig({ ...env, CONTACT_TO_EMAIL: 'a@b' }),
    ).toThrow(MailConfigError);
    expect(() =>
      getMailConfig({ ...env, CONTACT_FROM_EMAIL: 'a@example.com\r\nBcc: x' }),
    ).toThrow(MailConfigError);
  });

  it('rejects CR/LF in the SMTP user', () => {
    expect(() =>
      getMailConfig({ ...env, SMTP_USER: 'user\r\nEvil: 1' }),
    ).toThrow(MailConfigError);
  });

  it('rejects non-boolean SMTP_SECURE / SMTP_REQUIRE_TLS values', () => {
    expect(() =>
      getMailConfig({ ...env, SMTP_SECURE: 'yes' }),
    ).toThrow(MailConfigError);
    expect(() =>
      getMailConfig({ ...env, SMTP_REQUIRE_TLS: 'maybe' }),
    ).toThrow(MailConfigError);
  });
});

describe('getMailConfig — TLS matrix', () => {
  it('rejects SMTP_SECURE=false on port 465', () => {
    expect(() =>
      getMailConfig({ ...env, SMTP_PORT: '465', SMTP_SECURE: 'false' }),
    ).toThrow(/implicit TLS/);
  });

  it('rejects SMTP_REQUIRE_TLS=true on port 465', () => {
    expect(() =>
      getMailConfig({ ...env, SMTP_PORT: '465', SMTP_REQUIRE_TLS: 'true' }),
    ).toThrow(/must not be enabled/);
  });

  it('rejects SMTP_SECURE=true on port 587', () => {
    expect(() =>
      getMailConfig({ ...env, SMTP_PORT: '587', SMTP_SECURE: 'true' }),
    ).toThrow(/not valid on port 587/);
  });

  it('rejects disabling TLS upgrade on port 587', () => {
    expect(() =>
      getMailConfig({ ...env, SMTP_PORT: '587', SMTP_REQUIRE_TLS: 'false' }),
    ).toThrow(/Refusing plaintext/);
  });

  it('rejects a non-standard port without explicit TLS flags', () => {
    expect(() =>
      getMailConfig({ ...env, SMTP_PORT: '2525' }),
    ).toThrow(/explicit SMTP_SECURE/);
    expect(() =>
      getMailConfig({ ...env, SMTP_PORT: '2525', SMTP_SECURE: 'false' }),
    ).toThrow(/explicit SMTP_SECURE/);
  });
});

describe('buildTransportOptions', () => {
  it('sets explicit timeouts and keeps certificate verification enabled', () => {
    const config = getMailConfig(env);
    const options = buildTransportOptions(config);
    expect(options.connectionTimeout).toBe(SMTP_TIMEOUTS_MS.connectionTimeout);
    expect(options.greetingTimeout).toBe(SMTP_TIMEOUTS_MS.greetingTimeout);
    expect(options.socketTimeout).toBe(SMTP_TIMEOUTS_MS.socketTimeout);
    expect(options.tls).toEqual({ rejectUnauthorized: true });
    expect(options.auth).toEqual({ user: config.user, pass: config.pass });
    expect(options.requireTLS).toBe(true);
  });

  it('propagates implicit TLS settings for port 465', () => {
    const config = getMailConfig({ ...env, SMTP_PORT: '465' });
    const options = buildTransportOptions(config);
    expect(options.secure).toBe(true);
    expect(options.port).toBe(465);
    expect(options.tls.rejectUnauthorized).toBe(true);
  });
});

describe('describeMailError', () => {
  it('keeps only the error class and numeric code for SMTP failures', () => {
    const smtpError = Object.assign(new Error('535 auth failed secret stuff'), {
      name: 'SMTPError',
      response: '535 5.7.8 Authentication credentials invalid',
      responseCode: 535,
    });
    const described = describeMailError(smtpError);
    expect(described).toBe('SMTPError responseCode=535');
    expect(described).not.toContain('secret');
    expect(described).not.toContain('535 5.7.8');
  });

  it('includes the safe message for configuration errors', () => {
    expect(
      describeMailError(new MailConfigError('SMTP configuration is incomplete')),
    ).toContain('MailConfigError: SMTP configuration is incomplete');
  });

  it('truncates unexpected error messages', () => {
    const long = new Error('x'.repeat(1000));
    const described = describeMailError(long);
    expect(described.length).toBeLessThan(400);
  });

  it('handles non-object values', () => {
    expect(describeMailError('plain string')).toBe('unknown error');
    expect(describeMailError(null)).toBe('unknown error');
  });
});

describe('message builders', () => {
  it('builds a subject from the allowlisted inquiry type only', () => {
    expect(buildSubject('Talent booking')).toBe('HTG inquiry — Talent booking');
  });

  it('escapes HTML in every interpolated value', () => {
    const html = buildHtmlBody(details, new Date('2026-01-01T00:00:00Z'));
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(escapeHtml(`<a href="x">&'`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;',
    );
  });

  it('renders the text body with all fields and a fallback for artist', () => {
    const text = buildTextBody(details, new Date('2026-01-01T00:00:00Z'));
    expect(text).toContain('Name: Jane Doe');
    expect(text).toContain('Email: jane@example.com');
    expect(text).toContain('Artist / company: Not provided');
    expect(text).toContain('2026-01-01T00:00:00.000Z');
  });
});
