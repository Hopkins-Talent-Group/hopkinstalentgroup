import nodemailer from 'nodemailer';

export class MailConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MailConfigError';
  }
}

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  requireTls: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
}

export interface InquiryDetails {
  name: string;
  email: string;
  inquiry: string;
  artist: string | null;
  message: string;
}

export interface SmtpTransportOptions {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  auth: { user: string; pass: string };
  connectionTimeout: number;
  greetingTimeout: number;
  socketTimeout: number;
  tls: { rejectUnauthorized: true };
}

export const SMTP_TIMEOUTS_MS = {
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
} as const;

const HOST_PATTERN =
  /^(?=.{1,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)*[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const EMAIL_PATTERN = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,<>]+$/;
const MAX_EMAIL_LENGTH = 254;

function parseStrictBoolean(
  raw: string | undefined,
  name: string,
): boolean | undefined {
  if (raw === undefined || raw.trim() === '') return undefined;
  const value = raw.trim().toLowerCase();
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  throw new MailConfigError(`${name} must be "true" or "false".`);
}

/**
 * Validates SMTP settings from the environment.
 *
 * TLS matrix:
 * - Port 465: implicit TLS (`secure: true`). `SMTP_SECURE=false` is rejected;
 *   `SMTP_REQUIRE_TLS` must not be enabled.
 * - Port 587: STARTTLS with a mandatory upgrade (`requireTls: true`).
 *   `SMTP_SECURE=true` and `SMTP_REQUIRE_TLS=false` are rejected — no
 *   plaintext fallback.
 * - Any other port (e.g. local Mailpit on 1025) requires BOTH `SMTP_SECURE`
 *   and `SMTP_REQUIRE_TLS` to be set explicitly; nothing is assumed.
 *
 * Certificate verification stays enabled (`rejectUnauthorized: true`); it is
 * never disabled by this module.
 */
export function getMailConfig(
  env: Record<string, string | undefined> = process.env,
): MailConfig {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS;
  const from = env.CONTACT_FROM_EMAIL?.trim();
  const to = env.CONTACT_TO_EMAIL?.trim();

  if (!host || !user || !pass || !from || !to) {
    throw new MailConfigError(
      'SMTP configuration is incomplete (SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL are required).',
    );
  }

  if (!HOST_PATTERN.test(host)) {
    throw new MailConfigError(
      'SMTP_HOST must be a plain hostname without spaces or special characters.',
    );
  }
  if (/[\r\n]/.test(user)) {
    throw new MailConfigError('SMTP_USER contains invalid characters.');
  }
  if (from.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(from)) {
    throw new MailConfigError('CONTACT_FROM_EMAIL must be a valid email address.');
  }
  if (to.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(to)) {
    throw new MailConfigError('CONTACT_TO_EMAIL must be a valid email address.');
  }

  const rawPort =
    env.SMTP_PORT === undefined || env.SMTP_PORT.trim() === ''
      ? '587'
      : env.SMTP_PORT.trim();
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new MailConfigError('SMTP_PORT must be a valid TCP port (1-65535).');
  }

  const secure = parseStrictBoolean(env.SMTP_SECURE, 'SMTP_SECURE');
  const requireTls = parseStrictBoolean(
    env.SMTP_REQUIRE_TLS,
    'SMTP_REQUIRE_TLS',
  );

  if (port === 465) {
    if (secure === false) {
      throw new MailConfigError(
        'SMTP_SECURE=false is not valid with implicit TLS on port 465. Remove SMTP_SECURE or set it to true.',
      );
    }
    if (requireTls === true) {
      throw new MailConfigError(
        'SMTP_REQUIRE_TLS must not be enabled with implicit TLS (port 465).',
      );
    }
    return {
      host,
      port,
      secure: true,
      requireTls: false,
      user,
      pass,
      from,
      to,
    };
  }

  if (port === 587) {
    if (secure === true) {
      throw new MailConfigError(
        'SMTP_SECURE=true (implicit TLS) is not valid on port 587. Use port 465 for implicit TLS, or leave SMTP_SECURE=false for STARTTLS.',
      );
    }
    if (requireTls === false) {
      throw new MailConfigError(
        'Refusing plaintext SMTP on port 587. Set SMTP_REQUIRE_TLS=true, or use port 465 for implicit TLS.',
      );
    }
    return {
      host,
      port,
      secure: false,
      requireTls: true,
      user,
      pass,
      from,
      to,
    };
  }

  if (secure === undefined || requireTls === undefined) {
    throw new MailConfigError(
      `Non-standard SMTP port ${port} requires explicit SMTP_SECURE and SMTP_REQUIRE_TLS settings (local Mailpit example: SMTP_SECURE=false, SMTP_REQUIRE_TLS=false).`,
    );
  }

  return { host, port, secure, requireTls, user, pass, from, to };
}

export function buildTransportOptions(config: MailConfig): SmtpTransportOptions {
  return {
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTls,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: SMTP_TIMEOUTS_MS.connectionTimeout,
    greetingTimeout: SMTP_TIMEOUTS_MS.greetingTimeout,
    socketTimeout: SMTP_TIMEOUTS_MS.socketTimeout,
    tls: { rejectUnauthorized: true },
  };
}

/**
 * Produces a log-safe description of a send failure.
 *
 * Exception messages and SMTP response bodies are NEVER copied into the
 * output: they can carry hostnames, connection details, credentials, or
 * user-submitted content. Only controlled categories are returned — the
 * allowlisted error class (sanitized), the numeric SMTP `responseCode`, and a
 * pattern-allowlisted `code` token (e.g. `ECONNREFUSED`) — plus the
 * `MailConfigError` message, which is authored in this module and contains
 * only setting names and validated port numbers.
 */
const SAFE_ERROR_NAME = /^[A-Za-z][A-Za-z0-9]{0,49}$/;
const SAFE_ERROR_CODE = /^[A-Z0-9_]{1,32}$/;

export function describeMailError(error: unknown): string {
  try {
    if (error instanceof MailConfigError) {
      return `MailConfigError: ${error.message}`;
    }
    if (error && typeof error === 'object') {
      const candidate = error as {
        name?: unknown;
        code?: unknown;
        response?: unknown;
        responseCode?: unknown;
      };
      const name =
        typeof candidate.name === 'string' && SAFE_ERROR_NAME.test(candidate.name)
          ? candidate.name
          : 'Error';
      const parts = [name];
      if (
        typeof candidate.responseCode === 'number' &&
        Number.isFinite(candidate.responseCode)
      ) {
        parts.push(`responseCode=${candidate.responseCode}`);
      }
      if (
        typeof candidate.code === 'string' &&
        SAFE_ERROR_CODE.test(candidate.code)
      ) {
        parts.push(`code=${candidate.code}`);
      }
      return parts.join(' ');
    }
    return 'unknown error';
  } catch {
    return 'unknown error';
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildSubject(inquiry: string): string {
  return `HTG inquiry — ${inquiry}`;
}

export function buildTextBody(
  details: InquiryDetails,
  receivedAt: Date = new Date(),
): string {
  return [
    'New website inquiry',
    '',
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Inquiry type: ${details.inquiry}`,
    `Artist / company: ${details.artist ?? 'Not provided'}`,
    `Received: ${receivedAt.toISOString()}`,
    '',
    'Message:',
    details.message,
  ].join('\n');
}

export function buildHtmlBody(
  details: InquiryDetails,
  receivedAt: Date = new Date(),
): string {
  const e = escapeHtml;
  const artist = details.artist ? e(details.artist) : 'Not provided';
  return [
    '<h2>New website inquiry</h2>',
    '<dl>',
    `<dt>Name</dt><dd>${e(details.name)}</dd>`,
    `<dt>Email</dt><dd>${e(details.email)}</dd>`,
    `<dt>Inquiry type</dt><dd>${e(details.inquiry)}</dd>`,
    `<dt>Artist / company</dt><dd>${artist}</dd>`,
    `<dt>Received</dt><dd>${e(receivedAt.toISOString())}</dd>`,
    '</dl>',
    '<h3>Message</h3>',
    `<p>${e(details.message).replace(/\n/g, '<br />')}</p>`,
  ].join('\n');
}

export async function sendInquiryMail(
  details: InquiryDetails,
  config: MailConfig = getMailConfig(),
): Promise<void> {
  const transport = nodemailer.createTransport(buildTransportOptions(config));

  await transport.sendMail({
    from: `"Hopkins Talent Group" <${config.from}>`,
    to: config.to,
    replyTo: { name: details.name, address: details.email },
    subject: buildSubject(details.inquiry),
    text: buildTextBody(details),
    html: buildHtmlBody(details),
  });
}
