import Link from "next/link";
import { listNotes, groupByFolder } from "@/lib/vault";
import { listProjects } from "@/lib/projects";
import SearchBox from "@/components/SearchBox";

const FOLDER_LABELS: Record<string, string> = {
  research: "Investigación",
  private: "Privado (no en git)",
  projects: "Proyectos",
  decisions: "Decisiones",
  docs: "Docs",
};

export default function Home() {
  const grouped = groupByFolder(listNotes());
  const projects = listProjects();

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-[2fr_1fr]">
      <section>
        <h1 className="text-2xl font-semibold mb-1">Siegfried</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Vault + RAG + panel de proyectos satélite
        </p>

        <SearchBox />

        <div className="mt-10 grid gap-8">
          {Object.entries(grouped).map(([folder, notes]) => (
            <div key={folder}>
              <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-3">
                {FOLDER_LABELS[folder] ?? folder}
              </h2>
              <ul className="grid gap-1">
                {notes.map((note) => (
                  <li key={note.slug}>
                    <Link
                      href={`/vault/${note.slug}`}
                      className="block rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <span className="font-medium">{note.frontmatter.title}</span>
                      {note.frontmatter.status && (
                        <span className="ml-2 text-xs text-neutral-500">
                          {note.frontmatter.status}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <aside>
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-3">
          Proyectos satélite
        </h2>
        <ul className="grid gap-3">
          {projects.map((p) => (
            <li
              key={p.slug}
              className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3"
            >
              <div className="font-medium text-sm">{p.name}</div>
              <div className="text-xs text-neutral-500 mt-1">{p.status}</div>
              <div className="mt-2 flex gap-3 text-xs">
                {p.repo_url ? (
                  <a href={p.repo_url} className="underline">
                    repo
                  </a>
                ) : (
                  <span className="text-neutral-400">sin repo</span>
                )}
                {p.deploy_url && (
                  <a href={p.deploy_url} className="underline">
                    deploy
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
