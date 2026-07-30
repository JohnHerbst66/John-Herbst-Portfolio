"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (res.ok) {
      // Store password in sessionStorage so upload form can use it
      sessionStorage.setItem("admin_password", password);
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Incorrect password");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="spec-panel bg-panel border border-panelline rounded p-8 max-w-md"
    >
      <h2 className="font-mono text-sm tracking-wider text-blueprint mb-6">
        // ADMIN ACCESS
      </h2>
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        autoFocus
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
