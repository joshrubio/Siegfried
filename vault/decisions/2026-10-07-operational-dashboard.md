---
title: Decision — Siegfried as an operational dashboard (kanban + state in Supabase)
type: decision
project: siegfried
tags: [architecture, kanban, supabase, projects]
status: final
created: 2026-10-07
updated: 2026-10-07
---

## Decision

Siegfried stops being just a search tool over the vault and becomes an operational dashboard, inspired by the pattern in `D:\Conquest` (a dashboard that drives work through stages) but simplified:

- **3 stages** per satellite project: `ideation → production → launched` (a 3-column kanban on the home page).
- Within "production", a **universal 5-step checklist** (scaffold, core feature, polish/UX, deployed, documented) — not separate stages with gates, because the 5 projects are homogeneous (small web apps), unlike Conquest's episodes.
- Each project gets its own **detail page** (`/projects/[slug]`, styled like a Vercel project card): concept, links (repo/local/dev/deploy), editable checklist, stage selector.
- State (`satellite_projects` in Supabase) **replaces** `projects.json` — same principle already applied to the vault: local and a future cloud deploy share the same live data, instead of a flat file that doesn't persist on an ephemeral filesystem.

## Deploy — a two-phase decision

- **Phase 1 (implemented now)**: the deploy button on the detail page links to `deploy_url` if it exists, or shows "not deployed yet." It doesn't trigger anything.
- **Phase 2 (pending, deliberately postponed)**: real integration with the Vercel API to deploy with one click from the dashboard — built once at least one real satellite project is ready to go to production, not before.

## Why

The user pointed out that the result so far (a passive search tool) didn't capture the original intent: a dashboard that helps *track and drive* each project's development, not just look up notes. The 3-stage + universal-checklist model gives that tracking without the complexity of a 12-stage pipeline with gates, which doesn't fit homogeneous software projects.
