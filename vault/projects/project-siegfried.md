---
title: Siegfried — the development base dashboard
type: project
project: siegfried
tags: [siegfried, platform-engineering, rag]
status: in-progress
created: 2026-10-07
updated: 2026-10-07
---

## What it is

The "control plane" from which every project in the [[project-pool]] gets researched, documented, and launched. It isn't a project in the pool itself — it's the base that supports all of them, and it's itself an exercise in Platform Engineering (see the "Employer A" research in `vault/private/`, alias explained in `vault/private/employer-alias-map.md`).

## Architecture

- `vault/` — markdown notes with frontmatter (this same collection of files)
- `apps/dashboard/` — Next.js: the vault viewer, RAG search, the satellite projects panel
- `projects.json` — the registry of each satellite project (repo, local path, deploy URL, status)
- RAG: Postgres + pgvector on Supabase (user decision, 2026-10-07) — local and cloud share the same live database

## Decisions

- Satellite repos live as sibling folders (`D:\Coding\<project>`), not as submodules — avoids git history coupling.
- Repo hosting: GitHub, personal account `joshrubio`.

## Next step

See [[project-siegfried-setup]] for the build log.
