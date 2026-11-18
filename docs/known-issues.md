# Known Issues (overnight build, morning review)

## Deliberate placeholders (await your captures — see docs/capture-checklist.md)
1. **Dashboard layout** is a placeholder — the reference dashboard never appears in official videos.
2. **Top-bar credits pill anatomy** UNOBSERVED (blurred in every video) — built as a balance pill with tooltip.
3. **Word-search & color-by-number forms** are placeholder fields (pricing lists them; no observed form).
4. **Dark theme** = ASSUMPTION (reference shows light only) — persisted switch in top bar + preferences.
5. **All exact px measurements** await your screenshots at 1440 (±2 px gate applies then). Frame-derived proportions were used meanwhile.

## Functional gaps (labeled in UI)
6. **Enhance Prompt with AI** buttons and AI popover References/Color/Crop — Phase 12 (AI providers).
7. **Draw tool** pointer-capture freehand — next canvas pass.
8. **Book menu advanced items** (Resize book, Restore versions, KDP listing text, Difficulty copies, Volumes) — open Add page dialog for now; noted in wiring matrix.
9. **Sign out / Change password / real auth** — Phase 12.
10. **Payments** are mocked end-to-end (plan switch, credit packs, cancel) — Stripe noted in UI copy.
11. **Export PDFs** assemble text + rasterized SVG art client-side (pdf-lib); the print-grade vector pipeline is Phase 12.
12. **Studio 100+ page books** — canvas stages are not virtualized; fine for the mock books (≤26 pages), may need windowing for long journals.
13. **Downloads history** uses the credits ledger as a proxy (mock); real store in Phase 12.

## Fixed during the run (documented in docs/verification/*)
- react-konva pinned to 19.2.4 (Next 15.5 vendors React 19.2.0-canary).
- konva `canvas`/`jsdom` externals shim for webpack.
- Seeded puzzle grid removed a hydration mismatch.
- Zustand derived-selector infinite loop (filter moved to useMemo).
- 9 a11y violations fixed → **0 axe violations** across 12 routes (wcag2a/2aa/21a/21aa).

## Verification status
- Production build: clean (TS strict).
- 176 captures across 1440/1280/1024/768/390, console-clean (the only flagged items are the expected 404 statuses on the not-found route).
- axe scans: 0 violations (docs/verification/axe-summary.json).
- Side-by-side frame comparisons: docs/verification/*.md; visual baselines under docs/verification/captures/.
