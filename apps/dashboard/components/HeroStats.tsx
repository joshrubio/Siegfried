import { listProjects } from "@/lib/projects";
import AnimatedNumber from "./AnimatedNumber";

export default async function HeroStats() {
  const projects = await listProjects();
  const inProduction = projects.filter((p) => p.stage === "production").length;
  const launched = projects.filter((p) => p.stage === "launched").length;

  return (
    <dl className="flex gap-6 mt-6 text-sm">
      <div>
        <dt className="text-muted-foreground">Proyectos</dt>
        <dd className="text-xl font-semibold tabular-nums">
          <AnimatedNumber value={projects.length} />
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">En producción</dt>
        <dd className="text-xl font-semibold tabular-nums">
          <AnimatedNumber value={inProduction} />
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Lanzados</dt>
        <dd className="text-xl font-semibold tabular-nums">
          <AnimatedNumber value={launched} />
        </dd>
      </div>
    </dl>
  );
}
