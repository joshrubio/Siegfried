# Siegfried

Dashboard operativo: vault de memoria con frontmatter + búsqueda RAG + kanban de proyectos satélite (ideación → producción → lanzamiento). Ver [`vault/docs/vault-conventions.md`](vault/docs/vault-conventions.md) para cómo está organizado el contenido.

## Estructura

```
Siegfried/
├── vault/              # memoria en markdown + frontmatter (research, projects, decisions, docs, private/ gitignored)
├── guides/             # material de estudio para entrevista (gitignored — usa nombres reales a propósito)
├── apps/dashboard/     # Next.js — vault + buscador RAG + kanban de proyectos + página de detalle por proyecto
├── supabase/schema.sql # esquema Postgres + pgvector + satellite_projects (ejecutar en el SQL editor de Supabase)
└── .env.example
```

## Proyectos satélite

Cada proyecto de la pool (ver `vault/projects/project-pool.md`) vive en su propio repositorio, como carpeta hermana de `Siegfried/` en disco — nunca anidado ni como submódulo. El estado operativo (etapa, checklist, links) vive en la tabla `satellite_projects` de Supabase — no en un archivo local — para que local y un futuro deploy en la nube compartan el mismo estado en vivo.

## Setup local

1. `cp .env.example .env.local` y rellenar las claves de Supabase + Voyage (ver abajo).
2. `cd apps/dashboard && npm install && npm run dev`

## Supabase

1. Crear un proyecto en Supabase (ya hecho — cuenta conectada a GitHub).
2. Pegar `SUPABASE_URL` / `SUPABASE_SECRET_KEY` en `.env.local` — usamos el formato de API key **nuevo** de Supabase (`sb_secret_...`), no el `service_role` JWT legacy que Supabase está deprecando (ver [`vault/decisions/2026-10-07-supabase-key-format.md`](vault/decisions/2026-10-07-supabase-key-format.md)).
3. Ejecutar `supabase/schema.sql` en el SQL editor del proyecto (activa `pgvector`, crea `vault_chunks` + `match_vault_chunks`, y `satellite_projects`). No hace falta connection string — todo pasa por el cliente JS de Supabase (REST/RPC).
4. `npm run seed-projects` (una vez) para poblar `satellite_projects` con la pool inicial de 5 ideas.
5. `npm run index` para indexar el vault (consume tokens de Voyage AI — pausar entre notas por el rate limit del free tier, ver `scripts/index.ts`). `vault/private/` nunca se indexa.
6. Local y producción apuntan a la misma instancia — no hay paso de sincronización manual.
