import { createClient } from "@supabase/supabase-js";

// Solo para uso en el servidor (API routes, server components, scripts) — nunca
// exponer SUPABASE_SECRET_KEY al cliente.
// Usa el formato de API key nuevo de Supabase (sb_secret_...), no el service_role JWT legacy.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan SUPABASE_URL / SUPABASE_SECRET_KEY en el entorno (ver .env.example)"
    );
  }
  return createClient(url, key);
}
