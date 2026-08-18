"use client";

import { useEffect, useRef } from "react";

/** Eraser grid. Cells nearest the screen edge break away first. */
const COLS = 32;
const ROWS = 3;
/** Pieces in flight at each edge. Each loops on its own cycle. */
const DEBRIS = 30;
/**
 * How long after the last scroll event the page counts as still. Pieces keep
 * flying and the edges stay open for this long once scrolling stops, so the
 * effect trails off rather than cutting out the moment the wheel does.
 */
const IDLE_MS = 500;

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
          // would render thin stripes rather than blocks.
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

/**
 * The pieces that fly away. Each runs its own looping keyframe so they keep
 * being thrown off for as long as scrolling continues, rather than making a
 * single trip and stopping.
 *
 * The outer slot carries the band's dissolve amount, so only the edge that is
 * actually breaking apart shows its debris; nesting means the two opacities
 * multiply without the keyframes needing to know about the band.
 */
function debris(band: number) {
  return Array.from({ length: DEBRIS }, (_, i) => {
    const angle = noise(i, band + 11) * Math.PI * 2;
    const distance = 110 + noise(i, band + 17) * 220;
    const dx = Math.round(Math.cos(angle) * distance);
    // Bias away from the content: the top band throws upward, the bottom down.
    const dy =
      Math.round(Math.abs(Math.sin(angle)) * distance) * (band === 0 ? -1 : 1);
    const rot = Math.round((noise(i, band + 23) - 0.5) * 900);
    const size = 18 + Math.round(noise(i, band + 29) * 20);
    const duration = 0.85 + noise(i, band + 47) * 1.05;
    // Negative delay starts each piece part-way through, so they are spread
    // across the cycle from the first frame instead of launching together.
    const delay = -(noise(i, band + 53) * duration);
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
        className="construct-slot"
        style={{ left: `${((i + 0.5) / DEBRIS) * 100}%` }}
      >
        <span
          className={`construct-debris ${tone}${solid ? " construct-solid" : ""}`}
          style={
            {
              "--dx": dx,
              "--dy": dy,
              "--rot": rot,
              "--dur": `${duration.toFixed(2)}s`,
              "--delay": `${delay.toFixed(2)}s`,
              "--size-base": `${size}px`,
            } as React.CSSProperties
          }
        />
      </span>
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
    let idle: ReturnType<typeof setTimeout> | undefined;
    let animating = false;

    const write = () => {
      node.style.setProperty("--d-top", dTop.toFixed(3));
      node.style.setProperty("--d-bot", dBot.toFixed(3));
    };

    // Fraction of the remaining distance covered each frame; lower is slower.
    // Breaking apart keeps its pace, but settling back is roughly half that
    // speed so the page reassembles gently once scrolling stops.
    const EASE_APART = 0.028;
    const EASE_BACK = 0.0145;

    const approach = (current: number, target: number) =>
      current + (target - current) * (target > current ? EASE_APART : EASE_BACK);

    const tick = () => {
      dTop = approach(dTop, targetTop);
      dBot = approach(dBot, targetBot);
      write();

      if (
        Math.abs(targetTop - dTop) > 0.002 ||
        Math.abs(targetBot - dBot) > 0.002
      ) {
        raf = requestAnimationFrame(tick);
        return;
      }

      dTop = targetTop;
      dBot = targetBot;
      write();
      raf = 0;

      // Only now is it safe to stop the keyframes. Pausing them the moment
      // scrolling ended would freeze pieces mid-flight in plain sight; by
      // here the bands have faded to nothing, so nobody sees them halt.
      if (targetTop === 0 && targetBot === 0) setAnimating(false);
    };

    // Gates the looping debris keyframes. Kept running for the whole time any
    // piece can still be seen, not just while the wheel is turning.
    const setAnimating = (on: boolean) => {
      if (animating === on) return;
      animating = on;
      node.dataset.scrolling = on ? "true" : "false";
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      // Ignore jitter, or the bands flicker on tiny scroll corrections.
      if (Math.abs(delta) < 3) return;
      last = y;

      setAnimating(true);

      // Both edges break open while the page moves; what differs is the
      // direction of travel. Scrolling down, content leaves at the top so its
      // pieces are thrown clear, and arrives at the bottom so those pieces fly
      // inward and land. The CSS reads this to reverse the arriving edge.
      node.dataset.dir = delta > 0 ? "down" : "up";
      targetTop = 1;
      targetBot = 1;

      if (!raf) raf = requestAnimationFrame(tick);

      // Once the page is still again everything rebuilds, so the next scroll
      // in either direction has something to break apart.
      clearTimeout(idle);
      idle = setTimeout(() => {
        // Only start the fade. The keyframes stay running until the bands
        // have actually reached zero, which tick() takes care of.
        targetTop = 0;
        targetBot = 0;
        if (!raf) raf = requestAnimationFrame(tick);
      }, IDLE_MS);
    };

    write();
    // Set outright rather than via setAnimating, which would no-op here since
    // the flag already starts false and the attribute would go unwritten.
    node.dataset.scrolling = "false";
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(idle);
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
