import { describe, expect, it } from 'vitest';
import { getClientIpKey } from '@/lib/contact/clientIp';

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/contact', { headers });
}

describe('getClientIpKey', () => {
  it('ignores every forwarding header outside the trusted platform', () => {
    const request = makeRequest({
      'x-forwarded-for': '203.0.113.7',
      'x-real-ip': '203.0.113.8',
      'cf-connecting-ip': '203.0.113.9',
    });
    expect(getClientIpKey(request, {})).toBe('untrusted');
  });

  it('uses x-real-ip on the trusted platform', () => {
    const request = makeRequest({
      'x-real-ip': '203.0.113.10',
      'x-forwarded-for': '198.51.100.1, 203.0.113.10',
    });
    expect(getClientIpKey(request, { VERCEL: '1' })).toBe('203.0.113.10');
  });

  it('falls back to the last x-forwarded-for entry on the trusted platform', () => {
    const request = makeRequest({
      'x-forwarded-for': '198.51.100.1, 198.51.100.2, 203.0.113.11',
    });
    expect(getClientIpKey(request, { VERCEL: '1' })).toBe('203.0.113.11');
  });

  it('returns untrusted when platform headers are missing or invalid', () => {
    expect(getClientIpKey(makeRequest(), { VERCEL: '1' })).toBe('untrusted');
    expect(
      getClientIpKey(makeRequest({ 'x-real-ip': 'evil header value' }), {
        VERCEL: '1',
      }),
    ).toBe('untrusted');
    expect(
      getClientIpKey(
        makeRequest({ 'x-real-ip': '999.999.999.999', 'x-forwarded-for': 'nope' }),
        { VERCEL: '1' },
      ),
    ).toBe('untrusted');
  });

  it('accepts IPv6 addresses from the trusted header', () => {
    const request = makeRequest({ 'x-real-ip': '2001:db8::1' });
    expect(getClientIpKey(request, { VERCEL: '1' })).toBe('2001:db8::1');
  });

  it('rejects overlong header values', () => {
    const long = '1'.repeat(80);
    expect(
      getClientIpKey(makeRequest({ 'x-real-ip': long }), { VERCEL: '1' }),
    ).toBe('untrusted');
  });

  it('does not treat VERCEL values other than 1 as trusted', () => {
    const request = makeRequest({ 'x-real-ip': '203.0.113.12' });
    expect(getClientIpKey(request, { VERCEL: 'true' })).toBe('untrusted');
    expect(getClientIpKey(request, { VERCEL: '0' })).toBe('untrusted');
  });
});
