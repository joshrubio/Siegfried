---
title: Janus (Developer Platform Portal) — spec
type: project
project: janus
tags: [idp, rag, agentic, platform-engineering]
status: active
created: 2026-10-07
updated: 2026-10-08
---

Satellite project #2 from the [[project-pool]]. Own repo: `github.com/joshrubio/Janus`, sibling folder `D:\Coding\Janus`.

## Why the name

Janus — Roman god of gates, thresholds, and transitions. A literal fit: this project is the entry gate to environments, services, and pipelines. Every satellite project gets its own mythological name so each has its own visual and brand identity, distinguishable from Siegfried at a glance (see [[2026-10-07-satellite-identities]]).

## What it is

An Internal Developer Platform (IDP) in miniature — simulated self-service tooling for an engineering team. It answers, line by line, the real Platform Engineering job posting researched in `vault/private/`: *"designing and deploying agentic AI workflows to streamline developer activities, infrastructure operations, and platform compliance."*

Siegfried itself (see [[project-siegfried]]) was the first iteration of this concept, applied inward (vault + RAG + project registry). Janus is the version applied outward: a portal an engineering team would actually use.

## Visual identity

A neutral grayscale base, the same discipline as Siegfried — the differentiation lives in the accent (amber, restricted to active state/primary button/status dots, never backgrounds), the typography (Fraunces italic serif for the wordmark + Plus Jakarta Sans for the UI), and the default mode (dark, not synced with the system). Designed after a real benchmark of Railway, Linear, and Port (the pipelines dashboard's structure) and, later, a reference CRM dashboard (the home page's structure) — never invented from scratch or copied verbatim, only the structural grammar. Full detail and the process to repeat for the other satellites: [[2026-10-07-satellite-identities]] and [[satellite-engineering-patterns]].

## Navigation and layout (revised after the first pass)

The original layout (horizontal tabs + no home of its own) was replaced with one closer to a real IDP:

- **Header**: Catalog, Provisioning, and Pipelines as persistent nav, alongside the search box (⌘K) and the wordmark.
- **Home (`/`)**: a real dashboard — stat cards with deltas, the runs-per-day chart, a services and reliability breakdown, direct links to all 4 services. Compressed into two columns (stat cards + chart on the left, Services + Reliability stacked on the right) so it can be scanned without scrolling.
- **Assistant**: no longer a fifth tab — it's a 48px rail that expands on hover and overlays the content (same pattern as Siegfried's `VaultSidebar`, documented in [[satellite-engineering-patterns]]), with no close button. Still responds to "Open Assistant" from ⌘K and to the dashboard tile.

## The 4 pillars

1. **Service catalog** — a list of simulated "internal services" (name, owner, stack, status, docs). The simplest core feature to demo first.
2. **Environment provisioning (self-service)** — a form that simulates provisioning infrastructure (pick a service + environment type → simulated progress log → output URL/credentials). Never touches real infrastructure — it's upfront about being a UX simulation, not a real IaC engine.
3. **Pipeline status** — a simulated CI/CD view (runs with success/failed/running status).
4. **Agentic (RAG) chatbot over internal docs** — reuses the same pattern already built in Siegfried (Supabase + pgvector + Voyage embeddings), the same stack applied to THIS project's own documentation. Lives in the Assistant sidebar, not its own route.

## Honesty about scope

No pillar requires pretending to be a real infrastructure engineer — everything is transparently simulated/mocked. The value demonstrated is: self-service tooling UX + fullstack + applying AI (RAG) to a real developer-experience problem. Same angle already validated for the whole pool in [[josh-profile]].

## Stack

Same as Siegfried: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, to keep development speed and consistency with already-solved patterns (RAG, Supabase, deploy). An independent repo, with no code dependency on Siegfried — it only shares the pattern, not shared libraries.

## Progress

See this project's card on Siegfried's dashboard (`/projects/janus`) for live operational status (stage, checklist, links). This note is the content spec; the dashboard is the source of truth for status.
