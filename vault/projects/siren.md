---
title: Siren (underwater acoustic classification viewer) — spec
type: project
project: lura-acoustic-viewer
tags: [ml-interpretation, audio, classifier, honest-framing]
status: active
created: 2026-10-08
updated: 2026-10-08
---

Satellite project #3 from the [[project-pool]]. Own repo: `github.com/joshrubio/Siren`, sibling folder `D:\Coding\Siren`.

## Why the name

The sirens of Greek mythology, known for their song — a direct fit with *acoustic* signatures. Its own identity versus Janus and Siegfried, same criteria documented in [[2026-10-07-satellite-identities]].

## What it is

An interpretation/UX layer over the output of a real audio classifier — **not** a machine-learning engineering project. It answers the underwater-acoustic-surveillance angle without pretending to a competency Josh doesn't have: the value demonstrated is taking a model's prediction + confidence and turning it into something an analyst can read and interpret quickly, with its limits exposed rather than hidden.

## Data: DeepShip, not ShipsEar

Two real vessel-noise datasets were evaluated. ShipsEar (University of Vigo) requires requesting full access by email — it only offers a generic public sample. **DeepShip** (Jalkanen et al., cited in 2024-2026 papers) has a substantial portion directly on GitHub with no gate: 24 real recordings used (6 per class — Cargo, Tanker, Passenger, Tug), downloaded in two rounds, with the user's explicit confirmation each time.

## Pipeline (offline, Python — `scripts/preprocess.py`)

1. Slices each recording into 6s windows (with 3s overlap only on training files, for more data without touching the test set).
2. Per window: a mel spectrogram (magma colormap, the domain standard) → PNG; MFCC + delta-MFCC + spectral shape (centroid, bandwidth, rolloff, zero-crossing, contrast) → feature vector; an audio clip at 11025Hz/16-bit for browser playback (classification uses the full 22050Hz — the downsample is just to avoid committing 220MB of wav files).
3. Train/test split **at the file level**, not the window level — no file contributes windows to both sides. Avoids the leakage that artificially inflates accuracy (see the "UniqueShip" paper cited in the `/model` UI).
4. Compares Random Forest vs. SVM (RBF) on the real test set; keeps the better one (SVM, 56.6%).
5. Writes `lib/clips-index.json` (one row per window: true class, predicted class, per-class confidence, spectrogram/audio paths) and `lib/metrics.json` (accuracy, per-class precision/recall/F1, confusion matrix) — all static, no database or live inference.

## The app

- `/` — a master-detail Explorer: a filterable list (by class, test-only, misclassified-only) + a detail panel with the spectrogram, a player, per-class confidence bars, and a frequency-band energy breakdown.
- `/model` — honest numbers: real accuracy, a per-class table, a confusion matrix as a heatmap, and a section explaining why Tanker gets 0% recall (too little vessel variation in training, not a bug).

## Visual identity

Benchmarked against real audio-analysis tools — iZotope RX's spectral editor, sonar waterfall-style displays — instead of reskinning Janus or Siegfried. A near-pure-black background, a cyan accent restricted to functional signals, IBM Plex Sans/Mono, a tighter corner radius (instrument-panel look). Process detail: [[2026-10-07-satellite-identities]].

## Honesty about scope

The model is genuinely mediocre on one class (Tanker) and the UI says so explicitly instead of papering over it — it's part of the value proposition, not a flaw to hide. See [[satellite-engineering-patterns]] for the general pattern of honesty around simulated or real data/models across satellites.

## Progress

See this project's card on Siegfried's dashboard (`/projects/lura-acoustic-viewer`) for live operational status. This note is the content spec; the dashboard is the source of truth for status.
