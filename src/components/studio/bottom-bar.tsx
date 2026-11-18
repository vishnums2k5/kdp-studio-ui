"use client";

import { BookOpen, Grid3x3, Minus, PencilLine, Plus, ScrollText } from "lucide-react";
import { Segmented, Tooltip, Button } from "@/components/ui";
import { useApp } from "@/mocks/store";
import { useStudio, type StudioView } from "@/lib/studio-store";

/** Bottom status bar (per F1 t0005): view switcher, page pager, zoom,
 * fit, safe-area toggle. */
export function StudioBottomBar({ bookId }: { bookId: string }) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  const view = useStudio((s) => s.view);
  const setView = useStudio((s) => s.setView);
  const zoom = useStudio((s) => s.zoom);
  const setZoom = useStudio((s) => s.setZoom);
  const zoomBy = useStudio((s) => s.zoomBy);
  const fitWidth = useStudio((s) => s.fitWidth);
  const toggleFitWidth = useStudio((s) => s.toggleFitWidth);
  const safeArea = useStudio((s) => s.safeArea);
  const toggleSafeArea = useStudio((s) => s.toggleSafeArea);
  const selectedPageId = useStudio((s) => s.selectedPageId);
  const selectPage = useStudio((s) => s.selectPage);

  if (!book) return null;
  const idx = book.pages.findIndex((p) => p.id === selectedPageId);
  const current = idx < 0 ? 0 : idx;

  return (
    <footer className="flex h-12 shrink-0 items-center gap-3 border-t border-line bg-surface px-4">
      <Segmented<StudioView>
        ariaLabel="Page view"
        value={view}
        onValueChange={setView}
        options={[
          { value: "scroll", label: "Scroll", icon: <ScrollText className="size-3.5" aria-hidden /> },
          { value: "spread", label: "Spread", icon: <BookOpen className="size-3.5" aria-hidden /> },
          { value: "grid", label: "Grid", icon: <Grid3x3 className="size-3.5" aria-hidden /> },
        ]}
      />

      <div className="ml-2 flex items-center gap-1.5">
        <Button variant="icon" size="sm" disabled={current <= 0} onClick={() => selectPage(book.pages[current - 1]!.id)} aria-label="Previous page">
          <span aria-hidden>‹</span>
        </Button>
        <span className="text-sm text-ink-2">
          Page {current + 1} of {book.pages.length}
        </span>
        <Button variant="icon" size="sm" disabled={current >= book.pages.length - 1} onClick={() => selectPage(book.pages[current + 1]!.id)} aria-label="Next page">
          <span aria-hidden>›</span>
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="icon" size="sm" onClick={() => zoomBy(-0.1)} aria-label="Zoom out">
          <Minus className="size-4" aria-hidden />
        </Button>
        <input
          type="range"
          min={10}
          max={200}
          value={Math.round((fitWidth ? zoom : zoom) * 100)}
          onChange={(e) => setZoom(Number(e.target.value) / 100)}
          aria-label="Zoom level"
          className="w-24 accent-[rgb(var(--c-primary))]"
        />
        <span className="w-10 text-sm text-ink-2">{Math.round((fitWidth ? zoom : zoom) * 100)}%</span>
        <Button variant="icon" size="sm" onClick={() => zoomBy(0.1)} aria-label="Zoom in">
          <Plus className="size-4" aria-hidden />
        </Button>
        <Button size="sm" variant="ghost" onClick={toggleFitWidth}>
          Fit width
        </Button>
        <Button
          size="sm"
          variant={fitWidth ? "primary" : "ghost"}
          onClick={() => {
            if (!fitWidth) toggleFitWidth();
            else setZoom(0.5);
          }}
        >
          Fit page
        </Button>
        <Tooltip content="Safe-area guides: trim, bleed, margins" side="top">
          <Button size="sm" variant={safeArea ? "primary" : "ghost"} onClick={toggleSafeArea}>
            <PencilLine className="size-4" aria-hidden /> Safe area
          </Button>
        </Tooltip>
      </div>
    </footer>
  );
}
