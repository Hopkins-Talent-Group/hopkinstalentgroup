import { afterEach, describe, expect, it, vi } from 'vitest';
import { rateLimitAllows, resetRateLimits } from '@/lib/contact/rateLimit';

describe('rateLimitAllows', () => {
  afterEach(() => {
    resetRateLimits();
    vi.useRealTimers();
  });

  it('allows requests under the limit and blocks once exhausted', () => {
    vi.useFakeTimers();
    const now = Date.now();
    const key = 'ip-1';

    expect(rateLimitAllows(key, 3, 60_000, now)).toBe(true);
    expect(rateLimitAllows(key, 3, 60_000, now)).toBe(true);
    expect(rateLimitAllows(key, 3, 60_000, now)).toBe(true);
    expect(rateLimitAllows(key, 3, 60_000, now)).toBe(false);
  });

  it('tracks keys independently', () => {
    const now = Date.now();
    expect(rateLimitAllows('ip-a', 1, 60_000, now)).toBe(true);
    expect(rateLimitAllows('ip-a', 1, 60_000, now)).toBe(false);
    expect(rateLimitAllows('ip-b', 1, 60_000, now)).toBe(true);
  });

  it('resets after the window elapses', () => {
    const start = Date.now();
    expect(rateLimitAllows('ip-2', 1, 60_000, start)).toBe(true);
    expect(rateLimitAllows('ip-2', 1, 60_000, start + 30_000)).toBe(false);
    expect(rateLimitAllows('ip-2', 1, 60_000, start + 60_001)).toBe(true);
  });

  it('treats non-positive limits as disabled', () => {
    const now = Date.now();
    expect(rateLimitAllows('ip-3', 0, 60_000, now)).toBe(true);
    expect(rateLimitAllows('ip-3', 0, 60_000, now)).toBe(true);
  });
});
