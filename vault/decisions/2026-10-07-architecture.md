---
title: Decisión de arquitectura — Siegfried + proyectos satélite
type: decision
project: siegfried
tags: [architecture, rag, repos]
status: final
created: 2026-10-07
updated: 2026-10-07
---

## Decisión

1. Vector store / RAG: **Postgres + pgvector vía Supabase**. Local y producción comparten la misma base de datos en vivo (no hay desincronización entre entornos).
2. Repos: **GitHub, cuenta personal `joshrubio`**. Cada proyecto de la pool es un repo independiente, sibling folder en disco (no submódulo).
3. Siegfried es su propio repo, separado de cada proyecto satélite.

## Por qué

- pgvector hosteado > vector store local-only porque la narrativa de entrevista necesita infra real en la nube, no solo un hack local.
- Repos separados > monorepo porque el usuario pidió orden explícito: "deben vivir luego en su propio repositorio".
- Siblings > submódulos porque los submódulos de git son frágiles y no aportan nada aquí — el registro en `projects.json` cumple la misma función de forma más simple.
