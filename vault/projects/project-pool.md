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

## 1. Argus — Common Operational Picture
A C2-style dashboard: fuses simulated feeds (drones, sensors, threats) on a real-time map with an AI panel that prioritizes/recommends actions, inspired by the operator interface of their C2 platform. Stack: Next.js + Mapbox/deck.gl + WebSockets + synthetic (never real) data. Name: the hundred-eyed giant — total surveillance.

## 2. Janus — Developer Platform Portal with an agentic (RAG) assistant — ✅ BUILT
A self-service portal: service catalog, "provision an environment," pipeline status, a RAG chatbot over docs. Answers, line by line, the description of their Platform Engineering role. Repo: [`Janus`](https://github.com/joshrubio/Janus). Identity benchmarked against real Linear (tokens, radius) and against a reference CRM dashboard for the home page. A real dashboard at `/` with stats, a runs-per-day chart, and links to all 4 services; Catalog/Provisioning/Pipelines in the header, Assistant as a collapsible sidebar. (Siegfried itself was the first iteration of this concept — see [[project-siegfried]]). Full spec: [[janus]]. Name: the Roman god of gates and transitions — the entry portal.

## 3. Siren — underwater acoustic-signature viewer — ✅ BUILT
Uses **DeepShip** (24 real recordings, Cargo/Tanker/Passenger/Tug — ShipsEar required requesting access by email, DeepShip has a portion downloadable directly from GitHub). An offline Python pipeline (`scripts/preprocess.py`): mel spectrograms, MFCC/spectral features, an SVM trained with a file-level split (not window-level, to avoid leakage) — 56.6% real accuracy across 4 classes. A master-detail viewer with spectrogram, per-class confidence, and frequency-band breakdown; an honest `/model` page on why Tanker gets 0% recall. Honest: it doesn't pretend to be an ML engineering project, it builds the interpretation/UX layer over the model's output. Identity benchmarked against iZotope RX and sonar displays — pure black, cyan accent, IBM Plex. Repo: [`Siren`](https://github.com/joshrubio/Siren). Full spec: [[siren]]. Name: the sirens, known for their song — a fit for *acoustic* signatures.

## 4. Themis — automated CMMC/NIST compliance assistant
Scans example config/IaC, uses an LLM to flag compliance gaps in plain language + a dashboard, inspired by their DevSecOps role. Weaker (not Josh's strong domain). Name: the Greek goddess of divine law and justice — the scale, a classic symbol of auditing.

## 5. Athena — drone swarm mission planner
A map for defining waypoints, coverage, and simulating multi-drone coordination, inspired by their autonomous drone and C2 platform. Visually appealing, less anchored to a specific job posting. Name: goddess of strategic warfare and tactics — planning, not brute combat.

## Build status

See the `satellite_projects` table in Supabase (via Siegfried's dashboard, `/projects/<slug>`) for the live record of each one's repos/URLs/status.
