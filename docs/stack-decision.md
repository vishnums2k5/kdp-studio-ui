# Stack & Studio Canvas Decision (Phase 0, item 4)

## Mandated by the rebuild prompt (§5) — not open for debate

- **Next.js (App Router) + TypeScript strict** — every screen a stable, deep-linkable route.
- **Tailwind** configured from `/src/styles/tokens` (design tokens are the only source of
  colors/sizes/fonts; no hard-coded values in components).
- **Radix UI** primitives as the accessible headless base (dialog, dropdown, popover, tooltip,
  tabs, switch, select, …) — matches the prompt's accessibility bar and the Studio's heavy
  popover/menu usage.
- **Playwright** from day one — screenshots for the compare gates, visual-regression baselines,
  e2e for interactions.
- **Mock API layer** (`/src/mocks`, typed, swappable) for Phases 1–9; Phase 12 swaps it for real
  services without touching components.
- Folder structure per prompt §5: `/src/app`, `/src/components/ui`, `/src/components/<feature>`,
  `/src/mocks`, `/src/lib`, `/docs/screens`, `/reference`, `/tests/visual`, `/tests/e2e`.

## The open decision: Studio canvas engine

What the Studio must do (from `/docs/sitemap.md` §F): per-page scenes of **images, text blocks,
simple shapes/lines**, drag + corner-resize, selection handles, snap to trim/bleed/margin/safe-area
guides, zoom/pan, per-page zoom-out grid, WYSIWYG canvas that equals the export, plus a filmstrip
of page thumbnails.

| Option | Strengths | Weaknesses for us |
|---|---|---|
| **Konva (react-konva)** ✅ | React-idiomatic declarative scene graph; built-in `Transformer` = selection handles + rotation done; drag-and-drop native; excellent zoom/pan; layer caching keeps filmstrip/grid thumbnails cheap; simple high-DPI export (`toCanvas({pixelRatio})` → PNG → PDF pages); per-page JSON serializes straight into the typed mock API; big ecosystem, MIT. | Canvas raster = text is bitmap at export unless re-rendered at high pixelRatio (acceptable: export pipeline re-renders each page at 300+ DPI scale; vector-perfect PDF deferred to Phase 12 backend). No built-in snapping (we implement guide-snapping — small, well-understood). |
| Fabric.js | Strong object model + serialization; built-in IText editing; interactive transforms built-in. | React integration is imperative/awkward (ref-sync dance); snapping also manual; licensing moved to restrictive custom license from v6 (we would have to pin 5.x); theming/testing less ergonomic. |
| PixiJS | Fastest for thousands of bitmaps (WebGL/WebGPU). | Overkill for book pages (dozens of nodes/page); no built-in selection/transform/text-edit affordances; heaviest to learn; export complexity equal to Konva with none of its conveniences. |
| SVG scene graph | Vector-native = perfect print fidelity; DOM events free; crisp text at any zoom. | Performance degrades with large images per page; snapping/handles/guides all hand-rolled; print-PDF from client SVG still needs a conversion pipeline; Radix/popover layering + browser quirks make editor chrome harder. |

**Decision: Konva via `react-konva`**, with a thin typed scene model so the canvas layer stays
swappable:

```
PageScene { id, trim: {w,h}, bleed, elements: SceneElement[] }
SceneElement = ImageEl | TextEl | ShapeEl | FrameEl   // discriminated union, z-ordered
```

- Scenes live in `/src/mocks` (Phase 1–9), identical shape for the Phase 12 API.
- Guides (trim/bleed/margin/spine, safe area) render as a Konva overlay layer, toggled by the
  bottom-bar control; snapping implemented once against guide lines.
- Thumbnails: each page scene cached to an offscreen canvas (`layer.toCanvas`) — feeds the
  filmstrip and Grid view without re-rendering scenes.
- Export (mock, Phase 8): per page `toCanvas({ pixelRatio: dpi/72 })` → PDF assembly in a worker;
  the real vector pipeline is Phase 12 backend work and out of scope until then.
- Fallback documented: if Konva text editing proves too rough in Phase 6c, isolate a
  `TextElementEditor` behind an interface (contentEditable overlay positioned over the canvas is
  the standard fallback) — no architectural lock-in.

## Component gallery (mandatory, prompt §4)

`/dev/components` renders every base component in every state, light + dark, driven by the
tokens — this is the artifact Phase 1's gate compares against.

## Risks / notes

- Next.js + Konva SSR: react-konva needs `dynamic(() => …, { ssr: false })` for the canvas
  surface; standard pattern, noted here so Phase 6a doesn't rediscover it.
- Videos show the reference at 1920×1080; gates run at your capture width (1440 default) —
  measurement tolerances (±2 px) apply only to your screenshots, never to video frames.
- Blur regions in the videos (credits pill, user block) stay UNOBSERVED until your captures.
