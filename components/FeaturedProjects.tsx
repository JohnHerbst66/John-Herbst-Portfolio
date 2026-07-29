import { projects } from "@/content/projects";
import ProjectCard from "./ProjectCard";

export default function FeaturedProjects() {
  return (
    <section id="builds" className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
      <h2 className="font-mono text-sm tracking-wider text-blueprint mb-8">
        // FEATURED BUILDS
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
