import Link from "next/link";

export default function Nav() {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
      <Link
        href="/"
        className="font-display font-bold text-paper text-lg tracking-tight hover:text-blueprint transition-colors"
      >
        JOHN HERBST
      </Link>
      {/* Wraps and tightens on small screens; five links at gap-6 overflowed 375px. */}
      <nav className="flex flex-wrap justify-end gap-x-4 gap-y-1 sm:gap-x-6 font-mono text-sm text-muted">
        {/*
          Root-relative so these still work off the home page — a bare
          "#builds" points at nothing on /files.
        */}
        <a href="/#builds" className="hover:text-blueprint transition-colors">
          builds
        </a>
        <a href="/#activity" className="hover:text-blueprint transition-colors">
          activity
        </a>
        <Link href="/files" className="hover:text-blueprint transition-colors">
          files
        </Link>
        <a href="/#contact" className="hover:text-blueprint transition-colors">
          contact
        </a>
      </nav>
    </header>
  );
}
