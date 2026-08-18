"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Screenshot } from "@/content/projects";

/** Seconds for the strip to travel one full set of shots. */
const CYCLE_SECONDS = 45;

export default function ProjectGallery({
  shots,
  label,
}: {
  shots: Screenshot[];
  label: string;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const go = useCallback(
    (delta: number) =>
      setOpenAt((i) =>
        i === null ? i : (i + delta + shots.length) % shots.length
      ),
    [shots.length]
  );

  useEffect(() => {
    if (openAt === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenAt(null);
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
  }, [openAt, go]);

  if (shots.length === 0) return null;
  const current = openAt === null ? null : shots[openAt];

  // Rendered twice so the loop is seamless; the copy is hidden from
  // assistive tech and keyboard order.
  const track = [...shots, ...shots];

  return (
    <>
      <div className="mb-5">
        <div
          className="marquee-viewport relative w-full min-w-0 overflow-hidden rounded"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div
            className="marquee-track flex gap-3 w-max"
            style={{ ["--marquee-duration" as string]: `${CYCLE_SECONDS}s` }}
            data-paused={openAt !== null}
          >
            {track.map((shot, i) => {
              const real = i % shots.length;
              const isClone = i >= shots.length;

              return (
                <button
                  key={`${shot.src}-${i}`}
                  type="button"
                  onClick={() => setOpenAt(real)}
                  aria-hidden={isClone}
                  tabIndex={isClone ? -1 : 0}
                  aria-label={`Enlarge screenshot: ${shot.caption}`}
                  title={shot.caption}
                  className="shrink-0 w-40 sm:w-48 rounded overflow-hidden border border-panelline hover:border-blueprint transition-colors cursor-zoom-in"
                >
                  <Image
                    src={shot.src}
                    alt={isClone ? "" : `${label} — ${shot.caption}`}
                    width={1920}
                    height={1020}
                    sizes="200px"
                    className="w-full h-auto"
                    priority={i === 0}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-2 font-mono text-[10px] text-muted text-center">
          {shots.length} screenshots · hover to pause, click to enlarge
        </p>
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${label} screenshots`}
          onClick={() => setOpenAt(null)}
          className="fixed inset-0 z-50 bg-ink/95 flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
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
              {current.caption} · {(openAt ?? 0) + 1} / {shots.length}
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
