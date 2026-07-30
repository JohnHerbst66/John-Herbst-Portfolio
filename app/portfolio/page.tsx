import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

interface PortfolioItem {
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];

  try {
    const { blobs } = await list({ prefix: "portfolio/" });
    items = blobs
      .map((blob) => ({
        name: blob.pathname.replace("portfolio/", ""),
        url: blob.url,
        size: blob.size,
        uploadedAt: new Date(blob.uploadedAt).toLocaleDateString(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Failed to load portfolio items:", err);
  }

  return (
    <main>
      <Nav />
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <h1 className="font-mono text-sm tracking-wider text-blueprint mb-2">
          // PORTFOLIO
        </h1>
        <p className="font-body text-muted max-w-md mb-10">
          Work samples and projects from my coursework and professional experience.
        </p>

        {items.length === 0 ? (
          <p className="font-mono text-sm text-muted">
            No portfolio items uploaded yet.
          </p>
        ) : (
          <div className="bg-panel border border-panelline rounded font-mono text-sm divide-y divide-panelline">
            {items.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 hover:bg-ink/40 transition-colors"
              >
                <span className="text-paper flex-1 truncate">{item.name}</span>
                <span className="text-muted text-xs">
                  {(item.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
