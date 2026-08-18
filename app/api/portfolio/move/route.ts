import { NextRequest, NextResponse } from "next/server";
import { rename } from "@vercel/blob";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";
import { blobCredentials } from "@/lib/blob";
import { PREFIX, getLibrary, validateFolderName } from "@/lib/folders";

export async function POST(request: NextRequest) {
  if (!verifyToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const pathname: unknown = body?.pathname;
  const rawFolder: unknown = body?.folder;

  if (typeof pathname !== "string" || !pathname.startsWith(PREFIX)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }
  if (pathname.includes("..") || pathname.endsWith("/")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  // null / "" means move it back out to the root.
  const target =
    rawFolder === null || rawFolder === "" ? null : validateFolderName(rawFolder);
  if (rawFolder !== null && rawFolder !== "" && !target) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  try {
    const library = await getLibrary();

    // Resolve against what is really stored rather than trusting the path.
    const all = [...library.uncategorized, ...library.folders.flatMap((f) => f.files)];
    const file = all.find((f) => f.pathname === pathname);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (target && !library.folders.some((f) => f.name === target)) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
    if (file.folder === target) {
      return NextResponse.json({ ok: true, unchanged: true });
    }

    const destination = target
      ? `${PREFIX}${target}/${file.name}`
      : `${PREFIX}${file.name}`;

    if (all.some((f) => f.pathname === destination)) {
      return NextResponse.json(
        { error: `"${file.name}" already exists there.` },
        { status: 409 }
      );
    }

    await rename(file.pathname, destination, {
      access: "public",
      ...blobCredentials(),
    });
    return NextResponse.json({ ok: true, pathname: destination });
  } catch (err) {
    console.error("Move failed:", err);
    return NextResponse.json({ error: "Move failed" }, { status: 500 });
  }
}
