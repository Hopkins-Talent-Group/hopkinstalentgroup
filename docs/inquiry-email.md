# Inquiry Email — Website to Our Own VPS

This site submits contact-form inquiries over authenticated SMTP to a mail
server we operate. No third-party email delivery provider is involved.

## Architecture

```
Visitor → InquiryForm (client) → submitInquiry() → POST /api/contact (Next.js route handler)
       → rate limit → body-size cap → honeypot → validation
       → nodemailer (SMTP submission, AUTH + TLS) → our VPS mail server (e.g. cPanel/Exim)
       → recipient mail server
```

Server-side pieces:

- `app/api/contact/route.ts` — HTTP endpoint: rate limiting, request parsing,
  honeypot, validation, safe JSON responses.
- `lib/contact/bodyLimit.ts` — 32 KB request-body cap enforced both from
  `Content-Length` (early reject) and while streaming (anti-bypass).
- `lib/contact/clientIp.ts` — trusted client-IP strategy for the rate limiter
  (see "Client IP trust" below).
- `lib/contact/rateLimit.ts` — per-key fixed-window limiter (in-memory,
  per-instance) with bounded cleanup and fail-closed env parsing.
- `lib/contact/validation.ts` — field normalization, length limits, inquiry
  allowlist, CR/LF stripping (header-injection prevention).
- `lib/contact/mail.ts` — SMTP config validation (strict TLS matrix, explicit
  timeouts), message construction, log-safe error descriptions.
- `lib/contact/submit.ts` — client-side submission helper; maps every HTTP
  failure mode to a safe user-facing message.

The client never supplies recipient, sender, or any mail header. The recipient
is always `CONTACT_FROM_EMAIL`'s counterpart `CONTACT_TO_EMAIL`.

## Deployment target (verified vs. to verify)

- The production site answers with `Server: Vercel` and an `X-Vercel-Id`
  header, and `www` DNS points at `vercel-dns-017.com`, so the app is believed
  to run on **Vercel serverless functions**.
- There is **no** `vercel.json` or other deployment manifest in this
  repository; the platform owner must confirm this before relying on
  platform-specific behavior (especially the trusted client-IP handling and
  where to set environment variables).
- If the app is later moved to another platform or a self-hosted Node server,
  revisit "Client IP trust" and the environment-variable location below. Both
  are documented with alternatives.

## Client IP trust (rate-limit keys)

Forwarding headers (`x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`) are
client-controllable unless a trusted proxy overwrites them. The app therefore:

1. **Only trusts forwarding headers when the platform marker `VERCEL=1` is
   present** in the environment (set automatically by Vercel; not a secret).
2. In that mode, prefers `x-real-ip` (set/overwritten by Vercel's edge) and
   falls back to the **last** entry of `x-forwarded-for` (the address the
   platform appends). Header values are validated as IPv4/IPv6 before use.
3. **Everywhere else** (local dev, unknown proxies, self-hosted servers) no
   forwarding header is trusted and all clients share one conservative bucket
   key, `untrusted`. This fails closed toward *more* limiting, but it also
   means a single noisy client can exhaust the shared bucket and temporarily
   slow other submissions on that instance. That trade-off is deliberate:
   pretending spoofable headers are trustworthy would let an attacker mint
   unlimited buckets and bypass the limiter entirely.
4. If platform headers are present but malformed, the request also lands in
   the `untrusted` bucket.

**Must be verified by the operator:** that Vercel still overwrites `x-real-ip`
at the edge and appends (not overwrites with attacker data) the client address
in `x-forwarded-for`. If that ever changes, adjust `lib/contact/clientIp.ts`.

## Rate limiting — actual scope and limitations

- Algorithm: fixed window, per key (client IP when trusted, otherwise the
  shared `untrusted` key). Defaults: **5 submissions per 10 minutes**.
- Storage: an **in-memory Map in one Node.js process**. On Vercel serverless
  this runs **per function instance** — warm instances share their counter,
  cold starts start empty, and concurrent instances do **not** see each
  other's counts. **This is not distributed or globally enforced rate
  limiting** and must not be relied on as such.
- The project has **no shared store** (no KV, Redis, or Upstash dependency).
  Adding one would require new infrastructure/cost and was deliberately
  avoided; the honeypot and body-size cap provide additional, store-free
  abuse protection. If stronger enforcement is needed later, back
  `rateLimitAllows` with a shared store.
- Cleanup: expired buckets are pruned at most once per minute and the map is
  hard-capped (~10k keys, oldest evicted), so it cannot grow without bound.
  Under extreme key cardinality an unexpired bucket may be evicted early,
  briefly granting extra allowance — acceptable for this endpoint.
- Env parsing fails closed: `CONTACT_RATE_LIMIT_MAX` /
  `CONTACT_RATE_LIMIT_WINDOW_MS` must be integers in documented ranges; any
  invalid or empty value falls back to the default instead of disabling
  protection. Only an explicit `CONTACT_RATE_LIMIT_MAX=0` disables it
  (documented, for local debugging).

## Request-body limit

- Maximum: **32 KB** (`MAX_BODY_BYTES` in `lib/contact/bodyLimit.ts`), far
  above the largest legitimate inquiry (fields cap at ~5.5 KB of content).
- An oversized declared `Content-Length` is rejected with `413` before the
  body is read.
- The cap is also enforced while streaming, so a missing or dishonest
  `Content-Length` cannot cause unbounded buffering; the reader is cancelled
  when the cap is hit.
- Only `application/json` (optionally with a `charset` parameter) is accepted;
  anything else returns `415`. Empty bodies and invalid JSON return `400`.
- Error format is always `{ "ok": false, "error": "<safe message>" }` (plus
  `errors` map for `422`). Submitted data and parser/SMTP details are never
  echoed.

## Environment variables

Copy `.env.example` to `.env.local` (local) or set them in the deployment
platform's server-side environment settings (production). Placeholders only —
never commit real values.

| Variable | Required | Default | Valid values |
| --- | --- | --- | --- |
| `SMTP_HOST` | yes | — | Plain hostname, ≤253 chars, no spaces/special characters |
| `SMTP_PORT` | no | `587` | Integer 1–65535; 465/587 have strict TLS rules (below) |
| `SMTP_SECURE` | see TLS matrix | port-dependent | `true`/`false` (or `1`/`0`); anything else is rejected |
| `SMTP_REQUIRE_TLS` | see TLS matrix | port-dependent | `true`/`false` (or `1`/`0`); anything else is rejected |
| `SMTP_USER` | yes | — | Non-empty, no CR/LF |
| `SMTP_PASS` | yes | — | Non-empty; store as a secret |
| `CONTACT_FROM_EMAIL` | yes | — | Valid address on our domain, ≤254 chars |
| `CONTACT_TO_EMAIL` | yes | — | Valid fixed recipient address |
| `CONTACT_RATE_LIMIT_MAX` | no | `5` | Integer 0–10000; `0` = deliberately disabled |
| `CONTACT_RATE_LIMIT_WINDOW_MS` | no | `600000` | Integer 1000–86400000 |

### TLS matrix (enforced, not advisory)

| Port | Mode | Rules |
| --- | --- | --- |
| 465 | Implicit TLS (`secure: true`) | `SMTP_SECURE=false` is rejected; `SMTP_REQUIRE_TLS=true` is rejected |
| 587 | STARTTLS, upgrade mandatory | `SMTP_SECURE=true` is rejected; `SMTP_REQUIRE_TLS=false` is rejected (no plaintext fallback) |
| other (e.g. 1025 for Mailpit) | Explicit | **Both** `SMTP_SECURE` and `SMTP_REQUIRE_TLS` must be set; missing either is a configuration error |

Certificate verification is always on (`rejectUnauthorized: true`); nothing
in this codebase disables it. Timeouts are explicit constants in
`lib/contact/mail.ts`: connection 10 s, greeting 10 s, socket 20 s.

## Testing locally without exposing credentials

1. Copy `.env.example` → `.env.local` and fill in development values only.
   `.env*` is gitignored; `.env.example` is the only tracked env file.
2. `npm run dev`, open `http://localhost:3000`, and submit the form.
3. Without a reachable SMTP server, expect the form's friendly error state and
   a `502`/`503` JSON body from `/api/contact` — never credentials or stack
   traces (the route logs only sanitized error classes/codes).
4. To exercise a real SMTP conversation locally without touching production
   mail, run a local SMTP sink such as Mailpit (`mailpit`, listens on
   `127.0.0.1:1025` with no auth) and set:
   `SMTP_HOST=127.0.0.1`, `SMTP_PORT=1025`, `SMTP_SECURE=false`,
   `SMTP_REQUIRE_TLS=false`, plus any dummy `SMTP_USER`/`SMTP_PASS`.
   (The non-standard port requires both TLS flags to be explicit.)
5. Automated tests (no network, no credentials):
   `npm test` — validation, rate limiting, client-IP trust, body limits,
   SMTP config/TLS matrix, message builders, client submission mapping, and
   the API route (mail sending mocked).

## Testing delivery against the VPS without exposing credentials

1. Set the real `SMTP_*` / `CONTACT_*` values only in the deployment
   platform's environment settings or a private `.env.local` that is never
   committed or pasted into tickets/chat.
2. Submit one test inquiry from the site (or `curl` the endpoint with a valid
   JSON body). A `200` means the VPS SMTP service **accepted** the message.
3. Confirm receipt in `CONTACT_TO_EMAIL` and check the MTA's log on the VPS
   (e.g. cPanel Exim `/var/log/exim_mainlog`) for the message.
4. Reply to the message and confirm the reply reaches the submitter
   (`Reply-To`).
5. For authentication checks, use `mail-tester.com` with a one-off submission
   and inspect the `Authentication-Results` headers of a received message in
   Gmail/Outlook. Never put production credentials into third-party tester
   services.

## Storing credentials in production

- Set variables in the production platform's **server-side** environment
  settings (for Vercel: Project → Settings → Environment Variables; mark
  `SMTP_PASS` as sensitive). They are only ever read in the Node.js route
  handler and never shipped to the browser.
- Use a dedicated mailbox for `SMTP_USER` with a strong, unique password. The
  VPS must require AUTH on the submission port — never an unauthenticated
  relay.

## Application success vs. inbox delivery

- An API `200` means the VPS SMTP service **accepted** the message, not that
  the recipient inbox received it. Final delivery depends on SPF/DKIM/DMARC,
  PTR, TLS, and the receiver's policy.
- Verify end-to-end by sending to real inboxes (Gmail, Outlook) and inspecting
  `Authentication-Results`; use `mail-tester.com` for a score.
- Bounce handling and delivery monitoring (postmaster mailbox, DMARC `rua`
  reports) are operational follow-ups, not implemented in the app.

## Administrator checklist (VPS + DNS)

These are server-side and cannot be verified from the repository:

- [ ] Confirm OS and control panel (AlmaLinux + cPanel/WHM?) and root SSH
      access.
- [ ] Identify the MTA (Exim on cPanel, Postfix, other) and whether it already
      serves other domains. Integrate with it; do not install a second MTA.
- [ ] Create the sending mailbox and enable authenticated submission
      (Exim: *Service Manager → Exim Configuration Manager*, ACL for `AUTH`
      on the submission port). Restrict to the app's egress IPs if practical.
- [ ] Firewall: allow the submission port (587/465) inbound from the app host
      and allow outbound SMTP from the VPS.
- [ ] Hostname and reverse DNS/PTR for the VPS (required by many receivers).
- [ ] TLS certificate valid for the mail hostname (cPanel AutoSSL or LE).
- [ ] DNS for the sending domain:
  - `MX` for the domain (so bounces return to us).
  - `SPF`: include the VPS's sending IP/HELO, e.g. `v=spf1 a mx ip4:X.X.X.X -all`.
  - `DKIM`: generate a key in cPanel/WHM (or `opendkim`) and publish the
    selector record; ensure Exim signs outbound mail.
  - `DMARC`: start with `p=none` + `rua=` reports, move to
    `p=quarantine`/`p=reject` once authentication is verified.

## Troubleshooting

| Symptom | Likely cause | Where to look |
| --- | --- | --- |
| Form shows "temporarily unavailable" (503) | SMTP env vars missing/inconsistent — the app rejects invalid TLS combinations on purpose | Server log line `Inquiry mail not configured:` (names the setting, not secrets); fix env vars |
| `535` / `responseCode=535` in app logs | Wrong `SMTP_USER`/`SMTP_PASS`, or AUTH not enabled for that account | App env vars; cPanel *Email Accounts*; Exim log `/var/log/exim_mainlog` |
| Connection timeout/refused | Firewall blocks port, wrong host/port, MTA not listening externally | `nc -vz mail.domain 587` from the app host; `ss -lntp`; WHM service manager |
| TLS handshake error | Certificate mismatch or STARTTLS not offered | `openssl s_client -connect mail.domain:587 -starttls smtp` |
| `550` "Sender verify failed" | Envelope sender domain has no MX/A, or recipient checks HELO | DNS for `CONTACT_FROM_EMAIL` domain; Exim log |
| Form shows "too long" (413) | Payload over 32 KB — check for stray large fields or a misbehaving client | Browser dev tools; request size |
| Form shows "request could not be processed" (400/415) | Wrong content type or malformed JSON | Browser dev tools; ensure the client posts `application/json` |
| Immediate 429 despite few submissions | All clients share the `untrusted` bucket (no trusted platform marker), or per-instance counters | Confirm `VERCEL=1` on the platform; see "Client IP trust" |
| API returns 502 but mail appears in Exim log | Remote MTA rejected after acceptance attempt | Exim log; headers of received message |
| Mail lands in spam | SPF/DKIM/DMARC failure, missing PTR, content reputation | `mail-tester.com`, header `Authentication-Results` |

App logs contain only sanitized error classes/codes (never SMTP responses,
message bodies, or credentials). For full SMTP dialogue diagnostics, use the
MTA's own log on the VPS.

## Security properties of the app side

- Credentials only in server-side env vars; never sent to the browser.
- Fixed `From`/`To`; visitor address only in validated `Reply-To`.
- CR/LF stripped from all single-line fields; `inquiry` must match a server
  allowlist, so the subject cannot carry injected headers; SMTP host/user and
  envelope addresses are validated against CR/LF and format rules.
- Honeypot field (silently dropped), per-IP rate limiting (per-instance — see
  limitations), and a 32 KB body cap enforced from headers and the stream.
- All user content is HTML-escaped in the HTML part of the message.
- Responses are generic; SMTP errors and stack traces stay in server logs and
  are reduced to error class + numeric code before logging.
- TLS certificate verification is always enabled; explicit connection,
  greeting, and socket timeouts bound hung SMTP sessions.

## Work blocked until VPS verification

- Confirming which MTA/cPanel version runs and whether authenticated
  submission is already available.
- Creating the sending mailbox, firewall rules, PTR, and DNS
  (SPF/DKIM/DMARC) records.
- Any change to Exim/Postfix configuration — requires explicit approval per
  the change-control rules; nothing in this repository alters the MTA.
- Confirming the deployment platform details noted above.
