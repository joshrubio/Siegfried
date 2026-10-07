import Link from "next/link";
import { listNotes, groupByFolder } from "@/lib/vault";
import { listProjects } from "@/lib/projects";
import SearchBox from "@/components/SearchBox";
import KanbanBoard from "@/components/KanbanBoard";

const FOLDER_LABELS: Record<string, string> = {
  research: "Investigación",
  private: "Privado (no en git)",
  projects: "Proyectos",
  decisions: "Decisiones",
  docs: "Docs",
};

export default async function Home() {
  const grouped = groupByFolder(listNotes());
  const projects = await listProjects();

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-1">Siegfried</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Dashboard operativo + vault con búsqueda RAG
      </p>

      <section className="mb-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-3">
          Proyectos satélite
        </h2>
        <KanbanBoard projects={projects} />
      </section>

      <section className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-3">
            Vault
          </h2>
          <SearchBox />

          <div className="mt-8 grid gap-8">
            {Object.entries(grouped).map(([folder, notes]) => (
              <div key={folder}>
                <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-400 mb-2">
                  {FOLDER_LABELS[folder] ?? folder}
                </h3>
                <ul className="grid gap-1">
                  {notes.map((note) => (
                    <li key={note.slug}>
                      <Link
                        href={`/vault/${note.slug}`}
                        className="block rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <span className="font-medium text-sm">{note.frontmatter.title}</span>
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
        </div>
      </section>
    </main>
  );
}
