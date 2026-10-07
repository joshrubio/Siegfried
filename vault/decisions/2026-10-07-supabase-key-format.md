---
title: Decisión — usar el nuevo formato de API keys de Supabase
type: decision
project: siegfried
tags: [supabase, security, api-keys]
status: final
created: 2026-10-07
updated: 2026-10-07
---

## Decisión

Usar las API keys nuevas de Supabase (`sb_publishable_...` / `sb_secret_...`) en vez de las legacy JWT (`anon` / `service_role`). Variables de entorno: `SUPABASE_URL` + `SUPABASE_SECRET_KEY` (server-side only, nunca expuesta al cliente).

## Por qué

Supabase está deprecando las keys JWT legacy a favor del formato nuevo. Construir sobre el formato antiguo hoy significa migrar en 3-6 meses cuando lo desactiven — mejor empezar ya con el formato soportado a largo plazo.

## Nota

No usamos `DATABASE_URL` (connection string Postgres directa) — toda la interacción con Supabase pasa por el cliente JS (`@supabase/supabase-js`) vía REST/RPC (`lib/supabase.ts`), así que esa variable del `.env.example` original quedó obsoleta y se eliminó.
