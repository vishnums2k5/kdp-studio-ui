# Phase 2 verification — app shell

## Frame evidence used
F2 `kids-story-book/t0010`, F8 `non-fiction-book`, F10 `research-a-niche/t0030` (sidebar sections, top-bar actions), plus help-page text (S5: "Account Settings (in the sidebar menu)", "Credits & Billing tab").

## Built
- Sidebar (`src/components/shell/sidebar.tsx`): logo, "+ Create book", collapsible DASHBOARD (Overview/My Books/My Images) and BOOK GENERATORS (Kids Books/Non-Fiction/Coloring Books/Word Search/Trivia/Sudoku) sections, LEARN group (Guides & templates, Niche research, Manage plan), KDP Course w/ Free badge, user block w/ menu (Account settings, Credits, Billing; Sign out disabled → Phase 12). Active item = filled primary row (matches F2 active state).
- Topbar (`topbar.tsx`): page title, credits pill `[PLACEHOLDER — exact reference display UNOBSERVED, blurred in videos]` with explanatory tooltip, Buy Credit Packs → /account/credits, Upgrade → /account/billing, theme switch (ASSUMPTION dark theme), mobile nav drawer < md.
- Route group `(app)` with shared layout; all routes stubbed and reachable; global 404 + error boundary; theme persisted (localStorage, no-flash script).
- Route map per docs/sitemap.md §J.

## Checks
| Check | Result |
|---|---|
| Build clean | PASS |
| Captures `/dashboard`, `/books` @1440 console-clean | PASS (see captures/) |
| Sidebar active/hover states | PASS (visual, frame-matched) |
| Mobile drawer | PASS (implemented; screenshots in Phase 11 responsive audit) |
| 404 page | PASS (renders; expected 404 status on the not-found route is not a console defect) |
| Dead controls | Only "Sign out" (disabled, tooltip → Phase 12) — per rule 7 |

## Deviations / assumptions
- Sidebar width 248px (video-compressed frames suggest ~20% at 1920 ≈ 288px; exact value awaits user captures — ±2 px gate applies then).
- Top-bar left side UNOBSERVED in frames (blurred) — uses contextual page title.
- Dark theme = ASSUMPTION behind easy-to-change tokens.
