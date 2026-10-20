---
title: Themis (CMMC/NIST compliance assistant) — spec
type: project
project: themis
tags: [compliance, nist, security, devsecops]
status: active
created: 2026-10-20
updated: 2026-10-20
---

Satellite project #4 from the [[project-pool]]. Own repo: `github.com/joshrubio/Themis`, sibling folder `D:\Coding\Themis`.

## Why the name

Themis — Greek goddess of divine law and justice, depicted with scales, a classic symbol of audit. A literal fit: this project weighs infrastructure-as-code against compliance controls. Every satellite project gets its own mythological name so each has its own visual and brand identity, distinguishable from Siegfried at a glance (see [[2026-10-07-satellite-identities]]).

## What it is

An interpretation layer over LLM-generated CMMC / NIST SP 800-171 compliance findings, inspired by the DevSecOps job posting researched in `vault/private/`. Not a real static-analysis engine — no AST parser, no policy-as-code rule engine (unlike Checkov or tfsec), no access to live cloud infrastructure. The `/docs` page in the app states this plainly, the same honesty discipline as [[janus]]'s RAG scope and [[siren]]'s model limitations.

## Data and pipeline

Five deliberately-misconfigured example files under `examples/`: a Terraform S3 bucket (public ACL, no encryption, no logging, versioning disabled), a Terraform security group (SSH/RDP open to 0.0.0.0/0, unrestricted egress), a Terraform IAM policy (wildcard permissions, long-lived key), a Dockerfile (hardcoded secrets, `node:latest`), and a Kubernetes deployment (`hostNetwork`, `privileged`, root user, plaintext password, `:latest` tag).

`scripts/scan.ts` sends each file to Groq (`openai/gpt-oss-20b`, free tier — the same API key already used for [[janus]]'s RAG generation) with a system prompt that includes real NIST SP 800-171 Rev 2 control numbers and families, so the model cites actual controls (`3.1.20`, `3.13.16`, etc.) instead of inventing plausible-sounding ones. Output is strict JSON, parsed and written once to `lib/findings.json` (16 findings total) — not regenerated on every page load, the same "precompute once" choice as Siren's spectrograms.

The shared prompt/call logic lives in `lib/scan.ts`, reused by both the offline script and `app/api/scan/route.ts`, which powers a live "paste a config, get findings" feature on `/scan` — the one place the model runs live, mirroring the split between Janus's precomputed dashboard and its live RAG chat.

## The app

- **`/` (Scan log)** — a Checkov-style terminal list (`Check: <id>: "<title>"` / `FAILED for resource: <file>:<lines>`), filterable by severity and by file, each row linking to a finding detail page.
- **`/findings/[id]`** — a Wiz-style detail page: severity/control/family/language metadata grid, the file:line snippet, explanation, and remediation.
- **`/scan`** — paste a Terraform/Dockerfile/Kubernetes snippet, pick a language, get back findings from a live Groq call.
- **`/docs`** — the honest "what this is / isn't" writeup, how severity is scored, and the pipeline.
- Cookie-gated demo auth (`proxy.ts` + `/login`), same pattern as Janus and Siren, with an explicit "this is a demo, not real auth" disclaimer.

## Visual identity

Benchmarked against real cloud-security tool UIs — Wiz's finding-card metadata grid, Checkov's terminal scan-log format — rather than reskinned from the other satellites: JetBrains Mono used everywhere (not paired with a separate UI sans — this *is* a terminal), zero corner radius, a violet accent (`oklch(... 300)`) reserved for functional signals, and domain-accurate severity colors (critical=red, high=orange, medium=yellow, low=blue-gray) as a deliberate exception to the monochrome-only rule — the same exception class as Siren's magma spectrogram colormap. Full detail: [[satellite-engineering-patterns]].

## Honesty about scope

No pillar requires pretending to be a certified CMMC assessor. The value demonstrated is: the interpretation/UX layer over LLM output, grounded in real control references, with an honest accounting (in `/docs`) of what a real C3PAO assessment involves that this doesn't attempt. Same angle already validated for the whole pool in [[josh-profile]].

## Stack

Same as the other satellites: Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind v4 + shadcn/ui (`@base-ui/react`), plus Groq for generation. An independent repo, no code dependency on Siegfried.

## Progress

See this project's card on Siegfried's dashboard (`/projects/compliance-assistant-demo`) for live operational status (stage, checklist, links). This note is the content spec; the dashboard is the source of truth for status.
