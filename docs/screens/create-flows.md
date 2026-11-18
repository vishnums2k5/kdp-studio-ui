# Screen spec — Create hub + generator flows
- Hub `/create`: three entry cards (Generate with AI / Start blank / Use a template — observed F9) + generator grid (AI vs free groups).
- Generator pages `/create/<flow>`: header + cost + "Create New Book" → modal (observed F2 t0010 structure): credit banner w/ dynamic cost, fields per config (title w/ KDP-200 counter + Enhance Prompt with AI ghosts, story textarea, page range, character, style chips, selects, checkboxes, topics chips), validation, insufficient-credit error, non-fiction outline review step (observed F8), CTA per flow.
- Mock generation (observed: book opens immediately, pages arrive one at a time ~0.4s/page): task tray entry + streaming pages into Studio + status flip to ready. Sudoku/math/journal/blank instant (observed "ready in seconds").
- **UNOBSERVED:** word-search & color-by-number form fields (placeholder fields), exact modal px.
