import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, GitBranch, FolderOpen } from "lucide-react";
import { getProject, STAGE_LABELS } from "@/lib/projects";
import ProjectOperations from "@/components/ProjectOperations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <Badge variant="secondary">{STAGE_LABELS[project.stage]}</Badge>
      </div>

      <p className="text-sm text-muted-foreground mt-3 max-w-2xl">{project.concept}</p>

      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
        {project.repo_url ? (
          <a
            href={project.repo_url}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-foreground hover:underline"
          >
            <GitBranch className="size-3.5" />
            Repositorio
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <GitBranch className="size-3.5" />
            sin repositorio todavía
          </span>
        )}
        {project.vault_note && (
          <Link
            href={`/vault/${project.vault_note}`}
            className="inline-flex items-center gap-1.5 text-foreground hover:underline"
          >
            <FolderOpen className="size-3.5" />
            Spec completo en el vault
          </Link>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Deploy
          </h2>
        </CardHeader>
        <CardContent>
          {project.deploy_url ? (
            <Button render={<a href={project.deploy_url} target="_blank" />}>
              Visitar deploy
              <ExternalLink className="size-4" />
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aún no desplegado.
              {project.local_path && (
                <>
                  {" "}
                  Local: <code className="text-xs bg-muted px-1 py-0.5 rounded">{project.local_path}</code>
                </>
              )}
            </p>
          )}
          {project.dev_url && (
            <p className="text-xs text-muted-foreground mt-2">
              Dev local: <code>{project.dev_url}</code>
            </p>
          )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <ProjectOperations project={project} />
    </>
  );
}
