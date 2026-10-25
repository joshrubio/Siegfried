---
title: Candidate project pool
type: project
project: siegfried
tags: [pool, ideas]
status: active
created: 2026-10-07
updated: 2026-10-08
---

Five project ideas, researched from the real products and published job postings of "Employer A" (alias — see `vault/private/employer-alias-map.md` for the full connection). Once built, each one lives in its own repository under GitHub (joshrubio), with its own mythological name and visual identity (see [[2026-10-07-satellite-identities]]), and is tracked in Supabase's `satellite_projects` table.

## 1. Argus — Common Operational Picture — ✅ BUILT
A simulated C2-style operations console: a real MapLibre map (free CARTO dark-matter basemap, no token) over the real Almería coastline, showing 8 simulated assets (5 UAVs on patrol orbits, 3 fixed sensors) driven by a client-side `setInterval` simulation — no WebSocket server, no database, same "simulate in the browser" principle as Athena. A ticking event feed (geofence drift, low battery, link degradation, sensor faults — deliberately framed as neutral ops/logistics issues, never targeting-shaped) feeds a deterministic rules engine that ranks recommended actions, each one showing the exact rule that fired it (no LLM call, no new API key needed). Built entirely in a remote cloud agent session while the main session stayed local. Repo: [`Argus`](https://github.com/joshrubio/Argus). Identity benchmarked against NASA Open MCT (dense telemetry-first panel layout), Grafana's dark theme (near-black panels, tight radius, one reserved accent), and MarineTraffic's map-first redesign (full-bleed map + docked panels) — warm signal red-orange accent, Inter + Roboto Mono. Full spec: [[argus]]. Name: the hundred-eyed giant — total surveillance.

## 2. Janus — Developer Platform Portal with an agentic (RAG) assistant — ✅ BUILT
A self-service portal: service catalog, "provision an environment," pipeline status, a RAG chatbot over docs. Answers, line by line, the description of their Platform Engineering role. Repo: [`Janus`](https://github.com/joshrubio/Janus). Identity benchmarked against real Linear (tokens, radius) and against a reference CRM dashboard for the home page. A real dashboard at `/` with stats, a runs-per-day chart, and links to all 4 services; Catalog/Provisioning/Pipelines in the header, Assistant as a collapsible sidebar. (Siegfried itself was the first iteration of this concept — see [[project-siegfried]]). Full spec: [[janus]]. Name: the Roman god of gates and transitions — the entry portal.

## 3. Siren — underwater acoustic-signature viewer — ✅ BUILT
Uses **DeepShip** (24 real recordings, Cargo/Tanker/Passenger/Tug — ShipsEar required requesting access by email, DeepShip has a portion downloadable directly from GitHub). An offline Python pipeline (`scripts/preprocess.py`): mel spectrograms, MFCC/spectral features, an SVM trained with a file-level split (not window-level, to avoid leakage) — 56.6% real accuracy across 4 classes. A master-detail viewer with spectrogram, per-class confidence, and frequency-band breakdown; an honest `/model` page on why Tanker gets 0% recall. Honest: it doesn't pretend to be an ML engineering project, it builds the interpretation/UX layer over the model's output. Identity benchmarked against iZotope RX and sonar displays — pure black, cyan accent, IBM Plex. Repo: [`Siren`](https://github.com/joshrubio/Siren). Full spec: [[siren]]. Name: the sirens, known for their song — a fit for *acoustic* signatures.

## 4. Themis — automated CMMC/NIST compliance assistant — ✅ BUILT
Scans five deliberately-misconfigured IaC examples (Terraform, Dockerfile, Kubernetes), uses Groq to flag compliance gaps against real NIST SP 800-171 Rev 2 control numbers, in a Checkov-style scan log with Wiz-style finding detail pages, plus a live paste-and-scan feature. Inspired by their DevSecOps role. Repo: [`Themis`](https://github.com/joshrubio/Themis). Identity benchmarked against Wiz (finding-card metadata grid) and Checkov (terminal scan-log format) — single monospace typeface, zero radius, violet accent. Full spec: [[themis]]. Name: the Greek goddess of divine law and justice — the scale, a classic symbol of auditing.

## 5. Athena — drone swarm mission planner — ✅ BUILT
A real MapLibre map over a free basemap: waypoint and coverage-area drawing, a real boustrophedon coverage-path algorithm (Turf.js) that splits lanes across a fleet, a client-side kinematic simulation with play/scrub/speed controls, and a ground-truth panel pulling real nearby public photos from Mapillary's Image Radius Search. Inspired by their autonomous drone and C2 platform. Repo: [`Athena`](https://github.com/joshrubio/Athena). Identity benchmarked against QGroundControl (tool-strip/editor-panel/bottom-stats grammar) and DJI FlightHub 2 (floating glass KPI tiles, compass/zoom cluster) — near-black radar-scope backdrop, phosphor-green accent, Space Grotesk + Space Mono. Full spec: [[athena]]. Name: goddess of strategic warfare and tactics — planning, not brute combat.

## Build status

See the `satellite_projects` table in Supabase (via Siegfried's dashboard, `/projects/<slug>`) for the live record of each one's repos/URLs/status.
