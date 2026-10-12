# Inquiry Email — Website to Our Own VPS

This site submits contact-form inquiries over authenticated SMTP to a mail
server we operate. No third-party email delivery provider is involved.

## Architecture

```
Visitor → InquiryForm (client) → POST /api/contact (Next.js route handler)
       → nodemailer (SMTP submission, AUTH + TLS) → our VPS mail server (e.g. cPanel/Exim)
       → recipient mail server
```

Server-side pieces:

- `app/api/contact/route.ts` — HTTP endpoint: rate limiting, honeypot,
  validation, safe responses.
- `lib/contact/validation.ts` — field normalization, length limits, inquiry
  allowlist, CR/LF stripping (header-injection prevention).
- `lib/contact/rateLimit.ts` — per-client-IP fixed-window limiter (in-memory).
- `lib/contact/mail.ts` — SMTP config from env + message construction
  (nodemailer). `From` and `To` are fixed server-side; the visitor address is
  only ever placed in `Reply-To` after validation.

The client never supplies recipient, sender, or any mail header. The recipient
is always `CONTACT_TO_EMAIL`.

## Required environment variables

Copy `.env.example` to `.env.local` (local) or set them in the deployment
platform (production). Placeholders only — never commit real values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SMTP_HOST` | yes | Mail server hostname, e.g. `mail.yourdomain.com` |
| `SMTP_PORT` | no (587) | Submission port; usually 587 (STARTTLS) or 465 (implicit TLS) |
| `SMTP_SECURE` | no | `true` = implicit TLS (port 465); default `true` only when port is 465 |
| `SMTP_REQUIRE_TLS` | no | Force TLS upgrade on plaintext ports; default `true` when not secure |
| `SMTP_USER` | yes | SMTP account used for AUTH |
| `SMTP_PASS` | yes | SMTP password (store as a secret, never in git) |
| `CONTACT_FROM_EMAIL` | yes | Verified sender on our domain, e.g. `inquiries@yourdomain.com` |
| `CONTACT_TO_EMAIL` | yes | Fixed recipient inbox |
| `CONTACT_RATE_LIMIT_MAX` | no (5) | Submissions allowed per window per client IP; `0` disables |
| `CONTACT_RATE_LIMIT_WINDOW_MS` | no (600000) | Rate-limit window in milliseconds |

## Testing locally without exposing credentials

1. Copy `.env.example` → `.env.local` and fill in development values only.
   `.env*` is gitignored; `.env.example` is the only tracked env file.
2. `npm run dev`, open `http://localhost:3000`, and submit the form.
3. Without a reachable SMTP server, expect the form's friendly error state and
   a `502`/`503` JSON body from `/api/contact` — never credentials or stack
   traces (the route logs messages server-side only).
4. To exercise a real SMTP conversation locally without touching production
   mail, run a local SMTP sink such as Mailpit (`mailpit`, listens on
   `127.0.0.1:1025` with no auth) and point `SMTP_HOST=127.0.0.1`,
   `SMTP_PORT=1025`, `SMTP_SECURE=false`, `SMTP_REQUIRE_TLS=false`, plus any
   dummy `SMTP_USER`/`SMTP_PASS`.
5. Automated tests (no network, no credentials):
   - `npm test` — validation, rate limiting, message builders, and the API
     route (mail sending mocked).

## Production configuration

1. Set the variables above in the production environment (e.g. Vercel project
   settings → Environment Variables). Treat `SMTP_PASS` as a secret.
2. Use a dedicated mailbox for `SMTP_USER` (e.g. `inquiries@yourdomain.com`)
   with a strong, unique password. The VPS must allow authenticated submission
   on the chosen port — do not open an unauthenticated relay.
3. Confirm outbound TCP from the app host to `SMTP_HOST:SMTP_PORT` is allowed
   (test with `nc -vz mail.yourdomain.com 587` or equivalent).
4. Deploy through the normal review flow; this repository change alone does not
   configure the VPS.

## Administrator checklist (VPS + DNS)

These are server-side and cannot be verified from the repository:

- [ ] Confirm OS and control panel (AlmaLinux + cPanel/WHM?) and root SSH
      access.
- [ ] Identify the MTA (Exim on cPanel, Postfix, other) and whether it already
      serves other domains. Integrate with it; do not install a second MTA.
- [ ] Create the sending mailbox and enable authenticated submission
      (Exim: *Service Manager → Exim Configuration Manager*, ACL for
      `AUTH` on the submission port). Restrict to the subnet/VPS IP if the app
      runs elsewhere.
- [ ] Firewall: allow the submission port (587/465) inbound from the app host
      and allow outbound SMTP (25/587) from the VPS.
- [ ] Hostname and reverse DNS/PTR for the VPS (required by many receivers).
- [ ] TLS certificate valid for the mail hostname (cPanel AutoSSL or LE).
- [ ] DNS for the sending domain:
  - `MX` for the domain (so bounces return to us).
  - `SPF`: include the VPS's sending IP/HELO, e.g. `v=spf1 a mx ip4:X.X.X.X -all`.
  - `DKIM`: generate a key in cPanel/WHM (or `opendkim`) and publish the
    selector record; ensure Exim signs outbound mail.
  - `DMARC`: start with `p=none` + `rua=` reports, move to `p=quarantine`/`p=reject`
    once authentication is verified.

## Troubleshooting

| Symptom | Likely cause | Where to look |
| --- | --- | --- |
| `535` / "Authentication failed" | Wrong `SMTP_USER`/`SMTP_PASS`, or AUTH not enabled for that account | App env vars; cPanel *Email Accounts*; Exim log `/var/log/exim_mainlog` |
| Connection timeout/refused | Firewall blocks port, wrong host/port, MTA not listening externally | `telnet`/`nc` from the app host; `ss -lntp`; WHM service manager |
| TLS handshake error | Certificate mismatch or STARTTLS not offered | `openssl s_client -connect mail.domain:587 -starttls smtp` |
| `550` "Sender verify failed" | Envelope sender domain has no MX/A, or recipient checks HELO | DNS for `CONTACT_FROM_EMAIL` domain; Exim log |
| API returns 502 but mail appears in Exim log | Remote MTA rejected after acceptance attempt | Exim log; headers of received message |
| Mail lands in spam | SPF/DKIM/DMARC failure, missing PTR, content reputation | `mail-tester.com`, header `Authentication-Results` |
| Works once, then 502s | Per-IP rate limit or MTA connection limits | `CONTACT_RATE_LIMIT_MAX`, Exim *Mail/SMTP* settings |

In application logs, only error messages are printed — never credentials. If
SMTP works from the VPS CLI but not from the app, compare the hostname and
credentials the app uses versus the CLI test.

## Deliverability caveats

- An API `200` means the VPS SMTP service **accepted** the message, not that
  the recipient inbox received it. Final delivery depends on SPF/DKIM/DMARC,
  PTR, TLS, and the receiver's policy.
- Verify end-to-end by sending to real inboxes (Gmail, Outlook) and inspecting
  `Authentication-Results` headers; use `mail-tester.com` for a score.
- Bounce handling and delivery monitoring (postmaster mailbox, `rua` DMARC
  reports) are operational follow-ups, not implemented in the app.

## Security properties of the app side

- Credentials only in server-side env vars; never sent to the browser.
- Fixed `From`/`To`; visitor address only in validated `Reply-To`.
- CR/LF stripped from all single-line fields; `inquiry` must match a server
  allowlist, so the subject cannot carry injected headers.
- Honeypot field (silently dropped) + per-IP rate limiting. The limiter is
  in-memory and per-instance; on a multi-instance deployment back it with a
  shared store (e.g. Upstash/KV) before relying on it.
- All user content is HTML-escaped in the HTML part of the message.
- Responses are generic; SMTP errors and stack traces stay in server logs.

## Work blocked until VPS verification

- Confirming which MTA/cPanel version runs and whether authenticated
  submission is already available.
- Creating the sending mailbox, firewall rules, PTR, and DNS
  (SPF/DKIM/DMARC) records.
- Any change to Exim/Postfix configuration — requires explicit approval per
  the change-control rules; nothing in this repository alters the MTA.
