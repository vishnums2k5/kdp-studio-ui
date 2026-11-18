# Phase 6 verification — Studio (6a–6f)
- Captures console-clean @1440: woodland-activity-sampler (4 pages, word-search + trivia + answers), pip (26 pages), cover editor.
- Fix history: react-konva pinned 19.2.4 (Next vendors React 19.2.0-canary); hydration fixed by seeded puzzle grid (no Math.random in render); konva node-canvas externals shim in next.config.
- KDP check computes real rules (page count ≥24, margins by count, edge safety, author, fonts) with inline fix actions (add notes pages, open setup).
- Undo/redo, drag/transform commit to scenes, AI popover mock edit → compare → Keep (spends 1 credit), history retained.
