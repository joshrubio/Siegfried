import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, STAGE_LABELS } from "@/lib/projects";
import ProjectOperations from "@/components/ProjectOperations";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-10">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← Siegfried
      </Link>

      <div className="flex items-center gap-3 mt-4">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <span className="text-xs rounded-full px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          {STAGE_LABELS[project.stage]}
        </span>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 max-w-2xl">
        {project.concept}
      </p>

      <div className="flex flex-wrap gap-3 mt-4 text-sm">
        {project.repo_url ? (
          <a href={project.repo_url} className="underline" target="_blank">
            Repositorio
          </a>
        ) : (
          <span className="text-neutral-400">sin repositorio todavía</span>
        )}
        {project.vault_note && (
          <Link href={`/vault/${project.vault_note}`} className="underline">
            Spec completo en el vault
          </Link>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-2">
          Deploy
        </h2>
        {project.deploy_url ? (
          <a
            href={project.deploy_url}
            target="_blank"
            className="inline-block rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 text-sm"
          >
            Visitar deploy ↗
          </a>
        ) : (
          <p className="text-sm text-neutral-500">
            Aún no desplegado. {project.local_path && (
              <>Local: <code className="text-xs">{project.local_path}</code></>
            )}
          </p>
        )}
        {project.dev_url && (
          <p className="text-xs text-neutral-400 mt-2">
            Dev local: <code>{project.dev_url}</code>
          </p>
        )}
      </div>

      <div className="mt-8">
        <ProjectOperations project={project} />
      </div>
    </main>
  );
}
