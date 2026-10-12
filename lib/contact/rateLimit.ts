interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const PRUNE_THRESHOLD = 1000;

function prune(now: number): void {
  if (buckets.size < PRUNE_THRESHOLD) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Fixed-window in-memory rate limiter. Suitable for a single Node.js instance;
 * a multi-instance deployment should back this with a shared store (see
 * docs/inquiry-email.md).
 */
export function rateLimitAllows(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): boolean {
  if (limit <= 0 || windowMs <= 0) return true;

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    prune(now);
    return true;
  }

  if (existing.count >= limit) return false;

  existing.count += 1;
  return true;
}

/** Test helper — clears all buckets. */
export function resetRateLimits(): void {
  buckets.clear();
}
