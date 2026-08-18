"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Library, LibraryFile } from "@/lib/folders";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminLibrary({ library }: { library: Library }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newFolder, setNewFolder] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameTo, setRenameTo] = useState("");
  const [deletingFolder, setDeletingFolder] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const folderNames = library.folders.map((f) => f.name);

  async function call(url: string, payload: unknown): Promise<boolean> {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return false;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Could not reach the server");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const folders = "/api/portfolio/folders";

  async function createFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!newFolder.trim()) return;
    if (await call(folders, { action: "create", name: newFolder.trim() })) {
      setNewFolder("");
    }
  }

  async function move(order: string[]) {
    await call(folders, { action: "reorder", order });
  }

  function shift(name: string, delta: number) {
    const next = [...folderNames];
    const i = next.indexOf(name);
    const j = i + delta;
    if (i === -1 || j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    void move(next);
  }

  return (
    <div className="spec-panel bg-panel border border-panelline rounded p-6">
      <h2 className="font-mono text-sm tracking-wider text-blueprint mb-4">
        // MANAGE FILES
      </h2>

      {error && <p className="font-mono text-xs text-signal mb-3">{error}</p>}

      <form onSubmit={createFolder} className="flex gap-2 mb-5">
        <input
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
          placeholder="new folder name"
          className="flex-1 bg-ink border border-panelline rounded px-3 py-2 font-mono text-xs text-paper focus:outline-none focus:border-blueprint"
        />
        <button
          type="submit"
          disabled={busy || !newFolder.trim()}
          className="bg-blueprint text-ink font-mono text-xs font-medium rounded px-3 py-2 hover:bg-blueprintdim transition-colors disabled:opacity-40"
        >
          create
        </button>
      </form>

      {library.folders.length === 0 && library.uncategorized.length === 0 && (
        <p className="font-mono text-xs text-muted">Nothing uploaded yet.</p>
      )}

      <div className="space-y-4 font-mono text-xs">
        {library.folders.map((folder, index) => (
          <div key={folder.name} className="border border-panelline rounded">
            <div className="flex items-center gap-2 px-3 py-2 bg-ink/40">
              <div className="flex flex-col leading-none">
                <button
                  onClick={() => shift(folder.name, -1)}
                  disabled={busy || index === 0}
                  title="Move up"
                  className="text-muted hover:text-blueprint disabled:opacity-20"
                >
                  ▲
                </button>
                <button
                  onClick={() => shift(folder.name, 1)}
                  disabled={busy || index === library.folders.length - 1}
                  title="Move down"
                  className="text-muted hover:text-blueprint disabled:opacity-20"
                >
                  ▼
                </button>
              </div>

              <span className="text-paper flex-1 truncate">
                {folder.name}
                <span className="text-muted ml-2">
                  ({folder.files.length})
                </span>
              </span>

              <button
                onClick={() => {
                  setRenaming(folder.name);
                  setRenameTo(folder.name);
                  setDeletingFolder(null);
                  setError(null);
                }}
                disabled={busy}
                className="text-muted hover:text-blueprint disabled:opacity-40"
              >
                rename
              </button>
              <button
                onClick={() => {
                  setDeletingFolder(folder.name);
                  setConfirmText("");
                  setRenaming(null);
                  setError(null);
                }}
                disabled={busy}
                className="text-muted hover:text-signal disabled:opacity-40"
              >
                delete
              </button>
            </div>

            {renaming === folder.name && (
              <div className="flex gap-2 px-3 py-2 border-t border-panelline">
                <input
                  value={renameTo}
                  onChange={(e) => setRenameTo(e.target.value)}
                  autoFocus
                  className="flex-1 bg-ink border border-panelline rounded px-2 py-1 text-paper focus:outline-none focus:border-blueprint"
                />
                <button
                  onClick={async () => {
                    if (
                      await call(folders, {
                        action: "rename",
                        from: folder.name,
                        to: renameTo.trim(),
                      })
                    ) {
                      setRenaming(null);
                    }
                  }}
                  disabled={busy || !renameTo.trim()}
                  className="text-blueprint hover:underline disabled:opacity-40"
                >
                  save
                </button>
                <button
                  onClick={() => setRenaming(null)}
                  disabled={busy}
                  className="text-muted hover:text-paper"
                >
                  cancel
                </button>
              </div>
            )}

            {deletingFolder === folder.name && (
              <div className="px-3 py-2 border-t border-panelline space-y-2">
                <p className="text-signal">
                  Deletes this folder and its {folder.files.length} file
                  {folder.files.length === 1 ? "" : "s"}. This cannot be undone.
                  Type <span className="text-paper">{folder.name}</span> to
                  confirm.
                </p>
                <div className="flex gap-2">
                  <input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    autoFocus
                    className="flex-1 bg-ink border border-panelline rounded px-2 py-1 text-paper focus:outline-none focus:border-signal"
                  />
                  <button
                    onClick={async () => {
                      if (
                        await call(folders, {
                          action: "delete",
                          name: folder.name,
                          confirm: confirmText,
                        })
                      ) {
                        setDeletingFolder(null);
                      }
                    }}
                    disabled={busy || confirmText !== folder.name}
                    className="text-signal hover:underline disabled:opacity-30"
                  >
                    delete folder
                  </button>
                  <button
                    onClick={() => setDeletingFolder(null)}
                    disabled={busy}
                    className="text-muted hover:text-paper"
                  >
                    cancel
                  </button>
                </div>
              </div>
            )}

            <FileRows
              files={folder.files}
              folderNames={folderNames}
              current={folder.name}
              busy={busy}
              deletingFile={deletingFile}
              setDeletingFile={setDeletingFile}
              onMove={(pathname, target) =>
                call("/api/portfolio/move", { pathname, folder: target })
              }
              onDelete={(pathname) =>
                call("/api/portfolio/delete", { pathname })
              }
            />
          </div>
        ))}

        {library.uncategorized.length > 0 && (
          <div className="border border-panelline rounded">
            <div className="px-3 py-2 bg-ink/40 text-muted">
              Uncategorised
              <span className="ml-2">({library.uncategorized.length})</span>
            </div>
            <FileRows
              files={library.uncategorized}
              folderNames={folderNames}
              current={null}
              busy={busy}
              deletingFile={deletingFile}
              setDeletingFile={setDeletingFile}
              onMove={(pathname, target) =>
                call("/api/portfolio/move", { pathname, folder: target })
              }
              onDelete={(pathname) =>
                call("/api/portfolio/delete", { pathname })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FileRows({
  files,
  folderNames,
  current,
  busy,
  deletingFile,
  setDeletingFile,
  onMove,
  onDelete,
}: {
  files: LibraryFile[];
  folderNames: string[];
  current: string | null;
  busy: boolean;
  deletingFile: string | null;
  setDeletingFile: (v: string | null) => void;
  onMove: (pathname: string, folder: string | null) => Promise<boolean>;
  onDelete: (pathname: string) => Promise<boolean>;
}) {
  if (files.length === 0) {
    return (
      <p className="px-3 py-2 text-muted border-t border-panelline">
        Empty folder.
      </p>
    );
  }

  return (
    <div className="divide-y divide-panelline border-t border-panelline">
      {files.map((file) => (
        <div key={file.pathname} className="px-3 py-2">
          <div className="flex items-center gap-3">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper flex-1 truncate hover:text-blueprint"
            >
              {file.name}
            </a>
            <span className="text-muted shrink-0">
              {formatSize(file.size)}
            </span>

            <select
              value={current ?? ""}
              disabled={busy}
              onChange={(e) =>
                void onMove(file.pathname, e.target.value || null)
              }
              title="Move to folder"
              className="bg-ink border border-panelline rounded px-1 py-0.5 text-muted shrink-0 disabled:opacity-40"
            >
              <option value="">no folder</option>
              {folderNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {deletingFile !== file.pathname && (
              <button
                onClick={() => setDeletingFile(file.pathname)}
                disabled={busy}
                className="text-muted hover:text-signal shrink-0 disabled:opacity-40"
              >
                delete
              </button>
            )}
          </div>

          {deletingFile === file.pathname && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-signal">Delete permanently?</span>
              <button
                onClick={async () => {
                  if (await onDelete(file.pathname)) setDeletingFile(null);
                }}
                disabled={busy}
                className="text-signal hover:underline disabled:opacity-40"
              >
                yes, delete
              </button>
              <button
                onClick={() => setDeletingFile(null)}
                disabled={busy}
                className="text-muted hover:text-paper"
              >
                cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
