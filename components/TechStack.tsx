import Reveal from "./Reveal";

/**
 * Drawn as simple glyphs rather than brand logos: they stay legible at 28px,
 * carry no trademark baggage, and sit consistently in the site's palette.
 */
interface Tech {
  label: string;
  note: string;
  colour: string;
  icon: React.ReactNode;
}

const stroke = {
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const TECH: Tech[] = [
  {
    label: "C#",
    note: ".NET, WinForms, MVC",
    colour: "#8B63C9",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <path d="M15 8.5a4 4 0 1 0 0 7" />
        <path d="M18.5 9v6M21 9v6M17 11h6M17 13h6" />
      </svg>
    ),
  },
  {
    label: "Python",
    note: "Flask, automation",
    colour: "#4B8BBE",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <path d="M12 3c-3 0-4 1.2-4 3v2h8v1H6c-1.8 0-3 1-3 4s1.2 4 3 4h2v-3c0-1.8 1.2-3 3-3h4c1.8 0 3-1.2 3-3V6c0-1.8-1.2-3-4-3z" />
        <circle cx="9.5" cy="6" r=".6" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "TypeScript",
    note: "Next.js, React",
    colour: "#3178C6",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7.5 10h4M9.5 10v6M14 15.2c.5.5 1.2.8 2 .8 1.2 0 2-.6 2-1.5s-.8-1.2-2-1.5-2-.6-2-1.5.8-1.5 2-1.5c.8 0 1.5.3 2 .8" />
      </svg>
    ),
  },
  {
    label: "SQL",
    note: "SQL Server, SQLite",
    colour: "#E8A33D",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
      </svg>
    ),
  },
  {
    label: "ASP.NET Core",
    note: "MVC, EF Core, Identity",
    colour: "#5B9BD9",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M7 6.5h.01M9.5 6.5h.01" />
        <path d="M8 13l2 2-2 2M12.5 17h3.5" />
      </svg>
    ),
  },
  {
    label: "Docker",
    note: "Containerised builds",
    colour: "#2496ED",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <path d="M4 12h13v3.5A3.5 3.5 0 0 1 13.5 19h-5A4.5 4.5 0 0 1 4 14.5z" />
        <path d="M7 12V9.5h2.5V12M10.5 12V9.5H13V12M10.5 9V6.5H13V9" />
        <path d="M17.5 11c1 0 2 .4 2.5 1-.3 1-1.2 1.6-2.5 1.6" />
      </svg>
    ),
  },
  {
    label: "Git",
    note: "GitHub, CI deploys",
    colour: "#E06C3B",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <circle cx="7" cy="6" r="2.2" />
        <circle cx="7" cy="18" r="2.2" />
        <circle cx="17" cy="12" r="2.2" />
        <path d="M7 8.2v7.6M9.2 6.8c3 .6 5.3 2 5.8 4" />
      </svg>
    ),
  },
];

export default function TechStack() {
  return (
    <section className="px-6 md:px-12 py-12 max-w-6xl mx-auto">
      <h2 className="font-mono text-sm tracking-wider text-blueprint mb-6">
        // STACK
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {TECH.map((tech, i) => (
          <Reveal key={tech.label} delay={i * 60}>
            <div className="group h-full bg-panel border border-panelline rounded p-4 flex flex-col items-center text-center gap-2 hover:border-blueprint transition-colors">
              <span
                className="w-7 h-7 text-muted group-hover:text-[--tech] transition-colors"
                style={{ ["--tech" as string]: tech.colour }}
              >
                {tech.icon}
              </span>
              <span className="font-mono text-xs text-paper">{tech.label}</span>
              <span className="font-mono text-[10px] text-muted leading-tight">
                {tech.note}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
