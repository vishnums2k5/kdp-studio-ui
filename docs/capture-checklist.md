# Capture Checklist — Screenshots Needed From You (Phase 0)

> Place files exactly as specified: `/reference/<screen-name>/<NN>-<state>.png`.
> A screen is built only after its captures arrive (prompt §3B, rule 5, §8).

## Naming & capture rules (follow all)

1. **Path:** `/reference/<screen-name>/` — use the exact folder names in the tables below.
2. **File name:** two-digit index + state, e.g. `01-default.png`, `02-hover.png`, `03-modal-open.png`.
3. **Viewport:** browser window **1440 px wide**, 100% zoom (note it if different).
4. **DPR:** note your display's device pixel ratio (Retina = 2). If DPR 2, measurements get halved —
   add `dpr2` to the filename or note it in `/reference/NOTES.md`.
5. **Theme:** default theme only (if the app has a theme switch, capture light + dark where shown).
6. **Content:** a book/project with realistic sample data (a story or coloring book with 5+ pages),
   plus the truly-empty state where asked.
7. Also drop a `/reference/NOTES.md` with: viewport width, DPR, your plan tier, account language,
   and anything you think I should know per capture (1 line each).
8. **Priority order:** P0 first (unblocks Phases 2–3), then P1, then P2. Send captures in batches;
   each batch starts its screen's STUDY step immediately.

## P0 — Blocks the next phases

| Folder | Captures needed | States |
|---|---|---|
| `reference/app-shell/` | 01-sidebar-default · 02-sidebar-section-collapsed · 03-sidebar-user-menu-open · 04-topbar-credits-pill (unblur-friendly crop is fine) · 05-buy-credit-packs-dialog · 06-upgrade-dialog · 07-chat-fab-open-if-interactive | chrome shared by every screen |
| `reference/dashboard/` | 01-default · 02-empty-new-account · 03-loading-if-seen · 04-hover-on-a-card-or-link · 05-notifications-open-if-any · 06-768px · 07-390px-if-mobile-layout-exists | default, empty, hover, narrow |
| `reference/my-books/` | 01-default-grid · 02-list-view-if-exists · 03-hover-card-actions · 04-search-active · 05-filters-sort-open · 06-empty-no-books · 07-context-menu-or-kebab-open · 08-delete-confirm-modal · 09-multi-select-bulk-bar · 10-768px | every visible state of the list screen |
| `reference/my-images/` | 01-default · 02-empty · 03-upload-drag-over · 04-preview-open · 05-768px | sidebar screen seen in frames |
| `reference/create-entry/` | 01-create-book-surface · 02-template-tab-or-list · 03-blank-option | the "+ Create book" surface (AI / blank / templates) |
| `reference/create-kids-story/` | 01-modal-default · 02-modal-filled · 03-validation-error · 04-credit-preview-8-credits-banner · 05-generating-state · 06-pages-arriving-in-studio | one full AI flow end to end |
| `reference/studio-default/` | 01-default-story-book-open · 02-pages-panel-open · 03-elements-panel-open · 04-text-panel-open · 05-images-panel-open · 06-draw-panel-open · 07-design-panel-open · 08-accents-panel · 09-characters-panel · 10-grid-view · 11-spread-view · 12-scroll-view · 13-fit-page · 14-safe-area-guides-on · 15-element-selected-with-handles · 16-right-click-context-menu · 17-kdp-check-panel-with-flags · 18-kdp-check-clean · 19-color-vs-bw-toggle-both · 20-keyboard-shortcuts-overlay-if-any | the core screen, every panel + view |
| `reference/studio-menus/` | 01-book-menu-open · 02-add-page-menu-open · 03-export-dialog · 04-book-setup-modal · 05-saved-indicator-vs-saving-if-visible | top-bar menus + dialogs |

## P1 — Create flows, cover, research, editing

| Folder | Captures needed | Notes |
|---|---|---|
| `reference/create-coloring/` | form default · style picker open · credit estimate · generating | |
| `reference/create-nonfiction/` | form default · **outline review step** · generating-chapters | outline step is unique |
| `reference/create-trivia/` / `create-sudoku/` / `create-math/` / `create-journal/` / `create-blank/` | form default ×1 each · any special control open | tell me where Math + Color-by-number live in the sidebar |
| `reference/create-cover/` | entry-from-book · form-default · kids-character-toggle-on · generating · editor-default · details-tab · hide-spine-text-on · suggestion-chips-hover · full-pdf-download | |
| `reference/studio-image-edit/` | ai-changes-popover-open · edit-result-side-by-side · characters-picker · history-panel · regenerate-result | |
| `reference/research/` | 01-entry-form · 02-analyzing-state · 03-report-default · 04-report-scrolled (gaps/titles/keywords) · 05-saved-reports · 06-refresh-data-hover | |
| `reference/account-settings/` | 01-default · 02-credits-billing-tab · 03-plan-details · 04-cancel-confirm | |
| `reference/buy-credits/` | default · package-select-if-any | if different from top-bar dialog |
| `reference/onboarding/` | each step if you can re-enter it | else mark UNOBSERVED |

## P2 — Completes the matrix

| Folder | Captures needed |
|---|---|
| `reference/studio-states/` | loading/skeleton on open · error state if seen · long-book filmstrip · answers-per-page variant |
| `reference/studio-export-preview/` | export preview region zoomed (right side) |
| `reference/locks-upgrades/` | any plan-locked feature state with upgrade prompt (tell me your plan tier) |
| `reference/misc/` | cookie banner · any toast/notification · dark theme if exists · 1024/768 widths of any screen you use daily |

## What I will do when captures arrive

1. **STUDY:** measure every capture with a Python/PIL script (region px, gaps, text sizes via
   cap-height, colors sampled); write `/docs/screens/<screen>.md` per the spec template.
2. **QUESTIONS:** list OPEN QUESTIONS before building; stop if a needed state is missing.
3. **BUILD → CAPTURE → COMPARE:** Playwright screenshots at your exact viewport,
   `/docs/verification/<screen>.md` with side-by-side images, measurement table (±2 px @1440,
   exact font px, token-scale spacing), behavior checklist, responsive + a11y checks.
4. **TESTS + COMMIT + STOP:** baseline screenshot test, e2e for interactions, one commit,
   report, and wait for your "APPROVED".

## Video-frame evidence already in place (SECONDARY)

`/reference/from-tutorials/<slug>/` — frames from the 10 official public tutorial videos
(chapter-timestamped; see each folder's `README.md`). These cover the Studio, create flows,
cover editor and research report at ~1920×1080 but with compressed UI text — good for layout,
not for measuring exact px or colors. Your screenshots remain the primary source.
