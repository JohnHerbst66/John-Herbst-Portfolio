import { NextRequest, NextResponse } from "next/server";
import { createFolder, del, list, rename } from "@vercel/blob";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";
import { blobCredentials, blobToken } from "@/lib/blob";
import {
  PREFIX,
  folderMarker,
  getLibrary,
  validateFolderName,
  writeOrder,
} from "@/lib/folders";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

async function existingFolderNames(): Promise<string[]> {
  const { folders } = await getLibrary();
  return folders.map((f) => f.name);
}

export async function POST(request: NextRequest) {
  if (!verifyToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)) {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  const action = body?.action;
  const creds = blobCredentials();

  try {
    /* ---------- create ---------- */
    if (action === "create") {
      const name = validateFolderName(body?.name);
      if (!name) {
        return bad(
          "Use letters, numbers, spaces, - _ & ( ) only, up to 50 characters."
        );
      }

      const existing = await existingFolderNames();
      if (existing.some((f) => f.toLowerCase() === name.toLowerCase())) {
        return bad(`A folder called "${name}" already exists.`);
      }

      await createFolder(folderMarker(name), blobToken());
      return NextResponse.json({ ok: true, name });
    }

    /* ---------- rename ---------- */
    if (action === "rename") {
      const from = validateFolderName(body?.from);
      const to = validateFolderName(body?.to);
      if (!from || !to) return bad("Invalid folder name.");
      if (from === to) return NextResponse.json({ ok: true, name: to });

      const existing = await existingFolderNames();
      if (!existing.includes(from)) return bad("That folder no longer exists.");
      if (existing.some((f) => f.toLowerCase() === to.toLowerCase())) {
        return bad(`A folder called "${to}" already exists.`);
      }

      // Blob has no folder rename, so every file under the old prefix moves
      // individually. The marker is deliberately skipped: its pathname ends in
      // "/" and rename() rejects that with "Missing filename in pathname", so
      // the destination marker is created fresh and the old one deleted. That
      // also keeps an empty folder alive across a rename.
      const oldPrefix = `${PREFIX}${from}/`;
      const { blobs } = await list({ prefix: oldPrefix, ...creds });

      for (const blob of blobs) {
        if (blob.pathname.endsWith("/")) continue;
        const tail = blob.pathname.slice(oldPrefix.length);
        await rename(blob.pathname, `${PREFIX}${to}/${tail}`, {
          access: "public",
          ...creds,
        });
      }

      await createFolder(folderMarker(to), blobToken());

      const markers = blobs.filter((b) => b.pathname.endsWith("/"));
      if (markers.length > 0) {
        await del(
          markers.map((m) => m.url),
          creds
        );
      }

      const order = await existingFolderNames();
      await writeOrder(order.map((n) => (n === from ? to : n)));

      return NextResponse.json({ ok: true, name: to });
    }

    /* ---------- delete ---------- */
    if (action === "delete") {
      const name = validateFolderName(body?.name);
      if (!name) return bad("Invalid folder name.");

      // The client asks the user to type the folder name; require it back so a
      // stray request cannot wipe a folder by accident.
      if (body?.confirm !== name) {
        return bad("Confirmation did not match the folder name.");
      }

      const { blobs } = await list({ prefix: `${PREFIX}${name}/`, ...creds });
      if (blobs.length > 0) {
        await del(
          blobs.map((b) => b.url),
          creds
        );
      }

      const remaining = (await existingFolderNames()).filter((n) => n !== name);
      await writeOrder(remaining);

      return NextResponse.json({ ok: true, deleted: name, files: blobs.length });
    }

    /* ---------- reorder ---------- */
    if (action === "reorder") {
      const requested = body?.order;
      if (!Array.isArray(requested)) return bad("Invalid order.");

      const existing = await existingFolderNames();
      const cleaned = requested.filter(
        (n): n is string => typeof n === "string" && existing.includes(n)
      );
      // Keep any folder the client did not mention rather than losing it.
      const missing = existing.filter((n) => !cleaned.includes(n));

      await writeOrder([...cleaned, ...missing]);
      return NextResponse.json({ ok: true });
    }

    return bad("Unknown action.");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Folder action failed:", err);

    if (/blob credentials|BLOB_READ_WRITE_TOKEN/i.test(message)) {
      return NextResponse.json(
        { error: "File storage isn't connected." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
