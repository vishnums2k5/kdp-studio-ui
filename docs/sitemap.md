# LitPal Reference — Sitemap & Screen Inventory (Phase 0)

> Working name for the rebuild: **KDP Studio**. This document inventories every screen, modal,
> drawer and flow we know about in the reference product (litpal.ai), its evidence status, and
> which capture covers it. Nothing here is copied content — it is a structural map for matching
> layout and interaction design only.

## Status legend

| Status | Meaning |
|---|---|
| `OBSERVED (public)` | Public page fetched 2026-11-19; structure known from its text. |
| `SECONDARY (text)` | UI described by official tutorial-page text. |
| `SECONDARY (frames)` | UI visible in frames from the official public tutorial videos — `reference/from-tutorials/frames/<slug>/t<seconds>.png` @1920×1080. Good for layout/flow; exact px/colors still need your screenshots (video compression). |
| `UNOBSERVED` | Login-gated and robots-disallowed; no evidence yet. Needs your screenshots. **No screen spec or code until provided.** |
| `LOCKED (not observed)` | Behind a plan limit even for the account owner. |
| `ASSUMPTION` | Explicit, labeled guess; built behind an easy-to-change setting (never silently). |

Frame slugs: F1 `book-editor-tour` · F2 `kids-story-book` · F3 `matching-book-cover` ·
F4 `edit-pictures-with-ai` · F5 `trivia-book` · F6 `sudoku-book` · F7 `math-workbook` ·
F8 `non-fiction-book` · F9 `free-journal-template` · F10 `research-a-niche`.

## Access rules established (robots.txt, checked 2026-11-19)

- `User-agent: *` → `Allow: /`, plus `Sitemap: https://litpal.ai/sitemap.xml`.
- **Disallowed for automation:** `/api/`, `/admin`, `/dashboard`, `/onboarding`, `/trial-offer`,
  `/billing`, `/buy-credits`, `/settings`, `/account`, `/signout`, `/auth/*`, any `/my-*` path,
  `/kdp-cover-editor`, `/cover-editor/`, `/book-covers/`, `/chat-to-book/`,
  `/litpal-research/report/`.
- Consequence (per rebuild prompt §3A, rule 4): **every in-app screen comes from your
  screenshots in `/reference/`**; automation is used only for public pages and official videos.

## Evidence sources

| # | Source | Where |
|---|---|---|
| S1–S2 | robots.txt, sitemap.xml | below |
| S3 | Landing `/` (hero, how-it-works, 6 features, pricing, FAQ) | below |
| S4 | `/tutorials` + 10 lesson pages (workflow + UI text, YouTube IDs) | below |
| S5 | `/help` (credits model, sidebar/billing evidence) | below |
| S6 | `/ai-coloring-book-generator` (flow, print specs) | below |
| S7 | `/guides/how-to-make-a-coloring-book` | below |
| F1–F10 | Official public tutorial videos → 243 frames | `reference/from-tutorials/frames/` |

## A. App shell (SECONDARY (frames) — from F2/F8/F10; pixel values from your screenshots)

- **Left sidebar** (light surface, purple accents):
  - Logo + wordmark (top).
  - Primary action: large **"+ Create book"** button (filled purple, full width).
  - Section **DASHBOARD** (label, collapsible chevron): **Overview** (home icon), **My Books**
    (list icon), **My Images** (image icon).
  - Section **BOOK GENERATORS** (label, collapsible): **Kids Books**, **Non-Fiction**,
    **Coloring Books**, **Word Search**, **Trivia**, **Sudoku** — each with its own icon; active
    item = filled dark-purple row with white text (F2 t0010).
  - **LitPal Course** item with green **Free** badge + external-link icon.
  - Bottom: user block (avatar/name, blurred in videos) + `···` overflow menu.
- **Top bar:** right side holds a credits pill (blurred in videos — exact form UNOBSERVED),
  **"+ Buy Credit Packs"** (secondary button), **"⚡ Upgrade"** (primary purple button).
- **Floating chat FAB** bottom-right (purple circle) — support/feedback widget (F10).
- No dark theme observed anywhere (marketing + app frames are light). Dark theme: UNOBSERVED.

## B. Public / marketing pages (OBSERVED (public))

| # | Screen | URL | Notes |
|---|---|---|---|
| B1 | Landing | `/` | Header nav (Tutorials, Help, Pricing, Get started); hero; trust bar (KDP/B&N/IngramSpark/Lulu); 3-step how-it-works; 6 feature cards; pricing Basic $20 / Standard $33.33 / Premium $66.67 / Unlimited $133.33 (annual; 30-day guarantee; Stripe); FAQ ×7; CTA; footer. |
| B2 | Tutorials index | `/tutorials` | 10 lesson cards + 2 courses (sign-in required). |
| B3 | Tutorial lesson | `/tutorials/<slug>` ×10 | Breadcrumb, video w/ chapter links, steps, "Good to know", next lesson. |
| B4 | Help & Support | `/help` | Contact block, "What costs credits?", FAQ ×3. |
| B5 | Coloring generator | `/ai-coloring-book-generator` | 3-step flow, samples, print specs (8.5×8.5 in, 0.125 in bleed, blank back page), credit costs, FAQ. |
| B6 | Guide article | `/guides/how-to-make-a-coloring-book` | 6-step guide. |
| B7 | Affiliates | `/affiliates` | JS-rendered; title only observed. |
| B8 | Legal ×11 | `/terms-of-service`, `/privacy-policy`, `/refund-policy`, `/cookie-policy`, `/ai-data-notice`, `/subprocessors`, `/acceptable-use`, `/affiliate-disclosure`, `/ip-policy`, `/data-processing-addendum`, `/unlimited-terms` | Text-only. |

Marketing pages are Phase 10 (OPTIONAL — ask first).

## C. Auth & onboarding (UNOBSERVED — robots-disallowed)

| # | Screen | URL | Evidence |
|---|---|---|---|
| C1 | Sign up | `/auth/signup` | Referenced publicly as "Get started". Layout UNOBSERVED. |
| C2 | Log in | `/auth/login` (ASSUMPTION) | UNOBSERVED. |
| C3 | Reset/verify flows | `/auth/reset-password`, `/auth/update-password`, `/auth/signup-submitted`, `/auth/email-verification`, `/auth/callback` | Names from robots.txt only. |
| C4 | Onboarding wizard | `/onboarding` | Name only. Steps UNOBSERVED. |
| C5 | Trial offer | `/trial-offer` | Name only (3-day trial w/ 30 credits known from S6). |
| C6 | Sign out | `/signout` | Action route. |

## D. App core screens

| # | Screen | URL | Status | Evidence |
|---|---|---|---|---|
| D1 | **Dashboard / Overview** | `/dashboard` | **UNOBSERVED** (layout) | Route robots-disallowed; sidebar names it "Overview". "Track your usage from your dashboard" (S3). Needs your captures. |
| D2 | **My Books / Library** | `/my-*` (exact path UNOBSERVED) | **UNOBSERVED** (layout) | Sidebar item "My Books" (F2/F8/F10). Cover editor's back link reads "← Library" (F3 t0080) — same list under another label, ASSUMPTION to verify. |
| D3 | **My Images** (asset library) | route UNOBSERVED | **UNOBSERVED** (layout) | Sidebar item "My Images" (F2/F8/F10). |
| D4 | Buy Credit Packs | modal or `/buy-credits` | **UNOBSERVED** | Top-bar button seen in F2/F10; its dialog UNOBSERVED. |
| D5 | Upgrade / plans | `/billing` etc. | **UNOBSERVED** | Top-bar "Upgrade" button; help FAQ says Account Settings → "Credits & Billing" tab at `/billing` with Cancel Subscription (S5). |
| D6 | Settings / Account | `/settings`, `/account` | **UNOBSERVED** | Names from robots.txt + S5 ("Account Settings (in the sidebar menu)"). |
| D7 | Niche research entry | route UNOBSERVED; report at `/litpal-research/report/…` | **SECONDARY (frames)** | See H4. |
| D8 | Chat-to-book | `/chat-to-book` | **UNOBSERVED** | Name from robots.txt only. OPEN QUESTION: what is this screen? |

## E. Generator screens (one per book type) — SECONDARY (frames)

Each generator is its own sidebar screen with a list of its books + a **"Create New Book"
modal** over the page (F2 t0010):

| # | Generator | Modal fields observed | CTA | Frames |
|---|---|---|---|---|
| E1 | Kids Books | credit banner ("8 credits"; "Base: 8 credits (10 pages) + 1 credit per additional page"), Book Title (input, focus ring, helper "✨ Enhance Prompt with AI", counter "0 / 200 characters (KDP limit)"), Story Description (textarea, "✨ Enhance Prompt with AI", "0/3000 characters"), Number of Pages (10–30) | "Generate Kids Book" (below fold) | F2 |
| E2 | Non-Fiction | template, title, description, style, audience, chapter length, # chapters → **outline review** → "Confirm and Generate Book" | "Generate Book" | F8 |
| E3 | Coloring Books | theme, style (12+ presets + custom), credit estimate | generate | S6 (page); frames UNOBSERVED (not in tutorials) |
| E4 | Word Search | UNOBSERVED (form) | — | — |
| E5 | Trivia | title, theme, page count, questions per page | "Create Trivia Book" | F5 (text) |
| E6 | Sudoku | title, difficulty, puzzles per page, page count | "Create Sudoku Book" | F6 (text) |
| E7 | Math workbook | (from S4-L7) title, grade, topics, questions/page, picture pages, cover, certificate — sidebar item for it NOT seen (F2/F10 sidebar has 6 generators; math may live inside another screen) | "Create workbook" | F7 (text) |
| E8 | Color-by-number | UNOBSERVED (pricing lists it; no sidebar item seen) | — | — |
| E9 | Journal/planner from template | title, trim size, page count | "Create" | F9 (text) |
| E10 | Blank book | UNOBSERVED | create | F9 (text) |

"Create book" (sidebar button) opens a hub offering **generate with AI / start blank / use a
template** (F9 text); hub layout UNOBSERVED.

## F. The Studio (book editor) — SECONDARY (frames), strongest evidence (F1 t0005, F4 t0010)

One screen, five regions (layout map; px values to be measured from your captures):

- **Top bar:** `←` back + book title (left) · **Book ▾** dropdown · **Color | B&W** segmented
  toggle · right: Undo ↶ · Redo ↷ · **"☁ Saved"** indicator · keyboard-shortcuts button ·
  **Export** (primary blue button).
- **Left icon rail** (~72–100 px wide, icon + 11 px label, active = blue-tinted tile):
  **Pages** (layers), **Elements** (shapes), **Text** (T), **Images** (photo), **Draw** (pen),
  divider, **Design** (palette), **Accents** (sparkle), divider, **Characters** (people).
- **Pages panel** (second column, opens when Pages is active): "N pages" header + primary
  **"+ Add page"** button; scrollable page cards (thumbnail + index + name/type, `···` menu,
  selected = blue border); **ANSWER KEY** section (toggle, "1 answer page (page 5)",
  "Answers per page" select); **LEFT OUT OF THE BOOK** section ("6 front pages off" +
  **Book setup** link).
- **Canvas** (blue-gray surface): vertical **Scroll** of page cards by default; above each page
  a label "Page N · <type>" + hover actions (move-up, move-down, duplicate, delete, replace,
  `···`); page = white sheet w/ rounded corners; element selection = blue outline + handles +
  corner "Replace" chip (F4).
- **Contextual popover — "AI changes · picture on page N"** (draggable, grip dots, thumbnail,
  status line "Checking this picture against story page N of the original book…"): textarea
  "Describe what to change…" + purple **Edit** button; chips **References** (📎), **Characters**;
  row 2: **Regenerate · Color · History · Crop · Replace** (disabled state = greyed).
- **Right panel (contextual inspector):** default = book summary ("Woodland Activity Sampler",
  "5 pages · 8.5 × 8.5 in · standard · color", hint text) + **KDP check card** (amber header
  "2 things to fix before KDP", checklist rows: green ✓ pass / amber ⚠ fix with inline action
  link "Add 19 notes pages at the end" / info rows). With an element selected = element
  inspector ("Picture": green DPI note, buttons AI changes / Replace / Crop / Flip / Flip
  vertical, checkbox "Fill the frame", Trim sliders ×4, "Description (for accessibility)",
  Position X/Y/W/H inputs with `in` units).
- **Bottom status bar:** view switcher **Scroll | Spread | Grid** (segmented, dark active) ·
  `‹ Page 1 of 5 ›` pager · zoom `− 51% + · Fit width` · **Fit page** (active pill) ·
  **Safe area** toggle (pencil icon).
- **Book menu** (from F1 text): Book setup · Design the cover · resize · title/copyright pages ·
  restore versions · KDP listing text · difficulty copies · volumes · free copy.
- **Add page menu:** puzzle types + blank, text, picture, coloring.
- **Export dialog:** full print-ready book / puzzles only / answer key only / selected pages /
  images → "Download PDF". Dialog layout UNOBSERVED (needs capture).
- **Generating state:** book opens immediately; pages stream in one at a time (F2).
- Keyboard button in top bar implies a shortcuts overlay — UNOBSERVED.

## G. Cover editor — SECONDARY (frames) (F3 t0080)

- **Top bar:** `← Library` (back) · title + author ("by Lantern Lane Press") · **"✎ Editing"**
  blue pill · right: yellow **Tutorial** button, **⬇ Front**, **⬇ Back** (secondary), **Full PDF**
  (primary purple).
- **Canvas:** full spread preview — BACK | purple spine (vertical text) | FRONT, with "BACK"/
  "FRONT" corner labels.
- **Suggestion chips** above prompt bar: "Make it more dramatic", "Darken the background",
  "Make colors more vibrant", "Add more detail to the art", … (horizontally scrollable).
- **AI prompt bar:** textarea "Describe changes to the front cover… e.g. 'make it more
  dramatic'"; **Front/Back** segmented target toggle; ✨, 📎 attach, ➤ send; helper "Drop or
  paste images · Shift+Enter for a new line".
- **Right panel "Cover settings":** tabs **Edit | Details**; sections FRONT COVER (**Paint
  Edit** + **Regenerate**), BACK COVER (same), BOTH COVERS (**Regenerate Both**), ADD IMAGE
  (helper + **+ Front** / **+ Back**), SPINE (color swatch, "Hide Spine Text" toggle, "Spine
  title (optional)" input).
- Entry: from inside a book via Book setup → "Design the cover" (form pre-filled w/ title,
  trim size, page count; "Kids Book Character" toggle) → "Generate Cover" (F3 text).
- Spine swatch value observed `#7C3AED` → purple primary (role reference only; we pick our own).

## H. Research report — SECONDARY (frames) (F10 t0030)

- Page: `← Back to Research`; report card: niche title (large), chip `<book type>`, date,
  purple potential pill ("Good Potential"), "🕐 Last updated …", **↻ Refresh Data** button;
  right: **circular score gauge** (70 / Strong, green) + **"✓ Profitable"** pill.
- **Stat card row ×4:** Avg BSR (+sub "Low Demand"), Avg Price (+ "$5–$10 range"), Avg Reviews
  (+ "Moderate Competition"), Est. Daily Royalty (+ "~$785/mo per competitor").
- **Competitors table:** Title (w/ thumbnail), BSR ↑ sortable, Est. Daily Sales, Price, Est.
  Daily Royalty (green), Rating, Reviews.
- Later sections (opportunity gaps, title ideas, keywords, Saved Reports) per S4-L10 text;
  exact layouts in frames t0035–t0065.

## I. Credits & billing rules (S5 help)

- Creating books/covers, AI pages, chapter regeneration cost credits; amount shown before
  start. Picture edit/regenerate/Color This Page/title redraw = 1 credit each; cover both-side
  regen = 2 credits. Failed AI actions auto-refund. Manual edits free. Unlimited has
  hourly/daily limits.
- Plans: Basic 720 credits/yr · Standard 1800 · Premium 4800 · Unlimited. 3-day trial: 30
  credits. Kids book: 8 credits base (10 pages) + 1/page (F2).

## J. KDP Studio route proposal (our rebuild — stable, deep-linkable)

| Our route | Mirrors |
|---|---|
| `/dashboard` | D1 |
| `/books` (list; grid/list views) | D2 |
| `/images` (asset library) | D3 |
| `/create` hub → `/create/<flow>` | E0/E1–E10 |
| `/studio/<bookId>` | F |
| `/studio/<bookId>/cover` | G |
| `/research` + `/research/report/<id>` | D7/H |
| `/export/<bookId>` + tasks | Phase 8 |
| `/account/*` (profile, billing, credits) | D4–D6 |
| `/dev/components` (mandatory gallery) | prompt §4 |

## OPEN QUESTIONS for you (Phase 0 stop)

1. **Screenshots** per `/docs/capture-checklist.md` — Dashboard (D1) and My Books (D2) first.
2. What is `/chat-to-book` (D8)? Screenshot it if visible in your account.
3. Is the book list called "My Books" or "Library" in the UI? (Sidebar vs cover-editor back
   link disagree — F3 t0080 says "Library".)
4. Where do Math workbooks and Color-by-number live in the sidebar (E7/E8 — not visible in
   frames)?
5. Does the app have a dark theme? Any theme switch?
6. Your plan tier — so we can mark Premium/Unlimited-only features as `LOCKED (not observed)`.
7. What does the blurred credits pill in the top bar look like (D4)?
