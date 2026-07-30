import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24h

// Hardcoded hashed password: Johnalbert2005#
// Hash: scrypt with random salt, one-way
const HARDCODED_PASSWORD_HASH =
  "7ddc52769090f64dfdebfbb17260de76:27bcd4e4f98cefb296d0d6f5a17d8603eb3d322ee4a3422988216a416e680653a45299e9fff13f97c3750123fa169d6cc2675c2ffb68ffae6469ebe85c44221f";
const SESSION_SECRET =
  "portfolio_admin_session_secret_key_do_not_share_outside_code";

function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  try {
    const candidate = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hashHex, "hex");
    return (
      candidate.length === expected.length &&
      crypto.timingSafeEqual(candidate, expected)
    );
  } catch {
    return false;
  }
}

function sign(value: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

export function verifyPassword(candidate: string): boolean {
  return verifyPasswordHash(candidate, HARDCODED_PASSWORD_HASH);
}

export function createSessionCookieValue(): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

function verifySessionCookieValue(value: string | undefined): boolean {
  if (!value) return false;

  const [issuedAt, signature] = value.split(".");
  if (!issuedAt || !signature) return false;

  const expected = sign(issuedAt);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age < SESSION_TTL_SECONDS * 1000;
}

export function isAuthed(): boolean {
  return verifySessionCookieValue(cookies().get(SESSION_COOKIE_NAME)?.value);
}

export function setSessionCookie(): void {
  cookies().set(SESSION_COOKIE_NAME, createSessionCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}
