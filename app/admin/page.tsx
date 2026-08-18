import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminUploadForm from "@/components/AdminUploadForm";
import AdminLibrary from "@/components/AdminLibrary";
import LogoutButton from "@/components/LogoutButton";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";
import { getLibrary, type Library } from "@/lib/folders";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!verifyToken(cookies().get(SESSION_COOKIE_NAME)?.value)) {
    redirect("/login");
  }

  let library: Library = { folders: [], uncategorized: [] };
  let storageError = false;

  try {
    library = await getLibrary();
  } catch (err) {
    storageError = true;
    console.error("Failed to load the library:", err);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-4">
        <AdminUploadForm folderNames={library.folders.map((f) => f.name)} />

        {storageError ? (
          <p className="font-mono text-xs text-signal text-center">
            Couldn&apos;t load the file list.
          </p>
        ) : (
          <AdminLibrary library={library} />
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
