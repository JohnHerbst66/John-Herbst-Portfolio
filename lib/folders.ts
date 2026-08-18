import { list, put } from "@vercel/blob";
import { blobCredentials } from "@/lib/blob";

export const PREFIX = "portfolio/";

/** Where the manual folder ordering lives. Kept outside PREFIX so it never
 *  shows up as a portfolio file. */
const ORDER_PATH = "config/folder-order.json";

export interface LibraryFile {
  /** Filename on its own, no folder part. */
  name: string;
  /** Full blob pathname, e.g. "portfolio/CV/resume.pdf". */
  pathname: string;
  /** Owning folder, or null when it sits at the root. */
  folder: string | null;
  url: string;
  downloadUrl: string;
  size: number;
  uploadedAt: string;
}

export interface LibraryFolder {
  name: string;
  files: LibraryFile[];
}

export interface Library {
  folders: LibraryFolder[];
  /** Files sitting at the root, outside any folder. */
  uncategorized: LibraryFile[];
}

/* ---------- naming ---------- */

const MAX_NAME = 50;

/**
 * Folder names become part of a blob path, so anything that could change the
 * path's meaning is rejected rather than quietly rewritten.
 */
export function validateFolderName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;

  const name = raw.trim();
  if (!name || name.length > MAX_NAME) return null;
  if (name.startsWith(".")) return null;
  if (!/^[A-Za-z0-9 _&()-]+$/.test(name)) return null;
  if (name.includes("..")) return null;

  return name;
}

export function folderMarker(name: string): string {
  return `${PREFIX}${name}/`;
}

/* ---------- ordering ---------- */

async function readOrder(): Promise<string[]> {
  try {
    const { blobs } = await list({
      prefix: ORDER_PATH,
      ...blobCredentials(),
    });
    const entry = blobs.find((b) => b.pathname === ORDER_PATH);
    if (!entry) return [];

    // Blob URLs sit behind a CDN and the order file is overwritten in place,
    // so bust the cache or a reorder can read back as stale.
    const res = await fetch(`${entry.url}?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const parsed = await res.json();
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export async function writeOrder(order: string[]): Promise<void> {
  await put(ORDER_PATH, JSON.stringify(order), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
    ...blobCredentials(),
  });
}

/** Saved order first, then anything unlisted alphabetically after it. */
function applyOrder(names: string[], order: string[]): string[] {
  const ranked = order.filter((n) => names.includes(n));
  const rest = names
    .filter((n) => !ranked.includes(n))
    .sort((a, b) => a.localeCompare(b));
  return [...ranked, ...rest];
}

/* ---------- reading the library ---------- */

/**
 * One list() call describes the whole library. Folder markers created by
 * createFolder() come back as zero-byte blobs whose pathname ends in "/", which
 * is what keeps an empty folder visible; real files are everything else.
 */
export async function getLibrary(): Promise<Library> {
  const { blobs } = await list({ prefix: PREFIX, ...blobCredentials() });

  const folderNames = new Set<string>();
  const files: LibraryFile[] = [];

  for (const blob of blobs) {
    const rest = blob.pathname.slice(PREFIX.length);
    if (!rest) continue;

    // Marker for an (possibly empty) folder.
    if (rest.endsWith("/")) {
      const name = rest.slice(0, -1);
      if (name && !name.includes("/")) folderNames.add(name);
      continue;
    }

    const slash = rest.indexOf("/");
    const folder = slash === -1 ? null : rest.slice(0, slash);
    const name = slash === -1 ? rest : rest.slice(slash + 1);
    if (!name) continue;
    if (folder) folderNames.add(folder);

    files.push({
      name,
      pathname: blob.pathname,
      folder,
      url: blob.url,
      downloadUrl: blob.downloadUrl ?? blob.url,
      size: blob.size,
      uploadedAt: new Date(blob.uploadedAt).toLocaleDateString(),
    });
  }

  const order = await readOrder();
  const byName = (a: LibraryFile, b: LibraryFile) =>
    a.name.localeCompare(b.name);

  const folders = applyOrder([...folderNames], order).map((name) => ({
    name,
    files: files.filter((f) => f.folder === name).sort(byName),
  }));

  return {
    folders,
    uncategorized: files.filter((f) => f.folder === null).sort(byName),
  };
}
