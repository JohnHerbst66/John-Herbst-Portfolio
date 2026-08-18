"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and lifts its children in as they scroll into view.
 *
 * Starts visible and only hides once the observer is attached, so the content
 * is never stranded invisible if JavaScript fails or never runs. Reduced-motion
 * users skip the animation entirely.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Milliseconds to stagger this item behind its neighbours. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(true);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    // Anything already on screen at load stays put — animating it would just
    // flash on first paint.
    const onScreen = node.getBoundingClientRect().top < window.innerHeight;
    if (onScreen) return;

    setShown(false);
    setArmed(true);

    let delivered = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        delivered = true;
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);

    // A working observer delivers its first callback almost immediately, even
    // for an off-screen element. If nothing arrives, the observer is not
    // running — some embedded and background contexts never fire it — and the
    // content would otherwise stay invisible for good. Showing it unanimated
    // is far better than losing it.
    const failsafe = setTimeout(() => {
      if (!delivered) setShown(true);
    }, 1200);

    return () => {
      clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={
        armed
          ? {
              opacity: shown ? 1 : 0,
              transform: shown ? "none" : "translateY(24px)",
              transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
