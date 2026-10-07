import type { SatelliteProject, Stage } from "@/lib/projects";
import { STAGE_LABELS } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

const STAGES: Stage[] = ["ideation", "production", "launched"];

export default function KanbanBoard({ projects }: { projects: SatelliteProject[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {STAGES.map((stage) => {
        const columnProjects = projects.filter((p) => p.stage === stage);
        return (
          <div key={stage}>
            <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-3">
              {STAGE_LABELS[stage]}
              <span className="ml-2 text-neutral-400">({columnProjects.length})</span>
            </h3>
            <div className="grid gap-3">
              {columnProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
              {columnProjects.length === 0 && (
                <p className="text-xs text-neutral-400 italic">vacío</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
