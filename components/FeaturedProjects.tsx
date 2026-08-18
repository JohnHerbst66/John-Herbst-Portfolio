import { projects } from "@/content/projects";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import { getRepoDetails } from "@/lib/github";

export default async function FeaturedProjects() {
  // Projects that name a githubRepo get their stack and tagline from GitHub, so
  // the card tracks the repo without anyone editing this file again.
  const live = await Promise.all(
    projects.map((project) =>
      project.githubRepo ? getRepoDetails(project.githubRepo) : null
    )
  );

  return (
    <section id="builds" className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
      <h2 className="font-mono text-sm tracking-wider text-blueprint mb-8">
        // FEATURED BUILDS
      </h2>
      {/*
        min-w-0 on each grid item: a grid item defaults to min-width:auto, so
        the wide screenshot track stretches the card past the grid and scrolls
        the whole page sideways.
      */}
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 90} className="min-w-0">
            <ProjectCard project={project} live={live[i]} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
