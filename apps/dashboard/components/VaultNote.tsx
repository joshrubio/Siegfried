import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getNote } from "@/lib/vault";
import { Badge } from "@/components/ui/badge";

export default async function VaultNote({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const note = getNote(slug.join("/"));
  if (!note) notFound();

  return (
    <>
      <h1 className="text-2xl font-semibold">{note.frontmatter.title}</h1>
      <div className="flex items-center gap-2 mt-3">
        <Badge variant="outline">{note.frontmatter.type}</Badge>
        {note.frontmatter.project && <Badge variant="outline">{note.frontmatter.project}</Badge>}
        {note.frontmatter.status && <Badge variant="secondary">{note.frontmatter.status}</Badge>}
      </div>

      <article className="prose dark:prose-invert prose-neutral mt-8 max-w-none">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </article>
    </>
  );
}
