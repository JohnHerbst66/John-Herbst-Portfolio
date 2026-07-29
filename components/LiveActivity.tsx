import { RepoActivity, timeAgo } from "@/lib/github";

export default function LiveActivity({ repos }: { repos: RepoActivity[] }) {
  return (
    <section id="activity" className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-mono text-sm tracking-wider text-blueprint">
          // LIVE ACTIVITY
        </h2>
        <span className="font-mono text-xs text-muted">
          pulled from github, auto-updates hourly
        </span>
      </div>

      <div className="bg-panel border border-panelline rounded font-mono text-sm divide-y divide-panelline">
        {repos.length === 0 && (
          <p className="px-4 py-4 text-muted">
            No recent activity found — check back shortly.
          </p>
        )}
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 px-4 py-3 hover:bg-ink/40 transition-colors"
          >
            <span className="text-signal">&gt;</span>
            <span className="text-paper min-w-[160px]">{repo.name}</span>
            <span className="text-muted flex-1 truncate">
              {repo.description ?? "no description"}
            </span>
            {repo.language && (
              <span className="text-blueprint">{repo.language}</span>
            )}
            <span className="text-muted">{timeAgo(repo.updatedAt)}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
