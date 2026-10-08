---
title: Architecture decision — Siegfried + satellite projects
type: decision
project: siegfried
tags: [architecture, rag, repos]
status: final
created: 2026-10-07
updated: 2026-10-07
---

## Decision

1. Vector store / RAG: **Postgres + pgvector via Supabase**. Local and production share the same live database (no drift between environments).
2. Repos: **GitHub, personal account `joshrubio`**. Each project in the pool is its own repo, a sibling folder on disk (not a submodule).
3. Siegfried is its own repo, separate from every satellite project.

## Why

- Hosted pgvector > a local-only vector store because the interview narrative needs real cloud infra, not just a local hack.
- Separate repos > a monorepo because the user asked for explicit order: "they should each live in their own repository later."
- Siblings > submodules because git submodules are fragile and add nothing here — the record in `projects.json` serves the same purpose more simply.
