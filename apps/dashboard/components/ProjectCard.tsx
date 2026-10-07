import Link from "next/link";
import { ExternalLink, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { STAGE_LABELS, type SatelliteProject, type Stage } from "@/lib/projects";

function checklistDone(checklist: SatelliteProject["checklist"]) {
  const values = Object.values(checklist);
  return { done: values.filter(Boolean).length, total: values.length };
}

const STAGE_BADGE: Record<Stage, string> = {
  ideation: "bg-muted text-muted-foreground",
  production: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  launched: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

export default function ProjectCard({ project }: { project: SatelliteProject }) {
  const { done, total } = checklistDone(project.checklist);

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <Card className="transition-colors group-hover:border-foreground/30 h-full">
        <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
          <h3 className="font-medium text-sm leading-snug">{project.name}</h3>
          <Badge className={`shrink-0 border-transparent ${STAGE_BADGE[project.stage]}`}>
            {STAGE_LABELS[project.stage]}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-2">{project.concept}</p>
          <div className="flex items-center gap-2">
            <Progress value={(done / total) * 100} className="h-1 flex-1" />
            <span className="text-xs text-muted-foreground tabular-nums shrink-0">
              {done}/{total}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <GitBranch className="size-3" />
              {project.repo_url ? "repo" : "no repo"}
            </span>
            {project.deploy_url && (
              <span className="flex items-center gap-1">
                <ExternalLink className="size-3" />
                deployed
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
