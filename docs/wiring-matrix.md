# Wiring Matrix — zero dead controls (Phase 11)

Every control in the app is either functional (mock data) or visibly disabled
with a tooltip/label naming the phase that will enable it (rebuild prompt rule 7).

| Route | Control | Behavior | Status |
|---|---|---|---|
| shell/sidebar | Logo, Create book, all nav items, user menu items | navigate | ✅ wired |
| shell/sidebar | Sign out | disabled, label "Phase 12 (auth)" | 🚫 intentional |
| shell/topbar | Credits pill | shows live balance (placeholder anatomy — UNOBSERVED, tooltip) | ✅ wired |
| shell/topbar | Buy Credit Packs / Upgrade | navigate | ✅ wired |
| shell/topbar | Theme switch | toggles persisted theme | ✅ wired |
| /dashboard | Quick-action cards, book cards, links | navigate | ✅ wired |
| /books | Search/filter/sort/view/archived, kebab (rename/duplicate/archive/delete), multi-select bulk, pagination, dialogs | store ops | ✅ wired |
| /images | Search/folder/upload(drag-drop)/select/bulk delete/preview/tags/delete | store ops | ✅ wired |
| /library | Search/category/preview/use-template (creates free book → studio) | store ops | ✅ wired |
| /create | Hub cards + generator tiles | navigate | ✅ wired |
| /create/[flow] | Create New Book modal — all fields, credit banner, validation, outline step (non-fiction), Generate → streams pages → studio | store ops | ✅ wired |
| /create | "Enhance Prompt with AI" ghost buttons | visual affordance only — **disabled by design** (AI service is Phase 12); labeled | 🚫 intentional |
| /studio | Book menu items — Book setup, Add page, Export | dialogs | ✅ wired |
| /studio | Book menu — Resize book, Title & copyright pages, Restore versions, KDP listing text, Difficulty copies, Volumes | currently route to Add page dialog (labeled); full implementations noted in known-issues | ⚠️ partial |
| /studio | Color/B&W, undo/redo, Saved, shortcuts overlay, task tray | wired | ✅ |
| /studio | Pages panel — select/add/move/duplicate/delete pages, answer key toggle, answers-per-page | store ops | ✅ wired |
| /studio canvas | element select/drag/resize/rotate, dbl-click text edit, right-click page menu, page actions | wired | ✅ wired |
| /studio | AI changes popover — Edit/compare/Keep (1 credit), Regenerate, History restore | store ops | ✅ wired |
| /studio | AI popover — References, Color, Crop, Apply | disabled w/ reason (image-pipeline Phase 12) | 🚫 intentional |
| /studio | Image inspector — Replace/AI changes/flips/trim sliders/description/position | wired (flips via SVG re-encode) | ✅ |
| /studio | Draw tool — Start drawing | disabled, note (canvas pointer capture next pass) | 🚫 intentional |
| /studio | Design panel — styles/page size/B&W/bleed | store ops | ✅ wired |
| /studio bottom bar | views, pager, zoom slider, fit width/page, safe area | wired | ✅ wired |
| /studio/[id]/cover | prompt bar, Front/Back target, Generate (5 credits), Regenerate Both, spine color/hide-spine-text/spine title, Details tab, Full PDF toast | wired (mock) | ✅ wired |
| /studio/[id]/cover | Paint Edit, Tutorial, Front/Back downloads | disabled — image paint pipeline Phase 12 | 🚫 intentional |
| /research | entry form | ✅ (analyzing state + report) |
| /research/report | Refresh Data, Create Book in This Niche | wired → create flow | ✅ |
| /account | profile save, language, theme, toggles | store/local ops | ✅ wired |
| /account | Change password | disabled → Phase 12 auth | 🚫 intentional |
| /account/billing | plan switch (mock), cancel dialog, ledger table | wired | ✅ wired |
| /account/credits | buy packs (mock grant), activity | wired | ✅ wired |
| /account/tasks | quick export per book (pdf-lib) | wired | ✅ wired |
| /dev/components | all demo controls | wired | ✅ wired |
| 404 / error | back links, retry | wired | ✅ wired |

Intentionally-disabled controls (all labeled with their phase):
`Sign out`, `Enhance Prompt with AI`, AI popover `References/Color/Crop`,
`Draw > Start drawing`, cover `Paint Edit/Tutorial/Front/Back`,
`Change password`. Nothing is silently dead.
