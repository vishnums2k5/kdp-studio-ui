# UI REBUILD PROMPT: OBSERVE, SPECIFY, BUILD, COMPARE, APPROVE (PASTE INTO ZCODE / GLM)

## 0. ROLE

You are a senior front-end engineer and design-systems engineer. You are rebuilding the **user interface and interaction design** of a reference product (LitPal, litpal.ai, an AI tool for creating KDP books) as an original web app called "KDP Studio" (working name). The reference is studied for **layout, information architecture, spacing rhythm, component behavior and user flows**. The result must feel like the same kind of tool, but it is built from scratch.

## 1. NON-NEGOTIABLE RULES

1. **Look first, build second.** Before you build any screen you must study the reference for that screen (Section 3) and write a screen spec. No spec, no code.
2. **One screen or feature at a time.** Do not start the next one until the current one passes its verification gate (Section 6) and I reply "APPROVED".
3. **Original assets only.** Do NOT copy the reference's logo, name, product copy, illustrations, icon artwork, photos, fonts (unless open-licensed), CSS or JavaScript, and do not download or reuse its files. Use your own name "KDP Studio", original icons (an open-licensed set such as Lucide or Phosphor is fine), original copy, original sample images, and your own color palette (see Section 4). Matching layout and behavior is the goal. Copying branding or content is not.
4. **Do not bypass anything.** Never work around a login, paywall, plan limit or credit limit. Never use my credentials, cookies or tokens in code, and never ask me to paste them into the chat. Respect robots.txt and the site's terms. If automated browsing is blocked or the page needs login, say so and use my screenshots instead (Section 3).
5. **Never invent what you could not see.** Anything you did not observe is marked `UNOBSERVED` in the spec. You build a clearly labeled placeholder or a disabled control for it and list it under OPEN QUESTIONS for me. A guess is allowed only when labeled `ASSUMPTION` and built behind a setting that is easy to change.
6. **Evidence or it did not happen.** Never say a screen matches unless you show side-by-side screenshots and the measured comparison table from the gate.
7. **No dead controls.** Every button, tab, menu item, toggle and link either works (with mock data) or is visibly disabled with a tooltip saying which phase will make it work.

## 2. WHAT "ACCURATE" MEANS HERE

**Must match the reference (within the tolerances in Section 6):**
- Page structure: header, sidebar, content regions, panels, modals, drawers, and where they sit.
- Dimensions: sidebar width, top bar height, content max width, card sizes, grid columns and gutters, spacing between elements, border radii, icon sizes, row heights.
- Navigation: menu order and grouping, active/hover/collapsed states, breadcrumbs, back behavior.
- Component behavior: what opens on click, how modals close, how dropdowns position, how toasts appear and disappear, tab behavior, empty states, loading states, error states.
- Typography scale and rhythm (sizes, weights, line heights, hierarchy), using an open-licensed font that looks similar.
- Responsive behavior at each breakpoint.
- Motion: durations and easing of transitions, measured from the reference where visible.

**Must be original (do not copy):**
- Brand name, logo, wording, marketing text, illustrations, sample images, icon artwork.
- Exact brand color values: choose a palette of your own with similar roles (primary, surface, text, border, accent, success, warning, danger) and similar contrast. I may later ask you to tune it.
- Source code.

## 3. HOW TO STUDY THE REFERENCE (OBSERVATION PROTOCOL)

The dashboard and most features need a logged-in account, and my account is on the free plan, so some features are limited. Use these sources, in this order:

**A. Public pages (no login).** If you have a browser tool, open the public pages (landing, pricing, features, tutorials, blog, help) and check `/robots.txt` first. If a page is disallowed or blocked for automation, do not retry or work around it; tell me and move to B.

**B. My screenshots and screen recordings (primary source for the app itself).** I will place them in `/reference/<screen-name>/` as `01-default.png`, `02-hover.png`, `03-modal.png`, etc. at a known browser width (I will note it, default 1440 px wide, 100% zoom). If a screen needs more states, ask me exactly which (empty, loading, error, hover, focus, modal open, dropdown open, small width). Use the official tutorial videos' frames as supporting evidence where I provide them.

**C. Measurement from screenshots.** From each reference image extract measurements with a script (Python/PIL or Playwright-less image tooling) and record them in the spec: pixel sizes of regions, distances between elements, text sizes (cap-height or x-height derived), colors sampled at known points. State the measurement method and the margin of error. For a screenshot taken at device pixel ratio 2, halve the numbers.

**D. Limits I could not see.** If a feature is locked by my plan, record `LOCKED (not observed)`, do not guess its screen, and add it to OPEN QUESTIONS.

### Screen spec template (write `/docs/screens/<screen>.md` BEFORE coding)
- Purpose of the screen and how the user gets there.
- Source images used (file names) and viewport width.
- Layout map: regions with measured width, height, padding, gap.
- Component inventory: each component, its variants and states (default, hover, focus, active, disabled, loading, error, empty, selected).
- Interaction list: every click/hover/keyboard action and its result, including what happens to the URL.
- Content model: what data appears, field types, truncation rules, sort/filter options.
- Responsive notes per breakpoint (1440, 1280, 1024, 768, 390).
- Motion notes: transition type and duration where visible.
- Accessibility notes: roles, labels, focus order, contrast.
- UNOBSERVED / ASSUMPTION list.

## 4. DESIGN TOKENS (BUILT ONCE, USED EVERYWHERE)

Create `/src/styles/tokens.ts` (or CSS variables) with: color roles (light and dark themes), type scale, font families (open-licensed), spacing scale (4-pt base unless the measurements say otherwise), radii, shadows, border widths, z-index layers, breakpoints, motion durations/easings, icon sizes. No component may use a hard-coded color, size or font outside the tokens. Build a **component gallery page** (`/dev/components`) that renders every component in every state at all themes; this page is what we compare against the spec.

## 5. STACK AND STRUCTURE

- Next.js (App Router) + TypeScript strict + Tailwind (configured from tokens) + a headless accessible component base (Radix UI or similar). Storybook optional; the gallery page is mandatory.
- Phase 1-9 use **mock data and a fake API layer** (typed, swappable) so the UI can be finished before the backend exists. Folder structure: `/src/app`, `/src/components/ui`, `/src/components/<feature>`, `/src/mocks`, `/src/lib`, `/docs/screens`, `/reference` (my screenshots, git-ignored if large), `/tests/visual`, `/tests/e2e`.
- Every screen is a route with a stable URL, deep-linkable, with working back/forward.
- Playwright installed from the start for screenshots and e2e.

## 6. THE PER-SCREEN LOOP AND VERIFICATION GATE

For every screen or feature:

**A. STUDY:** read my screenshots for the screen. Write the screen spec (Section 3 template).
**B. QUESTIONS:** list OPEN QUESTIONS and anything you need from me (more states, widths). If anything blocks building, STOP and ask now.
**C. BUILD:** implement the screen with tokens and components; add to the component gallery anything new.
**D. CAPTURE:** with Playwright, screenshot your build at the same viewport as my reference, same theme, similar content length.
**E. COMPARE:** produce `/docs/verification/<screen>.md` containing:
  1. Side-by-side images (reference | yours) for every state.
  2. A **measurement table**: for each key element (sidebar width, top bar height, card width/height, gaps, paddings, radii, font sizes, icon sizes) the reference value, your value, delta. Pass tolerance: **layout dimensions within ±2 px at 1440 wide; font sizes exact in px; spacing on the token scale**. Anything outside tolerance is fixed or justified.
  3. A **behavior checklist**: each interaction from the spec with PASS/FAIL and how it was tested.
  4. A **responsive check**: screenshots at 1280, 1024, 768, 390 with notes on how the reference behaves (if observed) or `UNOBSERVED`.
  5. An **accessibility check**: keyboard-only walkthrough, visible focus, contrast ratios, axe scan results.
  6. Console clean (no errors or warnings), no layout shift, Lighthouse performance and accessibility scores.
**F. FIX LOOP:** repeat D-E until every row passes.
**G. TESTS:** add a Playwright test with a stored baseline screenshot for the screen (to catch future regressions) and e2e tests for each interaction.
**H. COMMIT:** one commit per screen.
**I. STOP:** show me the report and wait for "APPROVED" or fixes. Do not continue otherwise.

**Definition of done for any screen:** matches the measured reference within tolerance, every state and interaction works with mock data, responsive, keyboard accessible, themed (light and dark), tested, documented, and approved by me.

## 7. PHASES

### PHASE 0. INVENTORY AND CAPTURE PLAN (NO CODE)
1. Check `/robots.txt` of the reference and note what automated tools may open. Record which public pages you could view.
2. From the public pages and the screenshots I have provided so far, produce `/docs/sitemap.md`: every screen, modal, drawer and flow you know about, its URL pattern, whether it was OBSERVED or LOCKED, and which of my screenshots covers it.
3. Produce `/docs/capture-checklist.md`: the exact list of screenshots and states I still need to give you, per screen (default, hover, focus, empty, loading, error, modal, small width), with file-naming rules.
4. Choose and justify the front-end stack and the editor/canvas approach for the book Studio (Konva, Fabric, PixiJS or SVG scene graph). The Studio is the hardest screen, so decide this early.
5. STOP for my approval.

### PHASE 1. TOKENS AND FOUNDATION COMPONENTS
Extract measurements for the visible design language (type scale, spacing rhythm, radii, shadows, colors by role). Build the tokens and every base component with all states: buttons (primary, secondary, ghost, danger, icon, loading), inputs, textarea, select, combobox, checkbox, radio, switch, slider, tabs, tooltip, popover, dropdown menu, context menu, dialog/modal, drawer, toast, badge, avatar, card, table, pagination, progress bar, spinner, skeleton, empty state, banner. Build `/dev/components`. Gate per Section 6 (compared against the components visible in my screenshots).

### PHASE 2. APP SHELL
Left sidebar (width, grouping, icons, active/hover states, collapse to icon-only, tooltips when collapsed, mobile drawer), top bar (title/breadcrumb, credits indicator, theme switch, account menu), content container, notification area, route transitions, 404 and error pages, theme persistence. Gate.

### PHASE 3. DASHBOARD / HOME
Study the dashboard layout from my screenshots. Build every region: welcome/summary area, quick-action cards, recent projects, usage/credits widgets, shortcuts, announcements. Mock data. Include empty (new user), loading and error states. Gate.

### PHASE 4. PROJECTS (LIST, CARDS, MANAGEMENT)
Grid and list views, search, sort, filters, tags/folders if observed, thumbnails, project card hover actions, rename, duplicate, archive, delete with confirm, multi-select and bulk actions, pagination or infinite scroll, empty state. Gate.

### PHASE 5. CREATE FLOWS (ONE FLOW PER GATE)
One sub-phase per creation flow observed (for example: new book wizard, AI coloring book, AI story book, AI cover, AI image, puzzle/activity). For each: the stepper or form layout, field types, option cards, presets, prompt box with helpers, cost/credit preview, validation messages, review step, generating state, results state. Mock the generation. One screen spec and one gate per flow.

### PHASE 6. THE STUDIO (EDITOR): SPLIT INTO SUB-PHASES
Each sub-phase has its own spec, build, compare and gate:
- 6a. Studio shell: top menus, left tool sidebar, contextual toolbar region, canvas area, right page filmstrip, bottom status bar, floating action bar. All layout and states, no canvas logic yet.
- 6b. Canvas: page rendering, zoom/pan, guides (trim, bleed, margins, spine), rulers, snapping, selection and transform handles.
- 6c. Text tools, image tools and the contextual image toolbar.
- 6d. Page filmstrip: thumbnails, reorder, add/duplicate/delete, odd/even labeling.
- 6e. Generation controls: generate/regenerate/edit screens, model picker, background tasks tray, preview mode.
- 6f. Menus: every item working or disabled with a reason.
For the deeper functional behavior of the Studio use the separate Studio roadmap document if I provide it; this prompt governs matching the look and interaction layout.

### PHASE 7. LIBRARY / ASSETS / TEMPLATES
Asset grid, folders, upload with drag and drop and progress, preview modal, tags, search, bulk actions; templates gallery with categories and preview. Gate.

### PHASE 8. EXPORT / DOWNLOAD / TASKS
Export dialogs and options, task list with progress, downloads history, notifications. Gate.

### PHASE 9. ACCOUNT, CREDITS, PLANS, SETTINGS
Profile, security, preferences, credits balance and history, plans/pricing page, upgrade modal, billing history (mock; no real payments in this phase), usage limits UI (locked-feature states with upgrade prompts, built as UI only). Gate.

### PHASE 10. MARKETING AND PUBLIC PAGES (OPTIONAL, ASK ME FIRST)
Landing, pricing, features, FAQ, tutorials. Original copy and imagery only. Gate.

### PHASE 11. FULL-APP REVIEW
Navigation audit (every link works), responsive audit at all breakpoints, dark/light audit, accessibility audit, performance audit, visual regression baseline for every screen, wiring matrix `/docs/wiring-matrix.md` showing zero dead controls, `/docs/known-issues.md`, and a list of every UNOBSERVED item still open.

### PHASE 12. REAL BACKEND INTEGRATION (SEPARATE PROMPTS LATER)
Replace the mock API layer with real services phase by phase (auth, billing, storage, AI providers, queue). Do not start until I say so.

## 8. REQUESTS TO ME

When you reach a screen where my screenshots do not cover a needed state, ask me with an exact list, for example: "Dashboard: need empty state (new account), hover on a project card, user menu open, 768 px wide." Do not guess.

## 9. START NOW

Do Phase 0 only. List what you can and cannot access from the reference, check robots.txt, write the sitemap and the capture checklist, and STOP. Do not write any UI code yet.
