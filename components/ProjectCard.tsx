import { Project } from "@/content/projects";

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

export default function ProjectCard({ project }: { project: Project }) {
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
      <p className="font-body text-muted text-sm mb-4">{project.tagline}</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.stack.map((tech) => (
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

      <div className="flex gap-4 font-mono text-sm mt-auto">
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-signal hover:underline"
          >
            live demo →
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blueprint hover:underline"
          >
            repo →
          </a>
        )}
        {!project.demoUrl && !project.repoUrl && (
          <span className="text-muted">link pending</span>
        )}
      </div>
    </div>
  );
}
