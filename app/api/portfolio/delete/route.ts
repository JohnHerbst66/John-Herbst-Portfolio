import { NextRequest, NextResponse } from "next/server";
import { del, list } from "@vercel/blob";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";
import { blobCredentials } from "@/lib/blob";

const PREFIX = "portfolio/";

export async function POST(request: NextRequest) {
  if (!verifyToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const pathname: unknown = body?.pathname;

  if (typeof pathname !== "string" || !pathname) {
    return NextResponse.json({ error: "No file specified" }, { status: 400 });
  }

  // Never trust a client-supplied path. Resolve it against what is actually
  // stored under the portfolio prefix, so nothing outside it can be deleted.
  if (!pathname.startsWith(PREFIX) || pathname.includes("..")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  try {
    const creds = blobCredentials();
    const { blobs } = await list({ prefix: PREFIX, ...creds });
    const target = blobs.find((b) => b.pathname === pathname);

    if (!target) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await del(target.url, creds);
    return NextResponse.json({ ok: true, deleted: target.pathname });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Delete error:", err);

    if (/blob credentials|BLOB_READ_WRITE_TOKEN/i.test(message)) {
      return NextResponse.json(
        { error: "File storage isn't connected." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
