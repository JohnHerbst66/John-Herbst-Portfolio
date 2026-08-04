import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { list } from "@vercel/blob";
import AdminUploadForm from "@/components/AdminUploadForm";
import AdminFileList, { AdminFile } from "@/components/AdminFileList";
import LogoutButton from "@/components/LogoutButton";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";
import { blobCredentials } from "@/lib/blob";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!verifyToken(cookies().get(SESSION_COOKIE_NAME)?.value)) {
    redirect("/login");
  }

  let files: AdminFile[] = [];
  let storageError = false;

  try {
    const { blobs } = await list({ prefix: "portfolio/", ...blobCredentials() });
    files = blobs
      .map((blob) => ({
        name: blob.pathname.replace(/^portfolio\//, ""),
        pathname: blob.pathname,
        url: blob.url,
        size: blob.size,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    storageError = true;
    console.error("Failed to list files for admin:", err);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-4">
        <AdminUploadForm />

        {storageError ? (
          <p className="font-mono text-xs text-signal text-center">
            Couldn&apos;t load the file list.
          </p>
        ) : (
          <AdminFileList files={files} />
        )}

        <a
          href="/files"
          className="block text-center font-mono text-xs text-blueprint hover:underline"
        >
          view public files page →
        </a>
        <LogoutButton />
      </div>
    </main>
  );
}
