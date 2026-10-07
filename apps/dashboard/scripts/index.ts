// Uso: npm run index  (desde apps/dashboard)
// Lee vault/**.md, parte cada nota en chunks, genera embeddings y hace upsert en Supabase.
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
import { listNotes } from "../lib/vault";
import { embed } from "../lib/embeddings";
import { getSupabaseServerClient } from "../lib/supabase";

function chunkContent(content: string): string[] {
  // Troceo simple por encabezado ## — suficiente mientras las notas sean cortas.
  const sections = content.split(/\n(?=## )/g).map((s) => s.trim()).filter(Boolean);
  return sections.length > 0 ? sections : [content.trim()];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Sin tarjeta en Voyage el rate limit es 3 req/min — reintenta con espera en vez
// de fallar. Los tokens gratis (200M) aplican igual, esto solo pacea las llamadas.
async function embedWithRetry(chunks: string[], attempt = 1): Promise<number[][]> {
  try {
    return await embed(chunks);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("429") && attempt <= 5) {
      const waitMs = 22_000;
      console.log(`  … rate limit, esperando ${waitMs / 1000}s (intento ${attempt}/5)`);
      await sleep(waitMs);
      return embedWithRetry(chunks, attempt + 1);
    }
    throw err;
  }
}

async function main() {
  // vault/private/ nunca se indexa: es investigación de empleadores que se
  // gitignoreó a propósito — no debe acabar en una base de datos consultable
  // (local o en la nube) ni en el buscador del dashboard.
  const notes = listNotes().filter((n) => !n.slug.startsWith("private/"));
  const supabase = getSupabaseServerClient();

  for (const note of notes) {
    const chunks = chunkContent(note.content);
    await sleep(21_000); // paceo preventivo: free tier sin tarjeta = 3 req/min
    const embeddings = await embedWithRetry(chunks);

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
