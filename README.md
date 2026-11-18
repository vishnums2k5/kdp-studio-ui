# KDP Studio

An original web app that rebuilds the **layout, information architecture,
component behavior and user flows** of an AI book-creation tool for KDP
publishers — studied from publicly accessible pages and official tutorial
videos only. Original name, palette, fonts (DM Sans, OFL), icons (Lucide),
copy and sample art throughout; no reference assets are included.

**Stack:** Next.js (App Router) · TypeScript strict · Tailwind from design
tokens · Radix UI · Konva (react-konva) canvas · Zustand mock store · pdf-lib
· Playwright.

**Phases 1–9 + 11 complete** (tokens/components gallery, app shell, dashboard,
books, create flows, Studio editor with KDP compliance checks and AI-change
mocks, library, exports, account/billing with mock payments). Phase 12 (real
backend) intentionally not started.

## Run

```bash
npm install
npm run dev        # http://localhost:3100
npm run build && npm start
```

## Verify

```bash
node scripts/capture.mjs          # screenshot matrix → docs/verification/captures
node scripts/axe-scan.mjs         # a11y scans → docs/verification/axe-summary.json
```

Key docs: `docs/sitemap.md` (screen inventory + evidence status),
`docs/capture-checklist.md` (screenshots still needed from the account owner),
`docs/stack-decision.md` (canvas rationale), `docs/wiring-matrix.md` (zero
dead controls), `docs/known-issues.md`.
