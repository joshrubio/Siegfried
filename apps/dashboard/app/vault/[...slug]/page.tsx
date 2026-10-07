import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getNote } from "@/lib/vault";

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const note = getNote(slug.join("/"));
  if (!note) notFound();

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-10">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← Siegfried
      </Link>
      <h1 className="text-2xl font-semibold mt-4">{note.frontmatter.title}</h1>
      <div className="flex gap-2 mt-2 text-xs text-neutral-500">
        <span>{note.frontmatter.type}</span>
        {note.frontmatter.project && <span>· {note.frontmatter.project}</span>}
        {note.frontmatter.status && <span>· {note.frontmatter.status}</span>}
      </div>
      <article className="prose dark:prose-invert mt-8 max-w-none">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </article>
    </main>
  );
}
