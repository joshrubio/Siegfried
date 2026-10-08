# Siegfried

Operational dashboard: a markdown-with-frontmatter memory vault + RAG search + a kanban of satellite projects (ideation → production → launched). See [`vault/docs/vault-conventions.md`](vault/docs/vault-conventions.md) for how the content is organized.

## Structure

```
Siegfried/
├── vault/              # markdown + frontmatter memory (research, projects, decisions, docs, private/ gitignored)
├── guides/             # interview study material (gitignored — uses real names on purpose)
├── apps/dashboard/     # Next.js — vault + RAG search + project kanban + a detail page per project
├── supabase/schema.sql # Postgres schema + pgvector + satellite_projects (run in Supabase's SQL editor)
└── .env.example
```

## Satellite projects

Each project in the pool (see `vault/projects/project-pool.md`) lives in its own repository, as a sibling folder to `Siegfried/` on disk — never nested or as a submodule. Operational status (stage, checklist, links) lives in Supabase's `satellite_projects` table — not a local file — so local and a future cloud deploy share the same live state.

## Local setup

1. `cp .env.example .env.local` and fill in the Supabase + Voyage keys (see below).
2. `cd apps/dashboard && npm install && npm run dev`

## Supabase

1. Create a Supabase project (already done — account connected to GitHub).
2. Paste `SUPABASE_URL` / `SUPABASE_SECRET_KEY` into `.env.local` — we use Supabase's **new** API key format (`sb_secret_...`), not the legacy `service_role` JWT that Supabase is deprecating (see [`vault/decisions/2026-10-07-supabase-key-format.md`](vault/decisions/2026-10-07-supabase-key-format.md)).
3. Run `supabase/schema.sql` in the project's SQL editor (enables `pgvector`, creates `vault_chunks` + `match_vault_chunks`, and `satellite_projects`). No connection string needed — everything goes through Supabase's JS client (REST/RPC).
4. `npm run seed-projects` (once) to populate `satellite_projects` with the initial pool of 5 ideas.
5. `npm run index` to index the vault (uses Voyage AI tokens — pauses between notes for the free tier's rate limit, see `scripts/index.ts`). `vault/private/` is never indexed.
6. Local and production point at the same instance — there's no manual sync step.
