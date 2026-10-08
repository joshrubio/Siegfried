---
title: Vault conventions
type: doc
project: siegfried
tags: [docs, conventions, frontmatter]
status: active
created: 2026-10-07
updated: 2026-10-08
---

## Folder structure

```
vault/
├── research/   # general research findings (profile, architecture)
├── private/    # research on specific employers (aliased "Employer A", "B"... — see vault/private/employer-alias-map.md) — GITIGNORED,
│               # stays local-disk only, never pushed to the repo (see vault/decisions/2026-10-07-private-vault-folder.md)
├── projects/   # specs and status for each project (the pool + Siegfried itself)
├── decisions/  # log of technical decisions, one per file, dated in the filename
└── docs/       # this folder — documentation on how Siegfried itself works
```

## What goes in `private/`

Any note researching a specific employer (their stack, their job postings, interview strategy) — not because it's secret, but because it's personal job-search information that doesn't belong in a repo's history, not even a private one. Everything else (architecture, one's own profile, technical decisions) stays in the rest of the vault and is version-controlled.

## Required frontmatter

```yaml
---
title: <human-readable name>
type: research | project | decision | doc
project: <slug of the project it belongs to, or "siegfried">
tags: [list, of, tags]
status: active | in-progress | final | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
source_urls:          # optional, only if type: research
  - https://...
---
```

`type` and `project` are the two fields the RAG indexer uses to filter searches (e.g. "only type:research notes about project:lura-acoustic-viewer").

## Links between notes

`[[filename-without-extension]]` — same as the memory system. The indexer resolves them to real links in the dashboard; a linked note that doesn't exist yet isn't an error, it's a note still to be written.

## When to add a note here vs. in a satellite project's own repo

- Siegfried's vault: anything that's research, a decision, or context *shared* across projects, or about Siegfried itself.
- A satellite project's repo: anything specific to THAT project once it starts being built (its own README, its own `docs/` folder if it needs one, its code).

This folder (`docs/`) keeps filling in as Siegfried grows. See [[rag-indexing]] for how the RAG indexer works, and [[satellite-engineering-patterns]] for the technical and design patterns that recur across satellite projects (Cache Components, collapsible sidebars, precomputed data, lint traps, visual-identity benchmarking).
