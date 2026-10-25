---
title: Recurring engineering patterns across satellites
type: doc
project: siegfried
tags: [docs, patterns, nextjs, gotchas, design]
status: active
created: 2026-10-08
updated: 2026-10-25
---

Things that kept recurring while building Janus, Siren, Themis, Athena, and Argus — now all five pool ideas are built, so this is the reference for the next thing, not for "the next satellite."

## Delegating a whole satellite build to a remote cloud agent (Argus)

Argus was the first satellite built by dispatching a single Agent call with `isolation: "remote"` instead of building it directly in the local session. It worked well, with one structural requirement: **the remote environment has no access to this vault, this repo, or any local file** — it's a genuinely separate sandbox. The prompt had to restate the entire playbook inline (the Next.js 16 + Cache Components pattern, the exact auth-gate file contents, every gotcha already written down here) rather than pointing at `vault/docs/satellite-engineering-patterns.md` the way an in-session agent could. A prompt that just says "follow the usual pattern" will fail silently in a remote agent — there is no "usual" it can see.

What came back for free: the remote agent's git worktree synced back to a local folder (`D:\Coding\<Project>`) automatically once it finished, so the finished build was immediately inspectable and runnable locally, exactly like a build done in-session — the only extra step needed was registering it in `satellite_projects` and writing its vault note, both of which still require local/vault access the remote agent never had.

## Next.js 16 + Cache Components

Every satellite uses `cacheComponents: true` in `next.config.ts` (aggressive prerendering by default). Rules that take a while to find the first time:

- Any component using `usePathname()`, `params`, or `redirect()` needs a `<Suspense>` around it — otherwise the build fails with prerendering errors. Pattern used across all three projects: wrap the specific component (`<Suspense fallback={...}><HeaderNav /></Suspense>`), not the whole page.
- `export const runtime = "nodejs"` on a route handler is **incompatible** with `cacheComponents: true` — and isn't needed anyway, nodejs is the default runtime.
- After editing many files in a row, Turbopack sometimes serves stale cache (route types, CSS). If something doesn't reflect the change: kill the process on the port, `rm -rf .next`, restart `npm run dev`. Happened several times across all three projects, always fixed this way.
- After deleting `.next`, a standalone `npx tsc --noEmit` can fail with `Cannot find name 'LayoutProps'` (or `PageProps`) — it's the global type Next regenerates in `.next/types`. Fastest fix: `npx next typegen` (a dedicated command, no full build needed), then re-run `tsc`. A page/layout component that forwards `params`/`searchParams` to a child by re-annotating the child's props with the same `PageProps<"/route">` type will fail if the JSX call site only passes some of those props (e.g. `params` but not `searchParams`) — type the child's prop narrowly instead, e.g. `{ params: PageProps<"/route">["params"] }`.
- `proxy.ts` is the Next 16 convention replacing `middleware.ts` (the exported function must be named `proxy`, not `middleware`) — using it from the start avoids a build-time deprecation warning that showed up on Siren.

## `create-next-app` leaves zombie npx processes (happened on Siren and Themis)

After scaffolding visibly completes, the `npx create-next-app` process (and its child) can stay alive holding a lock on the project folder, silently blocking every subsequent `npm install` in that directory — symptom: a backgrounded install produces zero output and no `node.exe` ever spawns. Fix: `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Select-Object ProcessId, CommandLine | Where-Object {$_.CommandLine -match '<ProjectName>'}`, then `taskkill //PID <id> //F` on both the npx wrapper and the create-next-app child, then retry the install. Worth checking for this *before* assuming a slow-disk install is just slow.

Related: running two `npm install` invocations concurrently in the same project (e.g. a leftover scaffold install racing a dependency install) can corrupt the dependency tree in a way that only surfaces later, as a postinstall script failing with a missing-module error for an unrelated transitive dependency (seen on Themis: `unrs-resolver`'s postinstall couldn't find `napi-postinstall`, even though neither package was the one actually being installed). The fix isn't to debug that specific error — it's to confirm only one `npm install` is running against the project at a time, then re-run `npm install` with no arguments to repair the tree.

## A "hung" install can just be one very slow disk read (Athena)

Before concluding an install is genuinely stuck and killing it, check CPU time across *two* spaced-out readings, not one. On this disk, a single already-cached package read logged by `npm --loglevel verbose` took up to 19 seconds — a quick CPU check can easily land twice inside that one read's window and show identical, unchanging CPU time, looking exactly like a true hang. Killing and retrying in that state just restarts the same slow work from scratch. Only treat it as a real hang if CPU time is still unchanged after several minutes, not after one check.

## MapLibre GL JS + Turbopack (Athena)

Three real gotchas showed up getting a real interactive map (not a design placeholder) working:

1. **Worker fails to load, in both dev and production builds.** `maplibre-gl`'s default `new Worker(new URL('./maplibre-gl-worker...', import.meta.url))` path doesn't resolve under Turbopack — the browser reports "Worker failed to load" / a non-JS MIME type, and the map silently never fetches its style. Fix: copy `node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs` into `public/`, then call `maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs")` at module scope before the first `new maplibregl.Map(...)` — confirmed via `maplibregl.getWorkerUrl()` logging that the config value actually took effect before chasing it further. Exclude that vendored file from eslint (it's minified, not source) via `globalIgnores` in `eslint.config.mjs`.
2. **The map container collapses to zero height even though its own parent is sized correctly.** maplibre-gl's own stylesheet sets `.maplibregl-map { position: relative }` on the container element (it adds that class itself), which silently overrides a Tailwind `absolute` utility class on the same div — `inset-0` then does nothing, and the element collapses to its (empty) content height. Give the map container `h-full w-full` instead of `absolute inset-0`; let an already-`position:relative` ancestor (or a wrapping div you do control) handle the absolute positioning of sibling overlay panels.
3. **Drone/marker objects silently stop updating after a dev remount.** React 18 StrictMode double-invokes effects once in dev, destroying and recreating the `Map` instance. A `markersRef` (or similar) that isn't cleared in that same cleanup keeps stale entries from the destroyed map, so a `!markersRef.current.has(id)` guard skips recreating them for the new map — markers silently never appear, with no error. Clear/remove tracked objects in the *same* cleanup function that calls `map.remove()`, not a separate effect.

## The no-jump collapsible sidebar pattern (used three times now)

Both Siegfried's `VaultSidebar` and Janus's `AssistantSidebar` are rails that expand to reveal content that doesn't exist in the collapsed state (a search box, a title, a description, or the full chat). If that extra content simply appears above the icon list, the list jumps position on expand — it looks broken even though each state is fine on its own.

Solution applied first in Siegfried (commit "Fix vault sidebar collapse/expand jump"), then reused as-is in the redesign of Janus's `AssistantSidebar`:

- The header (search box, or the "Assistant" label) occupies a **fixed-height zone** in both states — icon only vs. full content.
- The nav/content row below it starts at the **same fixed offset** in both cases, not dynamically centered with pure flexbox — the content that follows (note list, chat history) has variable height and breaks any "perfect" centering; a fixed, identical offset in both states is more robust.
- Iteration note: in Siegfried, vertically centering the collapsed state's icons (instead of top-justified) was tried first — it looked better in theory, but once seen live the user asked to revert it to top-justified. The lesson isn't "top beats centered," it's that **the shared fixed offset is what matters**, not whether that offset is small or large — so the revert was a one-line change (the `padding-top` value), not a restructure.
- The expanded panel is positioned **absolute**, overlaid on top of the content (with `shadow-xl`), instead of pushing the page layout — the collapsed rail (48px) does take up real space in the flow, but the expanded panel doesn't. This avoids a second kind of jump: the main content reflowing every time the sidebar opens.
- Janus also dropped the explicit close button it used to have (opened on click, closed with a `PanelLeftClose` icon) in favor of pure hover, same as Siegfried — moving the mouse away collapses it, no dedicated control needed. The external triggers that already existed (the "Open Assistant" command in Cmd+K, the dashboard tile) stay in place: they simply force the same `hovered` state to `true` instead of a separate `open` state.

## Precompute and serve static instead of standing up new infrastructure

A pattern repeated twice now, worth treating as the default: if the corpus is small (a few dozen documents, a handful of audio files), **don't** stand up a new database per satellite project.

- Janus: RAG over `docs/*.md` — Voyage embeddings precomputed to `lib/docs-index.json`, in-memory cosine similarity on every request. Zero database.
- Siren: audio classifier — spectrograms, confidence, and metrics precomputed by `scripts/preprocess.py` into static JSON/PNG/wav files in `public/`. Zero live inference.

Same reasoning documented in both: the cost of pgvector/a dedicated database isn't justified for a few dozen items, and "didn't need a database" is itself a defensible engineering decision, not a shortcoming.

## Recurring lint traps (`eslint-config-next` + strict `react-hooks`)

Two lint errors showed up **in all three projects** (Siegfried, Janus, Siren), always the same pattern:

1. **`react-hooks/set-state-in-effect`** — the hydration guard `useEffect(() => setMounted(true), [])` (used in every theme toggle to avoid a hydration mismatch) gets flagged as an error. It's an intentional, safe pattern (it's not a subscription, it's a one-time mount flag) — resolved with a `// eslint-disable-next-line react-hooks/set-state-in-effect` comment explaining why, not by rewriting the logic.
2. **`react-hooks/static-components`** — a custom render component (e.g. a Recharts chart's `tick`) declared *inside* another function component, to close over local variables. Fixed by hoisting it to module scope and passing those variables as explicit props instead of via closure.

If a new satellite uses the same theme-toggle pattern or Recharts charts, run the full `npx eslint .` (not just `tsc`) before calling a phase done — the build and typecheck pass clean with both of these errors present; only lint catches them.

## Real data sources for domains that aren't your own

For Siren (underwater acoustics, not Josh's domain) the criterion that worked: look for a real academic dataset, cited in recent papers, with a portion **downloadable without requesting access** (ShipsEar requires email; DeepShip has a portion directly on GitHub). Prefer that over generating synthetic data — "real data, an honest interpretation layer over a real model" is the project's entire value proposition, not a detail.

Process note: downloading any file requires the user's explicit confirmation (name, source, size) before fetching it — happened twice in Siren (12 initial files, then 12 more while tuning the classifier), and both times it was asked first.

## Visual identity: benchmark something real before designing, don't just swap the palette

Process already documented in [[2026-10-07-satellite-identities]], reinforced twice more:

- Janus benefited from comparing itself against real Linear (tokens, radius, typography) for its dashboard, and again against a reference CRM dashboard screenshot for the new home page — in both cases the rule was to copy the **structural grammar** (stat cards with a delta badge, an area chart with a tooltip, tabs with a segmented bar) and not the content or the palette.
- Siren was benchmarked against real audio-analysis tools (iZotope RX's spectral editor, sonar waterfall displays) — hence the pure near-black background, the magma colormap on the spectrograms (a domain standard, not decoration), and the mono/technical typography.

Every satellite ended up with: a disciplined monochrome base, a single functional accent (never a surface fill), its own typography, and a distinct corner radius — that's where the differentiation lives, never in "just swap the primary color."

## A dashboard scannable at a glance: two columns, no gaps

Janus's dashboard was reorganized at the user's explicit request so that everything fits on one screen with no scrolling: instead of full-width stacked sections (4 stat cards → chart → Services/Reliability side by side), it was grouped into two containers — a wide left column (2×2 stat cards + the runs chart, one above the other) and a narrow right column (Services + Pipeline reliability, one above the other) — via `grid-cols-[2fr_1fr]`.

A trap when doing this: if one column has more content than the other, CSS Grid stretches the shorter container to match the row's height (`align-items: stretch` by default), but the content *inside* that container doesn't stretch on its own — leaving a blank gap below the last element. Fix: the short column switches from `space-y-4` (simple stacking) to `flex flex-col gap-4`, and that column's last card gets `flex-1` to grow and fill the remaining space — and if that card has a chart with a fixed height (`h-32`), that height also switches to `flex-1 min-h-32` so the chart itself (not just the card's padding) uses the extra space instead of leaving it empty.

## Honesty in simulated model/data output

A writing pattern that keeps recurring and is worth keeping: when a number is synthetic (Janus's dashboard deltas, Siren's low confidence on Tanker), **say so explicitly in the UI**, not just in a code comment. Janus labels its deltas as "demo series, same spirit as the seeded pipeline runs." Siren devotes a whole section of `/model` to explaining why Tanker gets 0% recall, with the real cause (too little vessel variation in training) instead of hiding the number or inflating it.
