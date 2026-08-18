import type { LibraryFile } from "@/lib/folders";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Uses <details> so expanding needs no JavaScript — the list still works if the
 * page is read without it, and the first folder opens by default.
 */
export default function FileFolder({
  name,
  files,
  open = false,
}: {
  name: string;
  files: LibraryFile[];
  open?: boolean;
}) {
  return (
    <details
      open={open}
      className="bg-panel border border-panelline rounded group"
    >
      <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none font-mono text-sm hover:bg-ink/40 transition-colors">
        <span className="text-blueprint transition-transform group-open:rotate-90">
          ▶
        </span>
        <span className="text-paper flex-1 truncate">{name}</span>
        <span className="text-muted text-xs">
          {files.length} file{files.length === 1 ? "" : "s"}
        </span>
      </summary>

      <div className="divide-y divide-panelline border-t border-panelline font-mono text-sm">
        {files.map((file) => (
          <div
            key={file.pathname}
            className="flex items-center gap-4 px-4 py-3 hover:bg-ink/40 transition-colors"
          >
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper flex-1 truncate hover:text-blueprint transition-colors"
            >
              {file.name}
            </a>
            <span className="text-muted text-xs shrink-0">
              {formatSize(file.size)}
            </span>
            <span className="text-muted text-xs shrink-0 hidden sm:inline">
              {file.uploadedAt}
            </span>
            <a
              href={file.downloadUrl}
              className="text-blueprint text-xs shrink-0 hover:underline"
            >
              download ↓
            </a>
          </div>
        ))}
      </div>
    </details>
  );
}
