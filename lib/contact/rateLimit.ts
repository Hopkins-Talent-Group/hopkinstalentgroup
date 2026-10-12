export const DEFAULT_RATE_LIMIT_MAX = 5;
export const DEFAULT_RATE_LIMIT_WINDOW_MS = 600_000;

const MAX_BUCKETS = 10_000;
const PRUNE_INTERVAL_MS = 60_000;
const ENV_MAX_MAX = 10_000;
const ENV_MAX_WINDOW_MS = 86_400_000;
const ENV_MIN_WINDOW_MS = 1_000;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
let lastPruneAt = 0;

function prune(now: number, force: boolean): void {
  const intervalElapsed = now - lastPruneAt >= PRUNE_INTERVAL_MS;
  if (!force && !intervalElapsed && buckets.size < MAX_BUCKETS) return;

  lastPruneAt = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  while (buckets.size > MAX_BUCKETS) {
    const oldest = buckets.keys().next();
    if (oldest.done) break;
    buckets.delete(oldest.value);
  }
}

/**
 * Fixed-window in-memory rate limiter. Scope is a single Node.js process: on a
 * serverless or horizontally scaled deployment each instance keeps its own
 * counters, so this is NOT distributed protection. See docs/inquiry-email.md.
 *
 * Invalid (non-finite) limit/window values fall back to the defaults instead
 * of disabling protection. A limit of exactly 0 disables the limiter and must
 * be set explicitly.
 */
export function rateLimitAllows(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): boolean {
  const effectiveLimit =
    Number.isFinite(limit) && limit >= 0 ? limit : DEFAULT_RATE_LIMIT_MAX;
  const effectiveWindow =
    Number.isFinite(windowMs) && windowMs > 0
      ? windowMs
      : DEFAULT_RATE_LIMIT_WINDOW_MS;

  if (effectiveLimit === 0) return true;

  prune(now, false);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) prune(now, true);
    buckets.set(key, { count: 1, resetAt: now + effectiveWindow });
    return true;
  }

  if (existing.count >= effectiveLimit) return false;

  existing.count += 1;
  return true;
}

export function parsePositiveInt(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  if (raw === undefined || raw.trim() === '') return fallback;
  const parsed = Number(raw.trim());
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return fallback;
  }
  return parsed;
}

export function parseRateLimitConfig(
  env: Record<string, string | undefined> = process.env,
): { max: number; windowMs: number } {
  return {
    max: parsePositiveInt(
      env.CONTACT_RATE_LIMIT_MAX,
      DEFAULT_RATE_LIMIT_MAX,
      0,
      ENV_MAX_MAX,
    ),
    windowMs: parsePositiveInt(
      env.CONTACT_RATE_LIMIT_WINDOW_MS,
      DEFAULT_RATE_LIMIT_WINDOW_MS,
      ENV_MIN_WINDOW_MS,
      ENV_MAX_WINDOW_MS,
    ),
  };
}

export function resetRateLimits(): void {
  buckets.clear();
  lastPruneAt = 0;
}

export function rateLimitBucketCount(): number {
  return buckets.size;
}

export const RATE_LIMIT_MAX_BUCKETS = MAX_BUCKETS;
