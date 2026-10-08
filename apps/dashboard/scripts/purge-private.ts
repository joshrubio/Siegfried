// One-time use: deletes from Supabase any chunk already indexed from vault/private/.
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
import { getSupabaseServerClient } from "../lib/supabase";

async function main() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("vault_chunks")
    .delete()
    .like("note_path", "private/%")
    .select("note_path");

  if (error) {
    console.error("✗", error.message);
    process.exit(1);
  }
  console.log(`✓ deleted ${data?.length ?? 0} rows from vault_chunks (note_path like 'private/%')`);
}

main().then(() => process.exit(0));
