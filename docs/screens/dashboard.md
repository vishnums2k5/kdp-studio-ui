# Screen spec — Dashboard / Overview (`/dashboard`)

- **Status:** PLACEHOLDER (layout UNOBSERVED — the reference dashboard never appears in official videos or allowed public pages). Built in the observed design language (F2/F10 chrome, tokens).
- **Purpose:** landing surface after login; quick re-entry into books + credits visibility.
- **Regions:** welcome header → quick-action card row (4 generators) → two-column zone (recent books 2×2 | credits widget + getting-started + tip card).
- **States:** loading (skeletons), error (banner), empty (no books → CTA card).
- **Interactions:** quick cards → `/create/<flow>`; book cards → `/studio/<id>`; links → /books, /account/credits.
- **Responsive:** 1-col quick actions < 640; recent grid 1-col < 640, sidebar column stacks < 1024.
- **UNOBSERVED:** entire layout, widgets, wording; captured items will replace placeholder per capture-checklist P0.
