---
title: How RAG indexing works
type: doc
project: siegfried
tags: [docs, rag, supabase, pgvector, voyage]
status: active
created: 2026-10-07
updated: 2026-10-08
---

## Schema

`vault_chunks` table in Supabase (Postgres + pgvector), defined in `supabase/schema.sql`:

- Each vault note is split into chunks by `##` heading (`chunkContent` in `scripts/index.ts`) — a note with no `##` headings gets indexed as a single chunk.
- Each chunk stores its `embedding` (`vector(1024)`), plus `note_path`, `title`, `type`, `project`, `tags`, `chunk_index` — search can filter by `project`/`type` before ranking by cosine similarity.
- The SQL function `match_vault_chunks(query_embedding, match_count, filter_project, filter_type)` runs the search with pgvector.

## Embeddings provider: Voyage AI (`voyage-4-lite`, 1024 dim)

Final decision — `lib/embeddings.ts` calls the Voyage API with `VOYAGE_API_KEY`. The same key is reused in Janus and Siren (see [[2026-10-07-architecture]]): it's Josh's personal account, it doesn't couple infrastructure between projects, and the free tier (200M tokens, but **3 req/min with no card on file**) is more than enough for the size of these corpora.

## Indexing flow (`apps/dashboard/scripts/index.ts`, `npm run index` from `apps/dashboard`)

1. `listNotes()` reads every `.md` under `vault/**`, **excluding `vault/private/`** — that folder is never indexed, locally or in the cloud (see [[2026-10-07-private-vault-folder]]).
2. Parses frontmatter (gray-matter) + body.
3. Chunks the body by `## ` (`chunkContent`).
4. For each note: waits 21s (preventive pacing), generates embeddings for its chunks; if Voyage returns 429, retries with a 22s wait up to 5 times (`embedWithRetry`).
5. Deletes that `note_path`'s existing chunks and reinserts the new ones (`delete` + `insert`, not a real `upsert` — simpler to reason about than diffing chunks).
6. Run by hand after editing the vault — there's no automatic watcher.

This same pattern (preventive pacing + retry-with-backoff on 429) was reused as-is in Janus (`scripts/index-docs.ts`) to index its own `docs/` folder.

## Search flow

1. UI: `SearchBox` (the vault sidebar) or the dashboard's input.
2. `POST /api/search` with `{ query, project?, type? }` — generates the question's embedding and calls `match_vault_chunks` via the Supabase client.
3. Returns the most similar chunks **without going through an LLM** — it's pure retrieval, not generation. The UI lists the results with their `similarity` and the user navigates to the note.

(Janus does add a generation layer on top of its own retrieval — see `projects/janus` — but Siegfried deliberately doesn't: the vault is for Josh to find his own notes, not to converse with them.)

## Pending

- Heading-based chunking assumes consistent `##` use; if a note grows a lot with `###` subsections and no `##` in between, a chunk can get large — hasn't needed solving yet.
- No watcher: easy to forget to run `npm run index` after editing — consider a pre-commit hook or a command that warns if any notes are newer than the last index.
