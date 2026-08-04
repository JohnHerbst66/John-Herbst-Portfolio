/**
 * Resolves Vercel Blob credentials.
 *
 * Vercel names the injected variables after the store's env prefix, so a store
 * connected as "Files" yields Files_READ_WRITE_TOKEN rather than the default
 * BLOB_READ_WRITE_TOKEN that @vercel/blob auto-detects. Newer stores instead
 * pair VERCEL_OIDC_TOKEN (present automatically on Vercel) with a store id.
 * Rather than hardcode one shape, find whichever is actually present.
 */
export function blobCredentials():
  | { token: string }
  | { storeId: string }
  | Record<string, never> {
  // Default name — the SDK picks this up on its own.
  if (process.env.BLOB_READ_WRITE_TOKEN) return {};

  // Custom prefix, e.g. Files_READ_WRITE_TOKEN.
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith("_READ_WRITE_TOKEN") && value) return { token: value };
  }

  // OIDC path: VERCEL_OIDC_TOKEN authenticates, the store id selects the store.
  if (process.env.BLOB_STORE_ID) return { storeId: process.env.BLOB_STORE_ID };
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith("_STORE_ID") && value) return { storeId: value };
  }

  return {};
}

/** True when no credential of any supported shape is present. */
export function blobIsConfigured(): boolean {
  return Object.keys(blobCredentials()).length > 0 ||
    Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
