import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";
import { blobCredentials } from "@/lib/blob";

export async function POST(request: NextRequest) {
  if (!verifyToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    file = formData.get("file") as File | null;
  } catch {
    return NextResponse.json({ error: "Malformed upload" }, { status: 400 });
  }

  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const blob = await put(`portfolio/${file.name}`, await file.arrayBuffer(), {
      access: "public",
      allowOverwrite: true,
      ...blobCredentials(),
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Upload error:", err);

    // Distinguish "storage was never set up" from a genuine upload failure,
    // so this doesn't look like a mystery 500.
    if (/blob credentials|BLOB_READ_WRITE_TOKEN/i.test(message)) {
      return NextResponse.json(
        {
          error:
            "File storage isn't connected. Create a Blob store in Vercel and link it to this project.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
