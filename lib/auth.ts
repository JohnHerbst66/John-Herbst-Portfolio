import crypto from "crypto";

export const SESSION_COOKIE_NAME = "admin_token";
export const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24h

// Hashed password (scrypt, one-way). Plaintext is never stored.
const HARDCODED_PASSWORD_HASH =
  "7ddc52769090f64dfdebfbb17260de76:27bcd4e4f98cefb296d0d6f5a17d8603eb3d322ee4a3422988216a416e680653a45299e9fff13f97c3750123fa169d6cc2675c2ffb68ffae6469ebe85c44221f";

// Set ADMIN_JWT_SECRET in Vercel to make forged tokens impossible.
// The fallback exists so the app still builds without it.
const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ?? "portfolio_admin_dev_fallback_secret";

/* ---------- password ---------- */

export function verifyPassword(candidate: string): boolean {
  const [salt, hashHex] = HARDCODED_PASSWORD_HASH.split(":");
  if (!salt || !hashHex) return false;

  try {
    const derived = crypto.scryptSync(candidate, salt, 64);
    const expected = Buffer.from(hashHex, "hex");
    return (
      derived.length === expected.length &&
      crypto.timingSafeEqual(derived, expected)
    );
  } catch {
    return false;
  }
}

/* ---------- JWT (HS256) ---------- */

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function signHS256(data: string): string {
  return b64url(crypto.createHmac("sha256", JWT_SECRET).update(data).digest());
}

export function createToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({ sub: "admin", iat: now, exp: now + SESSION_TTL_SECONDS })
  );
  const body = `${header}.${payload}`;
  return `${body}.${signHS256(body)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [header, payload, signature] = parts;

  const expected = Buffer.from(signHS256(`${header}.${payload}`));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length) return false;
  if (!crypto.timingSafeEqual(expected, actual)) return false;

  try {
    const claims = JSON.parse(b64urlDecode(payload).toString("utf8"));
    if (claims.sub !== "admin") return false;
    return typeof claims.exp === "number" && claims.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
