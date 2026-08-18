"use client";

import { useEffect, useRef } from "react";

/** Eraser grid. Cells nearest the screen edge break away first. */
const COLS = 32;
const ROWS = 3;
/** Coloured pieces that fly off once a band starts coming apart. */
const DEBRIS = 14;

/**
 * Deterministic pseudo-random in 0..1.
 *
 * Math.random would give the server and the client different numbers and
 * trip a hydration mismatch, so everything is derived from the index.
 */
function noise(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Cells painted in the page background. As a band comes apart they fade in
 * and eat the content behind them square by square, so it looks like the page
 * is breaking up rather than simply fading out.
 */
function eraser(band: number) {
  const cells = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      // Row 0 sits against the screen edge and goes first; a little noise
      // keeps the boundary ragged instead of a straight line sweeping in.
      const depth = band === 0 ? r : ROWS - 1 - r;
      const threshold = (depth / ROWS) * 0.55 + noise(i, band + 3) * 0.42;

      cells.push(
        <span
          key={i}
          // Half the columns drop out on small screens, where 32 across
          // would render thin stripes rather than blocks. Hidden cells leave
          // the grid entirely, so the remaining 16 stretch edge to edge.
          className={`construct-cell${c >= COLS / 2 ? " construct-cell-wide" : ""}`}
          style={
            {
              "--threshold": threshold.toFixed(3),
              gridRow: r + 1,
              gridColumn: c + 1,
            } as React.CSSProperties
          }
        />
      );
    }
  }

  return cells;
}

/** The pieces that actually fly away. */
function debris(band: number) {
  return Array.from({ length: DEBRIS }, (_, i) => {
    const angle = noise(i, band + 11) * Math.PI * 2;
    const distance = 90 + noise(i, band + 17) * 200;
    const dx = Math.round(Math.cos(angle) * distance);
    // Bias away from the content: the top band throws upward, the bottom down.
    const dy =
      Math.round(Math.abs(Math.sin(angle)) * distance) * (band === 0 ? -1 : 1);
    const rot = Math.round((noise(i, band + 23) - 0.5) * 900);
    const size = 18 + Math.round(noise(i, band + 29) * 20);
    const tone =
      noise(i, band + 31) > 0.8
        ? "text-signal"
        : noise(i, band + 37) > 0.45
          ? "text-blueprint"
          : "text-muted";
    const solid = noise(i, band + 41) > 0.6;

    return (
      <span
        key={i}
        className={`construct-debris ${tone}${solid ? " construct-solid" : ""}`}
        style={
          {
            "--dx": dx,
            "--dy": dy,
            "--rot": rot,
            "--threshold": (noise(i, band + 43) * 0.5).toFixed(3),
            "--size-base": `${size}px`,
            left: `${((i + 0.5) / DEBRIS) * 100}%`,
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

    // Whole and still. The CSS already renders that, so never listen.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = window.scrollY;
    // 0 = intact, 1 = fully broken apart.
    let dTop = 0;
    let dBot = 0;
    let targetTop = 0;
    let targetBot = 0;
    let raf = 0;

    const write = () => {
      node.style.setProperty("--d-top", dTop.toFixed(3));
      node.style.setProperty("--d-bot", dBot.toFixed(3));
    };

    const tick = () => {
      // Eased rather than snapped, so pieces settle in sequence instead of
      // arriving together.
      const EASE = 0.085;
      dTop += (targetTop - dTop) * EASE;
      dBot += (targetBot - dBot) * EASE;
      write();

      if (
        Math.abs(targetTop - dTop) > 0.002 ||
        Math.abs(targetBot - dBot) > 0.002
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        dTop = targetTop;
        dBot = targetBot;
        write();
        raf = 0;
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      // Ignore jitter, or the bands flicker on tiny scroll corrections.
      if (Math.abs(delta) < 3) return;
      last = y;

      // The trailing edge comes apart, the leading edge builds back. Scrolling
      // down, content leaves at the top and arrives at the bottom.
      if (delta > 0) {
        targetTop = 1;
        targetBot = 0;
      } else {
        targetTop = 0;
        targetBot = 1;
      }

      if (!raf) raf = requestAnimationFrame(tick);
    };

    write();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={layer} aria-hidden="true" className="construct-layer">
      <div className="construct-band construct-band-top">
        <div className="construct-grid">{eraser(0)}</div>
        {debris(0)}
      </div>
      <div className="construct-band construct-band-bottom">
        <div className="construct-grid">{eraser(1)}</div>
        {debris(1)}
      </div>
    </div>
  );
}
