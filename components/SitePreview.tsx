import Image from "next/image";

/**
 * A capture of the running site inside a browser window.
 *
 * Deliberately not an iframe: both Vercel projects send
 * X-Frame-Options: SAMEORIGIN, so a cross-origin frame is refused outright,
 * and framing a client's live site would tie this page to their uptime.
 */
export default function SitePreview({
  src,
  url,
  label,
}: {
  /** Path under /public to the capture. */
  src: string;
  /** The real address — shown in the bar and used as the link. */
  url: string;
  label: string;
}) {
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open the live ${label} site at ${host}`}
      className="group block mb-5 rounded overflow-hidden border border-panelline hover:border-violet transition-colors"
    >
      {/* Window chrome, so the capture reads as a real site rather than a
          flat screenshot dropped on the card. */}
      <div className="flex items-center gap-2 px-3 py-2 bg-ink/80 border-b border-panelline">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-panelline" />
          <span className="w-2 h-2 rounded-full bg-panelline" />
          <span className="w-2 h-2 rounded-full bg-panelline" />
        </span>
        <span className="flex-1 min-w-0 truncate rounded-sm bg-panel px-2 py-0.5 font-mono text-[10px] text-muted group-hover:text-violet transition-colors">
          {host}
        </span>
        <span className="shrink-0 font-mono text-[10px] text-muted group-hover:text-violet transition-colors">
          open ↗
        </span>
      </div>

      <Image
        src={src}
        alt={`The ${label} site`}
        width={1440}
        height={900}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="w-full h-auto"
      />
    </a>
  );
}
