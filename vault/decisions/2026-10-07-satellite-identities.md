---
title: Decision — a mythological name + its own visual identity per satellite project
type: decision
project: siegfried
tags: [naming, design-system, satellite-projects, design-process]
status: final
created: 2026-10-07
updated: 2026-10-08
---

## Decision

Each satellite project gets (a) its own mythological name, following the pattern already set by "Siegfried" (a hero from Norse/Germanic mythology), and (b) a visual identity deliberately distinct from Siegfried and from the others — built on a **shared monochrome base**, differentiated via accent/typography/shape/layout, never via "repainting the palette."

| Slug | Name | Project | Mythology |
|---|---|---|---|
| `argus` | Argus | Common Operational Picture | Greek — the hundred-eyed giant, total surveillance |
| `janus` | Janus | Developer Platform Portal | Roman — god of gates and transitions |
| `siren` | Siren | Underwater acoustic-signature viewer | Greek — sirens, known for their song |
| `themis` | Themis | CMMC/NIST compliance assistant | Greek — goddess of divine law and justice |
| `athena` | Athena | Drone swarm mission planner | Greek — goddess of strategic warfare |

## Why

1. **Naming**: "Developer Platform Portal" is a generic, personality-free name, inconsistent with "Siegfried." A proper name per project reinforces that each one is a product with its own identity, not an interchangeable demo.
2. **Visual identity, attempt 1 (wrong)**: the first version of Janus only changed the color palette (a warm cream/terracotta theme instead of Siegfried's neutral/violet). The user corrected this: repainting the background/cards/borders from one color to another isn't designing an identity, it's a reskin. It also breaks the family's coherence — if every app has a different color base, the portfolio stops feeling like the work of one designer with a point of view.
3. **Visual identity, attempt 2 (right) — the framework**:
   - **Shared base**: neutral grayscale (the same discipline tokens as Siegfried) across every app. This is what keeps them "in the same family."
   - **Real differentiation** via: (a) an accent used only for functional signals — primary button, focus ring, active state, never as a surface fill; (b) its own typography; (c) a specific shape language (not "rounder" in general, but a concrete shape metaphor); (d) a distinct layout architecture (not the same pattern recolored); (e) a motion personality.

## The process: benchmark before designing

For Janus, instead of inventing the shape/layout language from scratch, 3 real products in the domain (self-service developer tooling) were researched **with real screenshots**, not from memory:

- **Railway** (railway.com) — the closest functionally. Real pattern: a project/environment breadcrumb + **horizontal tabs** per section (Architecture/Observability/Logs/Settings), services as nodes on a canvas, a single live accent (violet) restricted to the primary CTA and the active state, a marketing-serif headline contrasting with sans product UI.
- **Linear** (linear.app) — the reference for interface discipline. A simple sidebar, an almost-black base, color appearing *only* for specific functional signals (a priority star), dense rows instead of cards.
- **Port** (port.io) — confirmed general domain conventions (an entity/blueprint-based catalog, pill-shaped buttons), though its current marketing doesn't show real dashboard screenshots.

This is the process to repeat for Argus, Siren, Themis and Athena when their turn comes: **2-3 real references from that specific project's domain, with screenshots, before proposing a design direction** — not a generic "inspired by," but concrete, citable patterns.

## Janus — final result

- **Layout**: horizontal tabs (Catalog/Provisioning/Pipelines/Assistant) with a compact breadcrumb-style header, directly inspired by Railway — replaces Siegfried's hero+grid pattern.
- **Accent**: amber, restricted to the active tab's underline, the primary button, and status dots — Linear's discipline.
- **Base**: pure neutral grayscale, same as Siegfried — no color tint on backgrounds/cards/borders.
- **Typography**: Fraunces (serif, italic) for the wordmark/title only, Plus Jakarta Sans for the rest of the UI — a pairing inspired by Railway's serif/sans contrast, uncommon, memorable.
- **Mode**: dark by default (`defaultTheme="dark"`, not synced with the system) — its own identity, distinct from Siegfried's light-first/system-synced default.
- **Shape**: a moderate corner radius (`0.75rem`), not overdone.

## Pending

Argus, Siren, Themis and Athena still don't have their own visual identity defined — each will be designed with this same process (real benchmark first) once that project starts getting built.
