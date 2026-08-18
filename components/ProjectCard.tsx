import { Project } from "@/content/projects";
import ProjectGallery from "./ProjectGallery";
import { RepoDetails, timeAgo } from "@/lib/github";

const statusLabel: Record<Project["status"], string> = {
  live: "LIVE",
  repo: "CODE AVAILABLE",
  pending: "IN PROGRESS",
};

const statusColor: Record<Project["status"], string> = {
  live: "text-signal",
  repo: "text-blueprint",
  pending: "text-muted",
};

export default function ProjectCard({
  project,
  live,
}: {
  project: Project;
  /** Live GitHub data when the project names a repo; null when absent or unreachable. */
  live?: RepoDetails | null;
}) {
  // Prefer what GitHub reports, fall back to the static entry.
  const tagline = live?.description ?? project.tagline;
  const stack = live?.languages.length ? live.languages : project.stack;
  const repoUrl = live?.url ?? project.repoUrl;
  const demoUrl = live?.homepage ?? project.demoUrl;

  return (
    <div className="spec-panel bg-panel border border-panelline rounded p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs tracking-wider text-muted">
          FIG — {project.slug.toUpperCase()}
        </span>
        <span
          className={`font-mono text-xs tracking-wider ${statusColor[project.status]}`}
        >
          {statusLabel[project.status]}
        </span>
      </div>

      <h3 className="font-display font-bold text-xl text-paper mb-1">
        {project.name}
      </h3>
      <p className="font-body text-muted text-sm mb-4">{tagline}</p>

      {project.screenshots && project.screenshots.length > 0 && (
        <ProjectGallery shots={project.screenshots} label={project.name} />
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {stack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs px-2 py-1 rounded border border-panelline text-blueprint"
          >
            {tech}
          </span>
        ))}
      </div>

      <dl className="font-body text-sm text-muted space-y-3 mb-6 flex-1">
        <div>
          <dt className="text-paper font-medium">Problem</dt>
          <dd>{project.problem}</dd>
        </div>
        <div>
          <dt className="text-paper font-medium">Approach</dt>
          <dd>{project.approach}</dd>
        </div>
        <div>
          <dt className="text-paper font-medium">Outcome</dt>
          <dd>{project.outcome}</dd>
        </div>
      </dl>

      <div className="flex items-center gap-4 font-mono text-sm mt-auto">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-signal hover:underline"
          >
            live demo →
          </a>
        )}
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blueprint hover:underline"
          >
            repo →
          </a>
        )}
        {!demoUrl && !repoUrl && (
          <span className="text-muted">link pending</span>
        )}
        {live && (
          <span className="text-muted text-xs ml-auto">
            updated {timeAgo(live.pushedAt)}
          </span>
        )}
      </div>
    </div>
  );
}
