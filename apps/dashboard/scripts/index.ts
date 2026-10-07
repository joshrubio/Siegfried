// Uso: npm run index  (desde apps/dashboard)
// Lee vault/**.md, parte cada nota en chunks, genera embeddings y hace upsert en Supabase.
import "dotenv/config";
import { listNotes } from "../lib/vault";
import { embed } from "../lib/embeddings";
import { getSupabaseServerClient } from "../lib/supabase";

function chunkContent(content: string): string[] {
  // Troceo simple por encabezado ## — suficiente mientras las notas sean cortas.
  const sections = content.split(/\n(?=## )/g).map((s) => s.trim()).filter(Boolean);
  return sections.length > 0 ? sections : [content.trim()];
}

async function main() {
  const notes = listNotes();
  const supabase = getSupabaseServerClient();

  for (const note of notes) {
    const chunks = chunkContent(note.content);
    const embeddings = await embed(chunks);

    await supabase.from("vault_chunks").delete().eq("note_path", note.slug);

    const rows = chunks.map((content, i) => ({
      note_path: note.slug,
      title: note.frontmatter.title,
      type: note.frontmatter.type,
      project: note.frontmatter.project ?? null,
      tags: note.frontmatter.tags ?? [],
      chunk_index: i,
      content,
      embedding: embeddings[i],
    }));

    const { error } = await supabase.from("vault_chunks").insert(rows);
    if (error) {
      console.error(`✗ ${note.slug}:`, error.message);
    } else {
      console.log(`✓ ${note.slug} (${rows.length} chunk${rows.length > 1 ? "s" : ""})`);
    }
  }
}

main().then(() => process.exit(0));
