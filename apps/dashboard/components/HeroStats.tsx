import { listProjects } from "@/lib/projects";
import AnimatedNumber from "./AnimatedNumber";

export default async function HeroStats() {
  const projects = await listProjects();
  const inProduction = projects.filter((p) => p.stage === "production").length;
  const launched = projects.filter((p) => p.stage === "launched").length;

  return (
    <dl className="flex gap-6 sm:gap-10 mt-8 lg:mt-10">
      <div>
        <dt className="text-sm text-muted-foreground">Projects</dt>
        <dd className="text-2xl sm:text-3xl font-semibold tabular-nums mt-1">
          <AnimatedNumber value={projects.length} />
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">In production</dt>
        <dd className="text-2xl sm:text-3xl font-semibold tabular-nums mt-1">
          <AnimatedNumber value={inProduction} />
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Launched</dt>
        <dd className="text-2xl sm:text-3xl font-semibold tabular-nums mt-1">
          <AnimatedNumber value={launched} />
        </dd>
      </div>
    </dl>
  );
}
