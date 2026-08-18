/**
 * Resolves Vercel Blob credentials.
 *
 * Vercel names the injected variables after the store's env prefix, so a store
 * connected as "Files" yields Files_READ_WRITE_TOKEN rather than the default
 * BLOB_READ_WRITE_TOKEN that @vercel/blob auto-detects. Newer stores instead
 * pair VERCEL_OIDC_TOKEN (present automatically on Vercel) with a store id.
 * Rather than hardcode one shape, find whichever is actually present.
 */
/**
 * `vercel env pull` writes "[SENSITIVE]" in place of values Vercel refuses to
 * expose outside its runtime. Passing that through as a token yields a
 * confusing "Access denied" instead of an obvious misconfiguration.
 */
function realValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return /^\[(SENSITIVE|REDACTED|ENCRYPTED|HIDDEN)\]$/i.test(value)
    ? undefined
    : value;
}

/** Deterministic order, so multiple stores can't select arbitrarily. */
function findBySuffix(suffix: string): string | undefined {
  for (const key of Object.keys(process.env).sort()) {
    if (!key.endsWith(suffix)) continue;
    const value = realValue(process.env[key]);
    if (value) return value;
  }
  return undefined;
}

/**
 * createFolder() accepts only a token — unlike put/list/rename it has no
 * storeId option — so it needs the credential narrowed to that shape.
 * Returns undefined when the SDK should fall back to its own env lookup.
 */
export function blobToken(): { token: string } | undefined {
  const credentials = blobCredentials();
  return "token" in credentials ? { token: credentials.token } : undefined;
}

export function blobCredentials():
  | { token: string }
  | { storeId: string }
  | Record<string, never> {
  // Default name — the SDK picks this up on its own.
  if (realValue(process.env.BLOB_READ_WRITE_TOKEN)) return {};

  // Custom prefix, e.g. Blob2_READ_WRITE_TOKEN.
  const token = findBySuffix("_READ_WRITE_TOKEN");
  if (token) return { token };

  // OIDC path: VERCEL_OIDC_TOKEN authenticates, the store id selects the store.
  const storeId =
    realValue(process.env.BLOB_STORE_ID) ?? findBySuffix("_STORE_ID");
  if (storeId) return { storeId };

  return {};
}
