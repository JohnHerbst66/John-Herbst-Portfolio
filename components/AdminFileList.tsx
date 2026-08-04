"use client";

import { useState } from "react";

export interface AdminFile {
  name: string;
  pathname: string;
  url: string;
  size: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminFileList({ files }: { files: AdminFile[] }) {
  const [items, setItems] = useState(files);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(pathname: string) {
    setBusy(pathname);
    setError(null);

    try {
      const res = await fetch("/api/portfolio/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname }),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Delete failed");
        return;
      }

      setItems((prev) => prev.filter((f) => f.pathname !== pathname));
    } catch {
      setError("Could not reach the server");
    } finally {
      setBusy(null);
      setConfirming(null);
    }
  }

  if (items.length === 0) {
    return (
      <p className="font-mono text-xs text-muted text-center">
        No files uploaded yet.
      </p>
    );
  }

  return (
    <div className="spec-panel bg-panel border border-panelline rounded p-6">
      <h2 className="font-mono text-sm tracking-wider text-blueprint mb-4">
        // MANAGE FILES
      </h2>

      {error && <p className="font-mono text-xs text-signal mb-3">{error}</p>}

      <div className="divide-y divide-panelline font-mono text-xs">
        {items.map((file) => (
          <div key={file.pathname} className="py-2">
            <div className="flex items-center gap-3">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper flex-1 truncate hover:text-blueprint transition-colors"
              >
                {file.name}
              </a>
              <span className="text-muted shrink-0">
                {formatSize(file.size)}
              </span>

              {confirming === file.pathname ? null : (
                <button
                  onClick={() => {
                    setConfirming(file.pathname);
                    setError(null);
                  }}
                  disabled={busy !== null}
                  className="text-muted hover:text-signal transition-colors shrink-0 disabled:opacity-40"
                >
                  delete
                </button>
              )}
            </div>

            {confirming === file.pathname && (
              <div className="flex items-center gap-3 mt-2 pl-1">
                <span className="text-signal">
                  Delete permanently? This cannot be undone.
                </span>
                <button
                  onClick={() => handleDelete(file.pathname)}
                  disabled={busy !== null}
                  className="text-signal hover:underline disabled:opacity-40"
                >
                  {busy === file.pathname ? "deleting…" : "yes, delete"}
                </button>
                <button
                  onClick={() => setConfirming(null)}
                  disabled={busy !== null}
                  className="text-muted hover:text-paper transition-colors disabled:opacity-40"
                >
                  cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
