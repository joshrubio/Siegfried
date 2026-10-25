---
title: Argus (simulated C2 operations console) — spec
type: project
project: argus
tags: [c2, ops-dashboard, simulation, maplibre, cloud-build]
status: active
created: 2026-10-25
updated: 2026-10-25
---

Satellite project #1 (and the last one built) from the [[project-pool]]. Own repo: `github.com/joshrubio/Argus`, sibling folder `D:\Coding\Argus`.

## Why the name

Argus — the hundred-eyed giant of Greek myth, a fit for a dashboard whose whole job is total situational awareness: many simulated eyes (UAVs, fixed sensors) fused into one picture. Every satellite project gets its own mythological name so each has its own visual and brand identity, distinguishable from Siegfried at a glance (see [[2026-10-07-satellite-identities]]).

## How this one was built — entirely in the cloud

Unlike the first four satellites, Argus was built by a remote cloud agent (Claude Code's remote/cloud isolation mode), dispatched from the main Siegfried working session with a single large, self-contained prompt carrying the full established playbook (benchmark-first, the Next.js 16 + Cache Components pattern, the demo auth gate, the known gotchas already documented in [[satellite-engineering-patterns]]) — the remote environment had no access to this vault or any other local file, so the brief had to restate the conventions rather than point at them. The agent researched, scaffolded, designed, built, verified, and pushed the repo autonomously; its git worktree was synced back to `D:\Coding\Argus` automatically once it finished. The main session then verified the live app in the browser, registered it in `satellite_projects`, and wrote this note.

## What it is

A simulated command-and-control (C2) style operations console, inspired by the operator-interface angle researched in `vault/private/`. One dense dashboard screen: a real map, a live-feeling simulated asset/event feed, and a rules-based recommendation panel — not a specific real product, and explicitly not a surveillance or targeting tool.

## Data and pipeline

- **Map**: MapLibre GL JS over CARTO's free dark-matter basemap (no API key), centered on the real Almería, Spain coastline — a relatable, legible backdrop, not a claim about real activity there.
- **Simulation** (`lib/simulation.ts`): 5 UAVs flying circular patrol orbits + 3 fixed sensor posts, all positions/telemetry generated client-side via a seeded PRNG and a `setInterval` tick (~1/sec) — no WebSocket server, no database, the same "simulate in the browser" choice Athena made for its drone paths.
- **Event feed**: geofence drift, low battery, link degradation, sensor faults, calibration drift, weather notices — generated at low per-tick probabilities, deliberately worded as neutral ops/logistics issues (verify position, dispatch diagnostics, recall and recharge) rather than anything threat- or targeting-shaped. Sanity-checked live in the browser after the build: the framing reads as an asset-coordination tool, not a weapons system.
- **Recommendations** (`lib/rules-engine.ts`): a small deterministic if/then rules engine evaluated against current simulated state every tick (low battery + still on task, degraded/lost link, an unacknowledged event, a coverage gap left by a recalled asset), ranked by severity — not an LLM call. Each recommendation names the exact rule that fired it. Chosen over a Groq call deliberately: a transparent rule beats a model dressed up to reason over synthetic numbers, and it needed zero new API key.

## The app

- **`/` (Dashboard)** — status bar (sim clock, severity counts, avg link quality), full-bleed map with moving markers, an asset list panel (battery/link/sector per asset), a ticking event feed, and the ranked recommendation panel — map-first with docked side panels, a direct structural borrow from MarineTraffic's 2023 redesign.
- **`/docs`** — the honest "what's real / what's simulated" writeup, matching the tone of the other four satellites' docs pages.
- Cookie-gated demo auth (`proxy.ts` + `/login`), same pattern as the other four.

## Visual identity

Benchmarked against NASA Open MCT (github.com/nasa/openmct — a real open-source mission-control framework; grounded the dense, hierarchical, telemetry-first panel layout), Grafana's dark theme (near-black panels, small/tight radius, a single reserved accent, a UI/mono type pairing), and MarineTraffic's 2023 web redesign (map-first canvas with floating, de-clutterable side panels). Flightradar24/adsb.lol and Palantir Foundry were checked too but yielded little concrete visual detail and didn't contribute directly — noted honestly rather than papered over. Resulting identity: a warm signal red-orange accent (distinct from Janus/amber, Siren/cyan, Themis/violet, Athena/phosphor-green — no repeats across the portfolio), Inter (UI) + Roboto Mono (telemetry/IDs/timestamps), a small 0.4rem radius (denser than Janus/Athena, short of Themis's zero-radius terminal look), and deliberate visual density — live map, status bar, asset list, ticking feed, and recommendation panel all visible and moving at once, a direct response to earlier user feedback that prior builds were drifting too minimalist for a C2-style tool.

One open design note flagged by the build itself: the map canvas stays dark even when the site theme toggles to light (like a radar/sonar scope staying dark regardless of room lighting) — a deliberate choice, not a bug, worth revisiting if a theme-matched basemap swap is ever wanted.

## Honesty about scope

No pillar requires pretending to track anything real. The value demonstrated is: a dense, live-feeling operational dashboard UI, a transparent rules-based prioritization system, and restraint in framing (ops/logistics language throughout, never targeting-shaped) — exactly the kind of judgment call a real C2/ops-tool UX role would require. `/docs` states plainly that this isn't a deployed system and isn't modeled on one specific real product.

## Stack

Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind v4 + shadcn/ui (`@base-ui/react`), plus MapLibre GL JS. An independent repo, no code dependency on Siegfried.

## Progress

See this project's card on Siegfried's dashboard (`/projects/altra-dashboard-concept`) for live operational status (stage, checklist, links). This note is the content spec; the dashboard is the source of truth for status.

With Argus built, all five projects in the [[project-pool]] are now complete.
