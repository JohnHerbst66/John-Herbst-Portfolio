"use client";

import { useEffect, useState } from "react";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminUploadForm from "@/components/AdminUploadForm";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if admin_password exists in sessionStorage (logged in)
    const stored = sessionStorage.getItem("admin_password");
    if (stored) {
      setPassword(stored);
      setAuthed(true);
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {authed ? (
          <div className="space-y-4">
            <AdminUploadForm password={password} />
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_password");
                setAuthed(false);
              }}
              className="w-full font-mono text-xs text-muted hover:text-blueprint transition-colors"
            >
              log out
            </button>
          </div>
        ) : (
          <AdminLoginForm />
        )}
      </div>
    </main>
  );
}
