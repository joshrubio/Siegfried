---
title: Decision — use Supabase's new API key format
type: decision
project: siegfried
tags: [supabase, security, api-keys]
status: final
created: 2026-10-07
updated: 2026-10-07
---

## Decision

Use Supabase's new API keys (`sb_publishable_...` / `sb_secret_...`) instead of the legacy JWT ones (`anon` / `service_role`). Environment variables: `SUPABASE_URL` + `SUPABASE_SECRET_KEY` (server-side only, never exposed to the client).

## Why

Supabase is deprecating the legacy JWT keys in favor of the new format. Building on the old format today means migrating in 3-6 months when they're turned off — better to start now with the format that's supported long-term.

## Note

We don't use `DATABASE_URL` (a direct Postgres connection string) — all interaction with Supabase goes through the JS client (`@supabase/supabase-js`) via REST/RPC (`lib/supabase.ts`), so that variable from the original `.env.example` became obsolete and was removed.
