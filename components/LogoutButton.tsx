"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full font-mono text-xs text-muted hover:text-blueprint transition-colors"
    >
      log out
    </button>
  );
}
