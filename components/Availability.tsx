/**
 * The three facts a recruiter needs before they bother reading further:
 * where he is, whether he can work for them, and when he could start.
 *
 * Deliberately quiet — mono and muted, under the headline rather than
 * competing with it. It is qualifying information, not a pitch.
 */

const glyph = {
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  // Each sits beside its own label, so it is decoration to a screen reader.
  "aria-hidden": true,
  className: "w-3.5 h-3.5 shrink-0 text-blueprint",
};

export default function Availability() {
  return (
    <ul className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted">
      <li className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" stroke="currentColor" {...glyph}>
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
        <span className="text-paper">Thabazimbi, Limpopo</span>
      </li>

      <li className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" stroke="currentColor" {...glyph}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" />
        </svg>
        <span>
          <span className="text-paper">Remote</span>, or relocating for the
          right role
        </span>
      </li>

      <li className="flex items-center gap-2">
        {/* Amber is the site's status colour — LIVE, IN DAILY USE, and this. */}
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-signal shrink-0"
        />
        <span>
          <span className="text-paper">Available</span> on one month&rsquo;s
          notice
        </span>
      </li>
    </ul>
  );
}
