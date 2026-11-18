"use client";

import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useApp } from "@/mocks/store";
import { useStudio } from "@/lib/studio-store";
import { StudioTopbar, StudioRail } from "@/components/studio/studio-chrome";
import { PagesPanel } from "@/components/studio/pages-panel";
import { RightPanel } from "@/components/studio/right-panel";
import { StudioBottomBar } from "@/components/studio/bottom-bar";
import { CanvasArea } from "@/components/studio/canvas-area";
import { AddPageMenu } from "@/components/studio/add-page-menu";
import { ExportDialog } from "@/components/studio/export-dialog";
import { ToolPanel } from "@/components/studio/tool-panel";
import { TaskTray } from "@/components/studio/task-tray";
import { EmptyState, Button } from "@/components/ui";
import type { TextElement } from "@/mocks/types";

// Konva touches `window` at import time — keep it client-only (see
// docs/stack-decision.md).
const CanvasAreaDynamic = dynamic(
  () => import("@/components/studio/canvas-area").then((m) => m.CanvasArea),
  { ssr: false, loading: () => <div className="flex-1 bg-canvas" /> },
);

export function StudioClient({ bookId }: { bookId: string }) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  const openBook = useStudio((s) => s.openBook);
  const activeTool = useStudio((s) => s.activeTool);
  const snapshot = useStudio((s) => s.snapshot);
  const undo = useStudio((s) => s.undo);
  const redo = useStudio((s) => s.redo);
  const addPageOpen = useStudio((s) => s.addPageOpen);
  const exportOpen = useStudio((s) => s.exportOpen);
  const taskTrayOpen = useStudio((s) => s.taskTrayOpen);
  const previewMode = useStudio((s) => s.previewMode);
  const setFlag = useStudio((s) => s.setFlag);
  const updateScene = useApp((s) => s.updateScene);

  useEffect(() => {
    openBook(bookId, { colorMode: book?.colorMode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const serialized = useMemo(
    () => (book ? JSON.stringify(book.pages.map((p) => p.scene)) : ""),
    [book?.pages],
  );

  const onUndo = useCallback(() => {
    const res = undo(serialized);
    if (res.restore !== undefined) applySnapshot(res.restore);
    void res;
  }, [serialized, undo, redo]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRedo = useCallback(() => {
    const res = redo(serialized);
    if (res.restore !== undefined) applySnapshot(res.restore);
    void res;
  }, [serialized, undo, redo]); // eslint-disable-line react-hooks/exhaustive-deps

  const applySnapshot = (snap: string) => {
    if (!book) return;
    const scenes: unknown = JSON.parse(snap);
    book.pages.forEach((p, i) => {
      const scene = (scenes as never[])[i];
      if (scene) updateScene(book.id, p.id, scene as never);
    });
  };

  const beforeSceneMutation = useCallback(() => {
    snapshot(serialized);
  }, [serialized, snapshot]);

  if (!book) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas px-6">
        <EmptyState
          title="Book not found"
          description="It may have been deleted. Pick another book from My Books."
          action={
            <Link href="/books"><Button size="sm">Open My Books</Button></Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-canvas">
      <StudioTopbar bookId={bookId} onUndo={onUndo} onRedo={onRedo} />
      <div className="flex min-h-0 flex-1">
        <StudioRail />
        {activeTool === "pages" ? (
          <PagesPanel bookId={bookId} />
        ) : (
          <ToolPanel bookId={bookId} beforeMutation={beforeSceneMutation} />
        )}
        <main className="relative flex min-w-0 flex-1 flex-col">
          {previewMode && (
            <div className="flex items-center justify-between bg-info-soft px-4 py-1.5 text-xs font-medium text-info">
              Preview mode — canvas is read-only. The preview is the exact file you&apos;ll download.
              <button className="underline" onClick={() => setFlag("previewMode", false)}>Exit preview</button>
            </div>
          )}
          <CanvasAreaDynamic
            key={serialized.slice(0, 64) + book.pages.length}
            book={book}
          />
        </main>
        <RightPanel bookId={bookId} />
      </div>
      <StudioBottomBar bookId={bookId} />

      <AddPageMenu bookId={bookId} open={addPageOpen} onOpenChange={(o) => setFlag("addPageOpen", o)} />
      <ExportDialog bookId={bookId} open={exportOpen} onOpenChange={(o) => setFlag("exportOpen", o)} />
      {taskTrayOpen && <TaskTray onClose={() => setFlag("taskTrayOpen", false)} />}
    </div>
  );
}

export type { TextElement };
