"use client";

import { useEffect, useRef } from "react";

const BLOCKS = 30;

/**
 * Deterministic pseudo-random in 0..1.
 *
 * Math.random would give the server and the client different numbers and
 * trip a hydration mismatch, so the scatter is derived from the block index.
 */
function noise(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function blocks(band: number) {
  return Array.from({ length: BLOCKS }, (_, i) => {
    // Scatter on a circle rather than a box, so blocks converge from every
    // angle instead of drifting in along two axes.
    const angle = noise(i, band + 1) * Math.PI * 2;
    const distance = 150 + noise(i, band + 5) * 260;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    // Up to a turn and a half, either way.
    const rot = Math.round((noise(i, band + 13) - 0.5) * 1080);
    const size = 10 + Math.round(noise(i, band + 17) * 12);

    // A few picked out in the accent colours so it reads as structure
    // rather than confetti.
    const tone =
      noise(i, band + 21) > 0.82
        ? "text-signal"
        : noise(i, band + 29) > 0.45
          ? "text-blueprint"
          : "text-muted";

    // Roughly a third solid, for weight against the outlined ones.
    const solid = noise(i, band + 37) > 0.66;

    return (
      <span
        key={i}
        className={`construct-block ${tone}${solid ? " construct-block-solid" : ""}`}
        style={
          {
            "--dx": dx,
            "--dy": dy,
            "--rot": rot,
            // Base only. The media query scales it, and an inline --size
            // would outrank that.
            "--size-base": `${size}px`,
          } as React.CSSProperties
        }
      />
    );
  });
}

export default function ScrollConstruct() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = layer.current;
    if (!node) return;

    // Assembled and still; the CSS already sets that, so never listen.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const apply = () => {
      frame = 0;

      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // Top band builds as the page scrolls away beneath it; the bottom band
      // comes apart as the end approaches. Both are pure functions of scroll
      // position, so scrolling back up runs them in reverse.
      //
      // The two ramps deliberately overlap past the midpoint. At a narrower
      // span they both finished before halfway and the whole middle of the
      // page sat frozen with nothing building or breaking.
      const RAMP = 0.55;
      const smooth = (t: number) => t * t * (3 - 2 * t);
      const clamp = (t: number) => Math.min(1, Math.max(0, t));

      node.style.setProperty("--a-top", smooth(clamp(progress / RAMP)).toFixed(3));
      node.style.setProperty(
        "--a-bot",
        smooth(clamp((1 - progress) / RAMP)).toFixed(3)
      );
    };

    const onScroll = () => {
      // One update per frame at most; scroll fires far more often than paint.
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={layer} aria-hidden="true" className="construct-layer">
      <div className="construct-band construct-band-top">{blocks(0)}</div>
      <div className="construct-band construct-band-bottom">{blocks(1)}</div>
    </div>
  );
}
