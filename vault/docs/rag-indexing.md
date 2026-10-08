---
title: Cómo funciona la indexación RAG
type: doc
project: siegfried
tags: [docs, rag, supabase, pgvector, voyage]
status: active
created: 2026-10-07
updated: 2026-10-08
---

## Esquema

Tabla `vault_chunks` en Supabase (Postgres + pgvector), definida en `supabase/schema.sql`:

- Cada nota del vault se parte en chunks por encabezado `##` (`chunkContent` en `scripts/index.ts`) — una nota sin encabezados `##` se indexa como un único chunk.
- Cada chunk guarda su `embedding` (`vector(1024)`), más `note_path`, `title`, `type`, `project`, `tags`, `chunk_index` — la búsqueda puede filtrar por `project`/`type` antes de rankear por similitud coseno.
- Función SQL `match_vault_chunks(query_embedding, match_count, filter_project, filter_type)` hace la búsqueda con pgvector.

## Proveedor de embeddings: Voyage AI (`voyage-4-lite`, 1024 dim)

Decisión final — `lib/embeddings.ts` llama a la API de Voyage con `VOYAGE_API_KEY`. Misma clave reutilizada en Janus y Siren (ver [[2026-10-07-architecture]]): es la cuenta personal de Josh, no acopla infraestructura entre proyectos, y el free tier (200M tokens, pero **3 req/min sin tarjeta en el archivo**) alcanza de sobra para el tamaño de estos corpus.

## Flujo de indexado (`apps/dashboard/scripts/index.ts`, `npm run index` desde `apps/dashboard`)

1. `listNotes()` lee todos los `.md` de `vault/**`, **excluyendo `vault/private/`** — esa carpeta no se indexa nunca, ni local ni en la nube (ver [[2026-10-07-private-vault-folder]]).
2. Parsea frontmatter (gray-matter) + cuerpo.
3. Trocea el cuerpo por `## ` (`chunkContent`).
4. Para cada nota: espera 21s (paceo preventivo), genera embeddings de sus chunks; si Voyage responde 429, reintenta con 22s de espera hasta 5 veces (`embedWithRetry`).
5. Borra los chunks existentes de esa `note_path` y reinserta los nuevos (`delete` + `insert`, no `upsert` real — más simple de razonar que un diff de chunks).
6. Se corre a mano después de editar el vault — no hay watcher automático.

Este mismo patrón (paceo preventivo + retry con backoff en 429) se reutilizó tal cual en Janus (`scripts/index-docs.ts`) para indexar su propia carpeta `docs/`.

## Flujo de búsqueda

1. UI: `SearchBox` (sidebar del vault) o el input del dashboard.
2. `POST /api/search` con `{ query, project?, type? }` — genera el embedding de la pregunta y llama a `match_vault_chunks` vía Supabase client.
3. Devuelve los chunks más similares **sin pasar por un LLM** — es retrieval puro, no generación. La UI lista los resultados con su `similarity` y el usuario navega a la nota.

(Janus sí añade una capa de generación sobre su propio retrieval — ver `projects/janus` — pero Siegfried deliberadamente no: el vault es para que Josh encuentre sus propias notas, no para conversar con ellas.)

## Pendiente

- Troceo por encabezados asume `##` consistente; si una nota crece mucho con subsecciones `###` sin `##` por medio, un chunk puede volverse grande — no ha hecho falta resolverlo todavía.
- Sin watcher: fácil olvidar correr `npm run index` después de editar — considerar un hook de pre-commit o un comando que avise si hay notas más nuevas que el último índice.
