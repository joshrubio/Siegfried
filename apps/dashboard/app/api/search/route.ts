import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { embed } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  const { query, project, type } = await req.json();
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Missing 'query'" }, { status: 400 });
  }

  const [queryEmbedding] = await embed([query]);

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("match_vault_chunks", {
    query_embedding: queryEmbedding,
    match_count: 8,
    filter_project: project ?? null,
    filter_type: type ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ results: data });
}
