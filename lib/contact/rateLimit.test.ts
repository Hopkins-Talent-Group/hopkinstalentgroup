import { afterEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_RATE_LIMIT_MAX,
  DEFAULT_RATE_LIMIT_WINDOW_MS,
  parsePositiveInt,
  parseRateLimitConfig,
  RATE_LIMIT_MAX_BUCKETS,
  rateLimitAllows,
  rateLimitBucketCount,
  resetRateLimits,
} from '@/lib/contact/rateLimit';

afterEach(() => {
  resetRateLimits();
});

describe('rateLimitAllows', () => {
  it('allows requests under the limit and blocks once exhausted', () => {
    const now = 1_000_000;
    const key = 'ip-1';

    expect(rateLimitAllows(key, 3, 60_000, now)).toBe(true);
    expect(rateLimitAllows(key, 3, 60_000, now)).toBe(true);
    expect(rateLimitAllows(key, 3, 60_000, now)).toBe(true);
    expect(rateLimitAllows(key, 3, 60_000, now)).toBe(false);
  });

  it('tracks keys independently', () => {
    const now = 1_000_000;
    expect(rateLimitAllows('ip-a', 1, 60_000, now)).toBe(true);
    expect(rateLimitAllows('ip-a', 1, 60_000, now)).toBe(false);
    expect(rateLimitAllows('ip-b', 1, 60_000, now)).toBe(true);
  });

  it('resets after the window elapses', () => {
    const start = 1_000_000;
    expect(rateLimitAllows('ip-2', 1, 60_000, start)).toBe(true);
    expect(rateLimitAllows('ip-2', 1, 60_000, start + 30_000)).toBe(false);
    expect(rateLimitAllows('ip-2', 1, 60_000, start + 60_001)).toBe(true);
  });

  it('treats a limit of exactly 0 as explicitly disabled', () => {
    const now = 1_000_000;
    expect(rateLimitAllows('ip-3', 0, 60_000, now)).toBe(true);
    expect(rateLimitAllows('ip-3', 0, 60_000, now)).toBe(true);
    expect(rateLimitBucketCount()).toBe(0);
  });

  it('fails closed to the default limit when the limit is not a finite number', () => {
    const now = 1_000_000;
    for (let i = 0; i < DEFAULT_RATE_LIMIT_MAX; i += 1) {
      expect(rateLimitAllows('ip-nan', Number.NaN, 60_000, now)).toBe(true);
    }
    expect(rateLimitAllows('ip-nan', Number.NaN, 60_000, now)).toBe(false);
  });

  it('fails closed to the default window when the window is invalid', () => {
    const now = 1_000_000;
    expect(DEFAULT_RATE_LIMIT_WINDOW_MS).toBe(600_000);
    for (let i = 0; i < DEFAULT_RATE_LIMIT_MAX; i += 1) {
      expect(
        rateLimitAllows('ip-win', DEFAULT_RATE_LIMIT_MAX, Number.NaN, now),
      ).toBe(true);
    }
    expect(
      rateLimitAllows('ip-win', DEFAULT_RATE_LIMIT_MAX, Number.NaN, now),
    ).toBe(false);
  });

  it('prunes expired buckets and stays bounded under key cardinality', () => {
    const start = 1_000_000;
    const total = RATE_LIMIT_MAX_BUCKETS + 500;
    for (let i = 0; i < total; i += 1) {
      rateLimitAllows(`key-${i}`, 5, 60_000, start);
    }
    expect(rateLimitBucketCount()).toBeLessThanOrEqual(
      RATE_LIMIT_MAX_BUCKETS + 1,
    );

    const later = start + 120_000;
    rateLimitAllows('fresh-key', 5, 60_000, later);
    const expectedPruned =
      rateLimitBucketCount() <= 2;
    expect(expectedPruned).toBe(true);
  });
});

describe('parsePositiveInt', () => {
  it('returns the fallback for missing or empty values', () => {
    expect(parsePositiveInt(undefined, 5, 0, 100)).toBe(5);
    expect(parsePositiveInt('', 5, 0, 100)).toBe(5);
    expect(parsePositiveInt('   ', 5, 0, 100)).toBe(5);
  });

  it('returns the parsed value when valid', () => {
    expect(parsePositiveInt('7', 5, 0, 100)).toBe(7);
    expect(parsePositiveInt(' 7 ', 5, 0, 100)).toBe(7);
  });

  it('returns the fallback for invalid or out-of-range values', () => {
    expect(parsePositiveInt('abc', 5, 0, 100)).toBe(5);
    expect(parsePositiveInt('1.5', 5, 0, 100)).toBe(5);
    expect(parsePositiveInt('-1', 5, 0, 100)).toBe(5);
    expect(parsePositiveInt('101', 5, 0, 100)).toBe(5);
  });
});

describe('parseRateLimitConfig', () => {
  it('uses documented defaults when unset', () => {
    expect(parseRateLimitConfig({})).toEqual({
      max: DEFAULT_RATE_LIMIT_MAX,
      windowMs: DEFAULT_RATE_LIMIT_WINDOW_MS,
    });
  });

  it('parses valid values', () => {
    expect(
      parseRateLimitConfig({
        CONTACT_RATE_LIMIT_MAX: '20',
        CONTACT_RATE_LIMIT_WINDOW_MS: '30000',
      }),
    ).toEqual({ max: 20, windowMs: 30000 });
  });

  it('falls back to defaults for invalid values instead of disabling', () => {
    expect(
      parseRateLimitConfig({
        CONTACT_RATE_LIMIT_MAX: 'lots',
        CONTACT_RATE_LIMIT_WINDOW_MS: 'soon',
      }),
    ).toEqual({
      max: DEFAULT_RATE_LIMIT_MAX,
      windowMs: DEFAULT_RATE_LIMIT_WINDOW_MS,
    });
  });

  it('honors an explicit 0 to disable the limiter', () => {
    expect(parseRateLimitConfig({ CONTACT_RATE_LIMIT_MAX: '0' }).max).toBe(0);
  });
});
