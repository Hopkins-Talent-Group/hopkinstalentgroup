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

function optionalFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === '') return fallback;
  return value.trim().toLowerCase() === 'true';
}

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

  const port = Number(env.SMTP_PORT ?? 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new MailConfigError('SMTP_PORT must be a valid TCP port.');
  }

  const secure = optionalFlag(env.SMTP_SECURE, port === 465);
  const requireTls = optionalFlag(env.SMTP_REQUIRE_TLS, !secure);

  return { host, port, secure, requireTls, user, pass, from, to };
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
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTls,
    auth: { user: config.user, pass: config.pass },
  });

  await transport.sendMail({
    from: `"Hopkins Talent Group" <${config.from}>`,
    to: config.to,
    replyTo: { name: details.name, address: details.email },
    subject: buildSubject(details.inquiry),
    text: buildTextBody(details),
    html: buildHtmlBody(details),
  });
}
