import { describe, expect, it } from 'vitest';
import { site } from '@/data/site';
import {
  buildHtmlBody,
  buildSubject,
  buildTextBody,
  escapeHtml,
  getMailConfig,
  MailConfigError,
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

describe('getMailConfig', () => {
  it('builds a config from environment variables', () => {
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

  it('defaults secure to true on port 465', () => {
    const config = getMailConfig({ ...env, SMTP_PORT: '465' });
    expect(config.secure).toBe(true);
    expect(config.requireTls).toBe(false);
  });

  it('throws MailConfigError when required variables are missing', () => {
    expect(() => getMailConfig({})).toThrow(MailConfigError);
    expect(() => getMailConfig({ ...env, SMTP_PASS: undefined })).toThrow(
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
