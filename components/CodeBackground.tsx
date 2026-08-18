"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lines are typed out one character at a time behind the hero. Drawn from the
 * .NET MVC work so it reads as this site's own code rather than filler.
 * Indentation is written with non-breaking spaces so it survives in HTML.
 */
const SNIPPET: string[] = [
  "public class DeliveryController : Controller",
  "{",
  "    private readonly ApplicationDbContext _db;",
  "",
  "    [HttpPost]",
  "    public async Task<IActionResult> Create(OrderDto dto)",
  "    {",
  "        if (!ModelState.IsValid) return View(dto);",
  "",
  "        var order = new Order",
  "        {",
  "            Placed = DateTime.UtcNow,",
  "            Status = OrderStatus.Pending",
  "        };",
  "",
  "        _db.Orders.Add(order);",
  "        await _db.SaveChangesAsync();",
  "",
  "        return RedirectToAction(nameof(Index));",
  "    }",
  "}",
];

const VISIBLE_LINES = 16;
const CHAR_MS = 28;
const LINE_PAUSE_MS = 260;
const RESTART_PAUSE_MS = 2600;

export default function CodeBackground() {
  const [lines, setLines] = useState<string[]>([""]);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Matches the `md:` breakpoint the wrapper is hidden below.
    const wide = window.matchMedia("(min-width: 768px)");

    let line = 0;
    let char = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;

      // Below md the wrapper is display:none. Idle cheaply rather than typing
      // into something nobody can see, and pick up again if the window grows.
      // Checked here rather than only on the media query's change event, which
      // is not always delivered.
      if (!wide.matches) {
        timer.current = setTimeout(step, 1000);
        return;
      }

      // Finished the whole snippet — hold, then start over.
      if (line >= SNIPPET.length) {
        timer.current = setTimeout(() => {
          if (cancelled) return;
          line = 0;
          char = 0;
          setLines([""]);
          step();
        }, RESTART_PAUSE_MS);
        return;
      }

      const target = SNIPPET[line];

      if (char > target.length) {
        line += 1;
        char = 0;
        setLines((prev) => [...prev, ""].slice(-VISIBLE_LINES));
        timer.current = setTimeout(step, LINE_PAUSE_MS);
        return;
      }

      setLines((prev) => {
        const next = [...prev];
        next[next.length - 1] = target.slice(0, char);
        return next;
      });

      char += 1;
      // Vary the cadence slightly so it reads as typing rather than a machine.
      timer.current = setTimeout(step, CHAR_MS + Math.random() * 45);
    };

    const stop = () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };

    const decide = () => {
      stop();

      // Someone who asked for less motion still gets the finished snippet.
      if (reduced.matches) {
        setLines(SNIPPET.slice(-VISIBLE_LINES));
        return;
      }

      cancelled = false;
      line = 0;
      char = 0;
      setLines([""]);
      step();
    };

    decide();
    wide.addEventListener("change", decide);
    reduced.addEventListener("change", decide);

    return () => {
      stop();
      wide.removeEventListener("change", decide);
      reduced.removeEventListener("change", decide);
    };
  }, []);

  // Hidden below md: on a phone the block sits directly under the headline and
  // costs readability without adding anything.
  return (
    <div
      aria-hidden="true"
      className="hidden md:block pointer-events-none select-none absolute inset-0 overflow-hidden"
    >
      <pre
        className="absolute right-0 top-0 h-full font-mono text-xs leading-6 text-blueprint whitespace-pre text-right opacity-[0.13] m-0 pr-2"
        style={{
          // Fade the edges so the block never collides with the headline.
          maskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 72%, transparent), linear-gradient(to left, black 55%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 72%, transparent), linear-gradient(to left, black 55%, transparent)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        {lines.map((text, i) => (
          <div key={i}>
            {text || " "}
            {i === lines.length - 1 && (
              <span className="text-signal">&#9608;</span>
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}
