"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Screenshot } from "@/content/projects";

export default function ProjectGallery({
  shots,
  label,
}: {
  shots: Screenshot[];
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + shots.length) % shots.length),
    [shots.length]
  );

  // Arrow keys and Escape only while the full-size view is open, so the
  // gallery never swallows keys meant for the page.
  useEffect(() => {
    if (!zoomed) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [zoomed, go]);

  if (shots.length === 0) return null;
  const current = shots[index];

  return (
    <>
      <figure className="mb-5">
        <div className="relative rounded overflow-hidden border border-panelline bg-ink">
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="block w-full cursor-zoom-in"
            aria-label={`Enlarge screenshot: ${current.caption}`}
          >
            <Image
              src={current.src}
              alt={`${label} — ${current.caption}`}
              width={1920}
              height={1020}
              sizes="(max-width: 768px) 100vw, 45vw"
              className="w-full h-auto"
              priority={index === 0}
            />
          </button>

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous screenshot"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-ink/80 border border-panelline rounded px-2 py-1 font-mono text-sm text-paper hover:text-blueprint hover:border-blueprint transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next screenshot"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-ink/80 border border-panelline rounded px-2 py-1 font-mono text-sm text-paper hover:text-blueprint hover:border-blueprint transition-colors"
          >
            ›
          </button>
        </div>

        <figcaption className="flex items-center justify-between gap-3 mt-2 font-mono text-xs">
          <span className="text-muted truncate">{current.caption}</span>
          <span className="text-muted shrink-0">
            {index + 1} / {shots.length}
          </span>
        </figcaption>

        {/*
          The bar stays 4px, but the button is padded so there is something
          big enough to actually hit on a phone.
        */}
        <div className="flex gap-1.5 mt-1">
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${shot.caption}`}
              aria-current={i === index}
              className="flex-1 py-2 group/dot"
            >
              <span
                className={`block h-1 rounded-full transition-colors ${
                  i === index
                    ? "bg-blueprint"
                    : "bg-panelline group-hover/dot:bg-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </figure>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${label} screenshots`}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 bg-ink/95 flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          {/*
            The wrapper carries a definite width. With w-auto on the image
            itself, this flex child collapsed to about 1px until the file
            finished loading, which flashed on open. Capped at 1200px so the
            1.88:1 shot stays inside the viewport height without letterboxing.
          */}
          <div
            className="w-[95vw] max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={`${label} — ${current.caption}`}
              width={1920}
              height={1020}
              sizes="95vw"
              className="w-full h-auto object-contain rounded border border-panelline"
            />
          </div>
          <div className="flex items-center gap-6 mt-4 font-mono text-sm">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="text-paper hover:text-blueprint transition-colors"
            >
              ‹ prev
            </button>
            <span className="text-muted">
              {current.caption} · {index + 1} / {shots.length}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="text-paper hover:text-blueprint transition-colors"
            >
              next ›
            </button>
          </div>
          <p className="font-mono text-xs text-muted mt-3">
            click anywhere or press esc to close
          </p>
        </div>
      )}
    </>
  );
}
