---
title: Decision — vault/private/ gitignored for employer research
type: decision
project: siegfried
tags: [privacy, gitignore, vault]
status: final
created: 2026-10-07
updated: 2026-10-07
---

## Decision

All research on a specific employer (e.g. "Employer A" — see `vault/private/employer-alias-map.md`, and any future one) lives in `vault/private/`, which is in `.gitignore`. It stays on disk so it can keep being browsed locally and the dashboard can keep showing it, but it never gets pushed to the Siegfried repo.

## Why

It isn't classified or legally sensitive information — it's personal job-search research (interview strategy, reading job postings, notes on a recruiter). It doesn't belong in a portfolio repo's history, not even a private one: if the repo is ever shared, made public, or someone is simply shown the code, that folder shouldn't show up.

## Note on git history

The 3 research files for the first employer studied were already committed and pushed to GitHub before this decision — moving them and gitignoring them stops future tracking, but **the content still exists in earlier commits' history** on `github.com/joshrubio/Siegfried`. Purging it from history too would require rewriting it (`git filter-repo` or similar) + a force-push — this wasn't done automatically because it's a destructive operation that requires explicit confirmation.
