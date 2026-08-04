"use client";

import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Full navigation so the server re-reads the new cookie.
        window.location.href = "/admin";
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error || "Incorrect password");
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="spec-panel bg-panel border border-panelline rounded p-8"
    >
      <h1 className="font-mono text-sm tracking-wider text-blueprint mb-6">
        // ADMIN LOGIN
      </h1>
      {/*
        Chrome ignores autoComplete="off" on password fields; "new-password"
        is the hint it honours, and the non-standard input name stops saved
        credentials matching this form.
      */}
      <input
        type="password"
        name="admin-passphrase"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        autoFocus
        autoComplete="new-password"
        data-form-type="other"
        className="w-full bg-ink border border-panelline rounded px-3 py-2 font-mono text-sm text-paper mb-4 focus:outline-none focus:border-blueprint"
      />
      {error && <p className="font-mono text-xs text-signal mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading || password.length === 0}
        className="w-full bg-blueprint text-ink font-mono text-sm font-medium rounded px-3 py-2 hover:bg-blueprintdim transition-colors disabled:opacity-50"
      >
        {loading ? "checking…" : "log in"}
      </button>
    </form>
  );
}
