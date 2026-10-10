import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
      <Link
        href="/"
        className="group flex items-center gap-2.5 font-display font-bold text-paper text-lg tracking-tight hover:text-blueprint transition-colors"
      >
        {/* Decorative: the name sits right beside it, so it is hidden from
            screen readers rather than read out twice. */}
        <Image
          src="/avatar.webp"
          alt=""
          aria-hidden="true"
          width={623}
          height={1205}
          priority
          className="h-11 w-auto shrink-0 transition-transform group-hover:-translate-y-0.5"
        />
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
