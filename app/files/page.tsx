import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FileFolder from "@/components/FileFolder";
import { getLibrary, type Library } from "@/lib/folders";

export const dynamic = "force-dynamic";

export default async function FilesPage() {
  let library: Library = { folders: [], uncategorized: [] };
  let storageError = false;

  try {
    library = await getLibrary();
  } catch (err) {
    // Most likely cause: no Blob store connected, so BLOB_READ_WRITE_TOKEN
    // is missing. Say so instead of pretending the list is empty.
    storageError = true;
    console.error("Failed to list files:", err);
  }

  // An empty folder is scaffolding for me, not something an employer needs to
  // see, so only folders with files are shown here.
  const folders = library.folders.filter((f) => f.files.length > 0);
  const isEmpty = folders.length === 0 && library.uncategorized.length === 0;

  return (
    <main>
      <Nav />
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto min-h-[60vh]">
        <h1 className="font-mono text-sm tracking-wider text-blueprint mb-2">
          // FILES
        </h1>
        <p className="font-body text-muted max-w-md mb-10">
          Work samples and coursework. Everything here is free to view and
          download.
        </p>

        {storageError ? (
          <p className="font-mono text-sm text-signal">
            File storage isn&apos;t configured yet, so nothing can be listed.
          </p>
        ) : isEmpty ? (
          <p className="font-mono text-sm text-muted">No files uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {folders.map((folder, i) => (
              <FileFolder
                key={folder.name}
                name={folder.name}
                files={folder.files}
                open={i === 0}
              />
            ))}

            {library.uncategorized.length > 0 && (
              <FileFolder
                name="Other"
                files={library.uncategorized}
                open={folders.length === 0}
              />
            )}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
