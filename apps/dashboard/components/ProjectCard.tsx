import Link from "next/link";
import type { SatelliteProject } from "@/lib/projects";

function checklistProgress(checklist: SatelliteProject["checklist"]) {
  const values = Object.values(checklist);
  const done = values.filter(Boolean).length;
  return `${done}/${values.length}`;
}

export default function ProjectCard({ project }: { project: SatelliteProject }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors bg-white dark:bg-neutral-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-sm leading-snug">{project.name}</h3>
        <span className="shrink-0 text-xs text-neutral-500 tabular-nums">
          {checklistProgress(project.checklist)}
        </span>
      </div>
      <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{project.concept}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400">
        {project.repo_url ? <span>repo ✓</span> : <span>sin repo</span>}
        {project.deploy_url && <span>desplegado ✓</span>}
      </div>
    </Link>
  );
}
