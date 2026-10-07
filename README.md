# Siegfried

Dashboard base de desarrollo: vault de memoria con frontmatter + búsqueda RAG + panel de proyectos satélite. Ver [`vault/docs/vault-conventions.md`](vault/docs/vault-conventions.md) para cómo está organizado el contenido.

## Estructura

```
Siegfried/
├── vault/              # memoria en markdown + frontmatter (research, projects, decisions, docs)
├── apps/dashboard/      # Next.js — visor del vault, buscador RAG, panel de proyectos
├── supabase/schema.sql  # esquema Postgres + pgvector (ejecutar en el SQL editor de Supabase)
├── projects.json        # registro de proyectos satélite (repo, local path, deploy url, estado)
└── .env.example
```

## Proyectos satélite

Cada proyecto de la pool (ver `vault/projects/project-pool.md`) vive en su propio repositorio, como carpeta hermana de `Siegfried/` en disco — nunca anidado ni como submódulo. El registro vivo está en `projects.json`.

## Setup local

1. `cp .env.example .env.local` y rellenar las claves de Supabase (ver abajo).
2. `cd apps/dashboard && npm install && npm run dev`

## Supabase

1. Crear un proyecto en Supabase (ya hecho — cuenta conectada a GitHub).
2. Pegar la `DATABASE_URL` / `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`.
3. Ejecutar `supabase/schema.sql` en el SQL editor del proyecto (activa `pgvector` y crea la tabla `vault_chunks` + la función de búsqueda `match_vault_chunks`).
4. Local y producción apuntan a la misma instancia — no hay paso de sincronización manual.
