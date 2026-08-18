import Link from "next/link";
import CodeBackground from "./CodeBackground";
import { RepoActivity, timeAgo } from "@/lib/github";

export default function Hero({ latest }: { latest: RepoActivity | null }) {
  return (
    <section className="relative px-6 md:px-12 pt-16 pb-24 max-w-6xl mx-auto">
      <CodeBackground />

      <p className="relative font-mono text-sm text-blueprint mb-4">
        &gt; build_log --status
      </p>
      <h1 className="relative font-display font-bold text-4xl md:text-6xl text-paper leading-tight max-w-3xl">
        I build the systems nobody notices until they break.
      </h1>
      <p className="relative font-body text-muted text-lg mt-6 max-w-xl">
        Full-stack developer working across Python, TypeScript, and C# —
        from desktop tools to deployed web apps.
      </p>

      <Link
        href="/files"
        className="relative inline-block mt-8 bg-blueprint text-ink font-mono text-sm font-medium rounded px-5 py-3 hover:bg-blueprintdim transition-colors"
      >
        view my work →
      </Link>

      <div className="relative mt-10 font-mono text-sm bg-panel border border-panelline rounded px-4 py-3 block w-fit">
        {latest ? (
          <span className="text-paper">
            <span className="text-signal">$</span> last push{" "}
            <span className="text-blueprint">→</span> {latest.name}{" "}
            <span className="text-muted">· {timeAgo(latest.updatedAt)}</span>
            <span className="cursor" />
          </span>
        ) : (
          <span className="text-muted">
            <span className="text-signal">$</span> waiting on GitHub activity
            <span className="cursor" />
          </span>
        )}
      </div>
    </section>
  );
}
