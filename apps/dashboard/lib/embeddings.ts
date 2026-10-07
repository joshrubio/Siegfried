// Voyage AI — recomendado por Anthropic para embeddings. voyage-4-lite => 1024 dims
// por defecto, coincide con la columna `embedding vector(1024)` en supabase/schema.sql.
const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";

export async function embed(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error("Falta VOYAGE_API_KEY en el entorno (ver .env.example)");
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
