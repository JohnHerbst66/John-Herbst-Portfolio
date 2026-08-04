"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files ?? []));
    setStatus(null);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setStatus("Select files to upload");
      return;
    }

    // Vercel caps server-side uploads at 4.5 MB. Catch it here so an oversized
    // file reports its actual size instead of failing opaquely at the edge.
    const LIMIT = 4.5 * 1024 * 1024;
    const tooBig = files.filter((f) => f.size > LIMIT);
    if (tooBig.length > 0) {
      setStatus(
        `Too large (4.5 MB limit): ${tooBig
          .map((f) => `${f.name} is ${(f.size / 1024 / 1024).toFixed(1)} MB`)
          .join(", ")}`
      );
      return;
    }

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatus(`Uploading ${i + 1}/${files.length}: ${file.name}`);

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/portfolio/upload", {
          method: "POST",
          body: formData,
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setStatus(`Upload failed: ${data.error ?? res.statusText}`);
          setUploading(false);
          return;
        }
      }

      setStatus(`✓ Uploaded ${files.length} file(s)`);
      setFiles([]);
      // Re-render the server component so the new files appear in the list.
      router.refresh();
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleUpload}
      className="spec-panel bg-panel border border-panelline rounded p-8"
    >
      <h1 className="font-mono text-sm tracking-wider text-blueprint mb-6">
        // UPLOAD PORTFOLIO FILES
      </h1>

      <label className="block font-mono text-xs text-muted mb-2">
        Select files
      </label>
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="w-full mb-4 font-mono text-xs text-muted file:mr-4 file:py-2 file:px-3 file:rounded file:border file:border-panelline file:bg-ink file:text-paper file:font-mono file:text-xs"
      />

      {files.length > 0 && (
        <p className="font-mono text-xs text-muted mb-4">
          {files.length} file(s) selected
        </p>
      )}

      {status && (
        <p className="font-mono text-xs text-signal mb-4">{status}</p>
      )}

      <button
        type="submit"
        disabled={uploading || files.length === 0}
        className="w-full bg-blueprint text-ink font-mono text-sm font-medium rounded px-3 py-2 hover:bg-blueprintdim transition-colors disabled:opacity-50"
      >
        {uploading ? "uploading…" : "upload files"}
      </button>
    </form>
  );
}
