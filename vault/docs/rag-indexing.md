---
title: Cómo funciona la indexación RAG
type: doc
project: siegfried
tags: [docs, rag, supabase, pgvector]
status: in-progress
created: 2026-10-07
updated: 2026-10-07
---

## Esquema

Tabla `vault_chunks` en Supabase (Postgres + pgvector), definida en `supabase/schema.sql`:

- Cada nota del vault se parte en chunks (por ahora: 1 chunk por nota si es corta; a trocear por encabezados `##` cuando crezcan).
- Cada chunk guarda su `embedding` (vector), más `note_path`, `title`, `type`, `project`, `tags` — así la búsqueda puede filtrar por tipo o proyecto antes de rankear por similitud.
- Función SQL `match_vault_chunks(query_embedding, match_count, filter_project, filter_type)` hace la búsqueda por coseno con `pgvector` (índice HNSW).

## Flujo de indexado (script `scripts/index.ts`, pendiente de escribir)

1. Leer todos los `.md` de `vault/**`.
2. Parsear frontmatter (gray-matter) + cuerpo.
3. Trocear el cuerpo en chunks.
4. Generar embeddings (modelo por definir — Voyage AI o similar vía `VOYAGE_API_KEY`, o Anthropic si se usa un modelo con endpoint de embeddings).
5. `upsert` en `vault_chunks` por `note_path` + `chunk_index` (borrar y reinsertar los chunks de una nota si cambió).
6. Correr manualmente (`npm run index`) después de editar el vault — no hay watcher automático todavía.

## Flujo de búsqueda (dashboard)

1. Usuario escribe una pregunta en lenguaje natural.
2. Server action/API route del dashboard genera el embedding de la pregunta.
3. Llama a `match_vault_chunks` vía Supabase client.
4. (Opcional) pasa los chunks recuperados a un LLM para sintetizar una respuesta en vez de solo listar resultados.

## Pendiente

- Elegir el proveedor de embeddings definitivo y fijar la dimensión del vector en el esquema (ahora mismo `vector(1024)` es un placeholder).
- Escribir `scripts/index.ts`.
- Decidir si el troceo por encabezados vale la pena ahora o si se deja para cuando el vault crezca.
