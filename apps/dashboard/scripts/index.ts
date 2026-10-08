// Usage: npm run index  (from apps/dashboard)
// Reads vault/**.md, splits each note into chunks, generates embeddings, and upserts to Supabase.
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
import { listNotes } from "../lib/vault";
import { embed } from "../lib/embeddings";
import { getSupabaseServerClient } from "../lib/supabase";

function chunkContent(content: string): string[] {
  // Simple chunking by ## heading — good enough while notes stay short.
  const sections = content.split(/\n(?=## )/g).map((s) => s.trim()).filter(Boolean);
  return sections.length > 0 ? sections : [content.trim()];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// With no card on file, Voyage's rate limit is 3 req/min — retry with a wait instead
// of failing. The free tokens (200M) still apply either way, this just paces the calls.
async function embedWithRetry(chunks: string[], attempt = 1): Promise<number[][]> {
  try {
    return await embed(chunks);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("429") && attempt <= 5) {
      const waitMs = 22_000;
      console.log(`  … rate limited, waiting ${waitMs / 1000}s (attempt ${attempt}/5)`);
      await sleep(waitMs);
      return embedWithRetry(chunks, attempt + 1);
    }
    throw err;
  }
}

async function main() {
  // vault/private/ is never indexed: it's employer research that's deliberately
  // gitignored — it shouldn't end up in a queryable database (local or cloud)
  // or in the dashboard's search.
  const notes = listNotes().filter((n) => !n.slug.startsWith("private/"));
  const supabase = getSupabaseServerClient();

  for (const note of notes) {
    const chunks = chunkContent(note.content);
    await sleep(21_000); // preventive pacing: free tier with no card on file = 3 req/min
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
