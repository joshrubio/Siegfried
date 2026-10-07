import { createClient } from "@supabase/supabase-js";

// Solo para uso en el servidor (API routes, server components, scripts) — nunca
// exponer SUPABASE_SERVICE_ROLE_KEY al cliente.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno (ver .env.example)"
    );
  }
  return createClient(url, key);
}
