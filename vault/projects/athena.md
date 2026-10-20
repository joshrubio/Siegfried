---
title: Athena (drone swarm mission planner) — spec
type: project
project: athena
tags: [drones, geospatial, simulation, maplibre]
status: active
created: 2026-10-20
updated: 2026-10-20
---

Satellite project #5 from the [[project-pool]]. Own repo: `github.com/joshrubio/Athena`, sibling folder `D:\Coding\Athena`.

## Why the name

Athena — Greek goddess of strategic warfare and tactics, planning rather than brute combat. A literal fit: this project is a planning tool (waypoints, coverage, simulated coordination), not a weapon. Every satellite project gets its own mythological name so each has its own visual and brand identity, distinguishable from Siegfried at a glance (see [[2026-10-07-satellite-identities]]).

## What it is

A drone swarm mission planner, inspired by the autonomous-drone and C2-platform angle researched in `vault/private/`. The user explicitly asked for this one to be visually rich rather than minimalist — Athena and its pool sibling Argus both center on a real interactive map, and the user flagged a drift toward minimalism in earlier satellites as something to actively counter here. The result leans into real map density: live streets, floating glass panels, a HUD-style telemetry readout — not a stripped-down dashboard.

## Data and pipeline

No precomputed dataset this time — the "data" is whatever the user draws on the map, processed by real libraries:

- **Map**: MapLibre GL JS over CartoDB's free dark-matter vector basemap (no API key).
- **Coverage-path generation** (`lib/coverage.ts`): a real boustrophedon ("lawnmower") sweep — Turf.js computes sweep-line/polygon-boundary intersections (`lineIntersect`, `polygonToLine`) to produce real lane segments inside a drawn polygon, round-robined across the configured fleet size, each drone's lanes chained into one flyable path (alternating direction so legs connect end-to-end).
- **Simulation** (`lib/simulate.ts`): walks a path's cumulative segment distances to sample position/heading at any elapsed time — a disclosed kinematic model (constant cruise speed, linear battery drain, flat altitude hold with a short takeoff/landing ramp), not real flight dynamics.
- **Ground truth** (`app/api/ground-truth`): proxies Mapillary's Image Radius Search (lat/lng/radius, max 50m) server-side, so the client never sees the Mapillary token. Returns a real public photo near the clicked point, or an honest "none within 50m" — the common case almost everywhere.

## The app

- **`/` (Mission)** — the core feature: a full-bleed map with a left tool strip (waypoint/coverage mode, active-drone picker, fleet-size stepper, Generate button, ground-truth panel), top floating KPI tiles (drones/waypoints/coverage area/est. time), a right collapsible fleet panel (per-drone waypoints/distance/time/battery), and a bottom bar (altitude-profile/mission-stats toggle + play/pause/speed/scrubber) — the tool-strip/editor-panel/bottom-stats grammar is a direct structural borrow from QGroundControl's Plan View.
- **`/docs`** — the honest writeup: real map/geometry/imagery vs. simulated flight, and the coverage algorithm's known limitation (fixed sweep orientation, not rotated to the polygon's minimum-width axis).
- Cookie-gated demo auth (`proxy.ts` + `/login`), same pattern as the other three satellites.

## Visual identity

Benchmarked against real screenshots/docs of QGroundControl (Plan View's tool strip, editor panel, bottom stats/terrain-profile toggle) and DJI FlightHub 2 (floating glass KPI tiles, compass/zoom cluster over a dark map) — not reskinned from the other satellites: a near-black radar-scope backdrop, a phosphor-green accent (unused elsewhere in the portfolio — Janus is amber, Siren is cyan, Themis is violet) reserved for functional signals, Space Grotesk for UI chrome paired with Space Mono for telemetry/coordinate readouts, and a small "glass panel" radius (0.5rem) with backdrop blur — distinct from Themis's zero radius and Siren's tighter instrument-panel radius.

## Honesty about scope

No pillar requires pretending to be a real flight-control system. The value demonstrated is: real interactive mapping, real computational geometry for coverage planning, and an honest kinematic simulation layered on top — with a ground-truth panel that uses genuinely real public imagery instead of faking a drone camera feed. `/docs` states plainly what a real mission planner (QGroundControl, DJI FlightHub, Auterion Mission Control) validates that this doesn't attempt (airspace, battery reserves, RF link budgets).

## Stack

Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind v4 + shadcn/ui (`@base-ui/react`), plus MapLibre GL JS, Turf.js, and Mapillary's Graph API v4. An independent repo, no code dependency on Siegfried.

## Progress

See this project's card on Siegfried's dashboard (`/projects/swarm-mission-planner`) for live operational status (stage, checklist, links). This note is the content spec; the dashboard is the source of truth for status.
