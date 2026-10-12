export const MAX_BODY_BYTES = 32_768;

const JSON_CONTENT_TYPE = /^application\/json(?:\s*;.*)?$/i;

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413 | 415 };

/**
 * Reads and parses a JSON request body with a hard size cap.
 *
 * - Rejects non-JSON content types with 415 before reading the body.
 * - Rejects an oversized declared `Content-Length` early with 413, without
 *   buffering the body.
 * - Enforces the same cap while streaming, so a missing or dishonest
 *   `Content-Length` cannot cause unbounded buffering; the reader is
 *   cancelled when the cap is hit.
 * - Empty or unreadable bodies and invalid JSON return 400.
 */
export async function readJsonBody(
  request: Request,
  maxBytes: number = MAX_BODY_BYTES,
): Promise<JsonBodyResult> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!JSON_CONTENT_TYPE.test(contentType.trim())) {
    return { ok: false, status: 415 };
  }

  const declared = request.headers.get('content-length');
  if (declared !== null) {
    const parsed = Number(declared);
    if (!Number.isInteger(parsed) || parsed < 0) {
      return { ok: false, status: 400 };
    }
    if (parsed > maxBytes) {
      return { ok: false, status: 413 };
    }
  }

  const stream = request.body;
  if (!stream) {
    return { ok: false, status: 400 };
  }

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, status: 413 };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400 };
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // The lock may already be released after cancel().
    }
  }

  if (total === 0) {
    return { ok: false, status: 400 };
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(merged)) };
  } catch {
    return { ok: false, status: 400 };
  }
}
