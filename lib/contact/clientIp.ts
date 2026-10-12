const MAX_IP_LENGTH = 45;

const IPV4_PATTERN = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IPV6_PATTERN = /^[0-9a-fA-F:.]+$/;

function sanitizeIp(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value || value.length > MAX_IP_LENGTH) return null;

  if (IPV4_PATTERN.test(value)) {
    const octets = value.split('.').map(Number);
    if (octets.every((octet) => octet >= 0 && octet <= 255)) {
      return value;
    }
    return null;
  }

  if (value.includes(':') && IPV6_PATTERN.test(value)) {
    return value;
  }

  return null;
}

/**
 * Returns a rate-limit bucket key for the request.
 *
 * Forwarding headers are only consulted when the request is known to come
 * through the platform's trusted proxy: Vercel sets `VERCEL=1` in the
 * environment and overwrites `x-real-ip` at its edge, so that value cannot be
 * forged by the client. `x-forwarded-for` is used only as a fallback and only
 * its last entry is considered (the address appended by the platform).
 *
 * Outside that environment (local dev, unknown/self-hosted proxies) no
 * forwarding header is trusted and all clients share a single conservative
 * `untrusted` bucket. See docs/inquiry-email.md.
 */
export function getClientIpKey(
  request: Request,
  env: Record<string, string | undefined> = process.env,
): string {
  if (env.VERCEL !== '1') {
    return 'untrusted';
  }

  const realIp = sanitizeIp(request.headers.get('x-real-ip'));
  if (realIp) return realIp;

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',');
    for (let i = parts.length - 1; i >= 0; i -= 1) {
      const candidate = sanitizeIp(parts[i]);
      if (candidate) return candidate;
    }
  }

  return 'untrusted';
}
