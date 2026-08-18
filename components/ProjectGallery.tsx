"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Screenshot } from "@/content/projects";

/** How long a slide rests before the carousel moves on by itself. */
const AUTOPLAY_MS = 30_000;
/** Slides further than this from the centre are not rendered. */
const SPREAD = 2;

export default function ProjectGallery({
  shots,
  label,
}: {
  shots: Screenshot[];
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>();

  const go = useCallback(
    (delta: number) =>
      setIndex((i) => (i + delta + shots.length) % shots.length),
    [shots.length]
  );

  useEffect(() => {
    // Auto-advance is motion nobody asked for, so honour the preference.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || paused || zoomed || shots.length < 2) return;

    timer.current = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer.current);
  }, [go, paused, zoomed, shots.length]);

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

  /** Shortest signed distance from the centre, so the ring wraps both ways. */
  const offsetOf = (i: number) => {
    let offset = i - index;
    if (offset > shots.length / 2) offset -= shots.length;
    if (offset < -shots.length / 2) offset += shots.length;
    return offset;
  };

  return (
    <>
      <figure
        className="mb-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/*
          Below md the flanking slides are hidden and the centre goes
          full-width: a 280px-wide coverflow leaves the screenshot too small to
          read, which defeats the point of showing it.
        */}
        <div
          className="relative w-full aspect-[1.95/1] md:aspect-[2.4/1]"
          style={{ perspective: "1400px" }}
        >
          {shots.map((shot, i) => {
            const offset = offsetOf(i);
            const distance = Math.abs(offset);
            if (distance > SPREAD) return null;

            const isCentre = offset === 0;

            return (
              <button
                key={shot.src}
                type="button"
                onClick={() => (isCentre ? setZoomed(true) : setIndex(i))}
                aria-label={
                  isCentre
                    ? `Enlarge screenshot: ${shot.caption}`
                    : `Show ${shot.caption}`
                }
                aria-current={isCentre}
                className={`absolute top-1/2 left-1/2 transition-all duration-500 ease-out rounded overflow-hidden border md:w-[54%] ${
                  isCentre
                    ? "w-[86%] border-blueprint cursor-zoom-in shadow-2xl shadow-black/60"
                    : "hidden md:block w-[54%] border-panelline cursor-pointer"
                }`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${offset * 46}%) scale(${
                    1 - distance * 0.16
                  }) rotateY(${offset * -26}deg)`,
                  zIndex: 10 - distance,
                  opacity: 1 - distance * 0.3,
                  filter: isCentre ? "none" : "brightness(0.65)",
                }}
              >
                <Image
                  src={shot.src}
                  alt={`${label} — ${shot.caption}`}
                  width={1920}
                  height={1020}
                  sizes="(max-width: 768px) 60vw, 40vw"
                  className="w-full h-auto"
                  priority={i === 0}
                />
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous screenshot"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 px-2 py-4 font-mono text-2xl text-muted hover:text-blueprint transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next screenshot"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 px-2 py-4 font-mono text-2xl text-muted hover:text-blueprint transition-colors"
          >
            ›
          </button>
        </div>

        <figcaption className="text-center mt-3 font-mono text-xs">
          <span className="text-paper">{current.caption}</span>
          <span className="text-muted ml-3">
            {index + 1} / {shots.length}
          </span>
        </figcaption>

        <div className="flex gap-1.5 mt-1 max-w-xs mx-auto">
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
