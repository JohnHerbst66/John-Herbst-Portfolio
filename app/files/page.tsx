import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

interface FileItem {
  name: string;
  url: string;
  downloadUrl: string;
  size: number;
  uploadedAt: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function FilesPage() {
  let items: FileItem[] = [];
  let storageError = false;

  try {
    const { blobs } = await list({ prefix: "portfolio/" });
    items = blobs
      .map((blob) => ({
        name: blob.pathname.replace(/^portfolio\//, ""),
        url: blob.url,
        downloadUrl: blob.downloadUrl ?? blob.url,
        size: blob.size,
        uploadedAt: new Date(blob.uploadedAt).toLocaleDateString(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    // Most likely cause: no Blob store connected, so BLOB_READ_WRITE_TOKEN
    // is missing. Say so instead of pretending the list is empty.
    storageError = true;
    console.error("Failed to list files:", err);
  }

  return (
    <main>
      <Nav />
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto min-h-[60vh]">
        <h1 className="font-mono text-sm tracking-wider text-blueprint mb-2">
          // FILES
        </h1>
        <p className="font-body text-muted max-w-md mb-10">
          Work samples and coursework. Everything here is free to view and
          download.
        </p>

        {storageError ? (
          <p className="font-mono text-sm text-signal">
            File storage isn&apos;t configured yet, so nothing can be listed.
          </p>
        ) : items.length === 0 ? (
          <p className="font-mono text-sm text-muted">No files uploaded yet.</p>
        ) : (
          <div className="bg-panel border border-panelline rounded font-mono text-sm divide-y divide-panelline">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-4 px-4 py-3 hover:bg-ink/40 transition-colors"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper flex-1 truncate hover:text-blueprint transition-colors"
                >
                  {item.name}
                </a>
                <span className="text-muted text-xs shrink-0">
                  {formatSize(item.size)}
                </span>
                <span className="text-muted text-xs shrink-0 hidden sm:inline">
                  {item.uploadedAt}
                </span>
                <a
                  href={item.downloadUrl}
                  className="text-blueprint text-xs shrink-0 hover:underline"
                >
                  download ↓
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
