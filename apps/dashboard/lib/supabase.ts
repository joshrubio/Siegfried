import { createClient } from "@supabase/supabase-js";

// Server-side only (API routes, server components, scripts) — never expose
// SUPABASE_SECRET_KEY to the client.
// Uses Supabase's newer API key format (sb_secret_...), not the legacy service_role JWT.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SECRET_KEY in the environment (see .env.example)"
    );
  }
  return createClient(url, key);
}
