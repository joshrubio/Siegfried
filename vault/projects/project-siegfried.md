---
title: Siegfried — dashboard base de desarrollo
type: project
project: siegfried
tags: [siegfried, platform-engineering, rag]
status: in-progress
created: 2026-10-07
updated: 2026-10-07
---

## Qué es

El "control plane" desde el que se investiga, documenta y lanza cada proyecto de la [[project-pool]]. No es un proyecto de la pool — es la base que los sostiene a todos, y en sí mismo es un ejercicio de Platform Engineering (ver [[helsing-dc-job-requirements]]).

## Arquitectura

- `vault/` — notas markdown con frontmatter (esta misma colección de archivos)
- `apps/dashboard/` — Next.js: visor del vault, buscador RAG, panel de proyectos satélite
- `projects.json` — registro de cada proyecto satélite (repo, local path, deploy URL, estado)
- RAG: Postgres + pgvector en Supabase (decisión del usuario, 2026-10-07) — local y nube comparten la misma base de datos en vivo

## Decisiones

- Repos satélite viven como carpetas hermanas (`D:\Coding\<proyecto>`), no como submódulos — evita acoplamiento de historial git.
- Hosting de repos: GitHub, cuenta personal `joshrubio`.

## Siguiente paso

Ver [[project-siegfried-setup]] para el log de construcción.
