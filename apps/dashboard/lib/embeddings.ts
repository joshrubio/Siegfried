// Voyage AI — recommended by Anthropic for embeddings. voyage-4-lite => 1024 dims
// by default, matching the `embedding vector(1024)` column in supabase/schema.sql.
const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";

export async function embed(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VOYAGE_API_KEY in the environment (see .env.example)");
  }

  const res = await fetch(VOYAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input: texts, model: "voyage-4-lite" }),
  });

  if (!res.ok) {
    throw new Error(`Voyage embeddings error: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  return json.data.map((d: { embedding: number[] }) => d.embedding);
}
