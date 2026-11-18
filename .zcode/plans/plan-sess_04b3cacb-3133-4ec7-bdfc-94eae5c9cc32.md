# KDP Studio — Overnight Full Build (Phases 1–11)

## Context
Phase 0 (inventory, sitemap, capture checklist, stack decision) is approved. The user has pre-authorized the entire rebuild: build each phase → self-verify → next, **without waiting for "APPROVED"** (they're asleep; they explicitly waived the per-screen stop). The prompt's other rules stay in force: original assets only (name "KDP Studio", own palette, open-licensed fonts, Lucide icons, original copy + sample art), mock data only, no real AI/payments, evidence-first specs, per-screen verification docs + commits. The 243 tutorial frames are the visual evidence base; user screenshots never arrived, so screens without frame evidence are built in the observed design language and **marked placeholder in specs + wiring matrix**, with disabled controls + tooltips for unknown features (rule 5/7).

## Execution model
1. `git init` in workspace root; one commit per screen/phase (prompt §6H).
2. New public page discovered (`/coloring-books`): fetch it during Phase 5 for the coloring flow spec.
3. Sequential phases, each ending with: Playwright captures → `/docs/verification/<screen>.md` (side-by-side vs frames where evidence exists, behavior checklist, responsive shots @1280/1024/768/390, axe scan, console-clean check) → tests → commit.
4. Overnight progress log in `/docs/overnight-log.md`; morning handoff report at the end.

## Setup (once)
Next.js App Router + TS strict at workspace root (`src/`, `docs/`, `reference/` untouched). Deps: tailwind, radix primitives, `zustand` (state), `lucide-react`, `konva`+`react-konva`, `pdf-lib` (mock export), `next/font` Google **DM Sans** (OFL, similar to reference UI). Playwright + chromium + `@axe-core/playwright`. `/src/styles/tokens.ts` + CSS variables. Folder structure per prompt §5. `.gitignore` already covers `reference/` frames.

## Phase 1 — Tokens + foundation components
`tokens.ts` (colors light+dark — own violet-role palette, type scale, 4-pt spacing, radii, shadows, z-index, breakpoints, motion, icon sizes) → ~30 base components in `/src/components/ui` (button variants, inputs, select/combobox, checkbox/radio/switch, slider, tabs, tooltip, popover, dropdown/context menu, dialog, drawer, toast, badge, avatar, card, table, pagination, progress, spinner, skeleton, empty, banner) → `/dev/components` gallery (all states, both themes). Verify gallery vs frames; commit.

## Phase 2 — App shell
`/src/components/shell`: left sidebar (logo, "+ Create book", DASHBOARD section: Overview/My Books/My Images, BOOK GENERATORS: Kids Books/Non-Fiction/Coloring Books/Word Search/Trivia/Sudoku, Course w/ Free badge, user block — per frames F2/F8/F10), top bar (credits pill **[placeholder]**, Buy Credit Packs, Upgrade, theme switch), content container, mobile drawer, 404/error pages, theme persistence (dark variant = ASSUMPTION). Routes: `/dashboard`, `/books`, `/images`, `/create`, `/create/<flow>`, `/studio/[bookId]`, `/studio/[bookId]/cover`, `/research`, `/research/report/[id]`, `/account/*`, `/library`, `/dev/components`. Commit.

## Phase 3 — Dashboard / Overview
Frame evidence: name only → placeholder screen in observed language: welcome, quick-action cards (create flows), recent books, credits widget, getting-started checklist; empty/loading/error states. Marked placeholder in spec + gallery. Commit.

## Phase 4 — My Books (list/grid)
Grid + list views, search, sort/filter, tags, thumbnail cards (generated SVG cover placeholders), hover actions, rename/duplicate/archive/delete w/ confirm, multi-select bulk bar, pagination, empty states. `/books`. Commit.

## Phase 5 — Create flows (hub + one per flow)
`/create` hub (AI / blank / templates) per F9; per-generator screens + **"Create New Book" modal** (credit banner, fields, char counters, "Enhance Prompt with AI" ghost buttons, page-count→credit helper): kids story (frame-accurate F2 t0010), non-fiction + outline-review step, coloring, trivia, sudoku, math, journal-from-template, blank; word-search/color-by-number forms = design-language placeholders. Mock generation: task queue, streaming pages into Studio (timers), credit preview/validation. Commit per flow-group.

## Phase 6 — Studio (6a→6f, commit each)
- **6a shell:** top bar (back, title, Book ▾, Color|B&W toggle, undo/redo, Saved, shortcuts button, Export), left icon rail (Pages/Elements/Text/Images/Draw/Design/Accents/Characters), pages panel, canvas region, right contextual panel, bottom bar (Scroll|Spread|Grid, pager, zoom, Fit page, Safe area) — frame-accurate F1 t0005.
- **6b canvas:** react-konva (`ssr:false`), page scenes from typed JSON (`PageScene`/`SceneElement` union per stack-decision), zoom/pan, trim/bleed/margin/safe-area guides, snapping, selection + `Transformer` handles.
- **6c tools:** text edit (contentEditable overlay), image tools, AI-changes popover (instruction → mock Edit → side-by-side → Keep; Characters, History, Regenerate), Picture inspector (DPI note, crop/flip, trim sliders, X/Y/W/H).
- **6d filmstrip:** thumbnails via layer cache, reorder, add/duplicate/delete, per-page actions.
- **6e generation:** mock generate/regenerate, model picker **[placeholder]**, task tray, preview mode.
- **6f menus:** Book menu (setup/resize/front pages/versions/KDP text/export), Add page menu (puzzle types + blank/text/picture/coloring), Export dialog (5 scopes → pdf-lib mock PDF), KDP check computed from real rules (≥24 pages, margins, trim) with inline fix links.

## Phase 7 — Library / templates
`/images` (grid, folders, drag-drop upload progress, preview modal, tags, bulk), `/library` templates gallery w/ categories + preview → use-template. Commit.

## Phase 8 — Export / tasks
Export dialog wiring (pdf-lib assembled PDFs), task list w/ progress, downloads history, toasts/refunds (auto-refund on mock failure). Commit.

## Phase 9 — Account/credits/plans/settings
`/account` profile/preferences, `/account/billing` (plan, credits balance+history, cancel flow, billing history mock), `/account/credits`, plans/upgrade modal, usage-limit/locked states. Commit.

## Phase 10 — Marketing (OPTIONAL "ask first")
Prompt requires asking first; user asleep. **Decision:** build LAST as original KDP Studio marketing pages (landing/pricing/FAQ) only if Phases 1–9+11 are complete and verified — they pre-authorized "all phases"; otherwise documented as skipped-pending-OK in the morning report.

## Phase 11 — Full-app review
Navigation audit (zero dead controls → `/docs/wiring-matrix.md`), responsive audit, dark/light audit, axe+keyboard walkthrough, `/tests/visual` baselines per route, `/docs/known-issues.md`, final UNOBSERVED list, morning summary report in chat.

## Phase 12 — NOT started (explicitly requires separate instruction).

## Verification (end-to-end)
Playwright captures every route (1440×900 + 4 breakpoints) → `/docs/verification/`; side-by-side vs frames for Studio/create/shell/cover/research (video-tolerance caveat documented); axe scans; console-clean assertions; visual baselines; `npm run build` clean; dev server smoke test of every route + interaction.

## Key files
`src/app/**` routes above; `src/styles/tokens.ts`; `src/components/ui/*`; `src/components/shell/*`; `src/components/studio/*`; `src/mocks/*` (books, scenes, credits, tasks); `src/lib/*` (kdp-checks, pdf, scene model); `docs/screens/*.md` (spec per screen before build); `tests/visual`, `tests/e2e`; `scripts/capture.mjs`.
