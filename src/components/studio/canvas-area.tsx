"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  MoreHorizontal,
  Replace,
  Trash2,
  Lock,
  Unlock,
} from "lucide-react";
import { PageStage, IN } from "./page-stage";
import { PageThumb } from "./scene-preview";
import { AiChangesPopover } from "./ai-changes-popover";
import { useApp } from "@/mocks/store";
import { useStudio } from "@/lib/studio-store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Tooltip,
} from "@/components/ui";
import type { Book, Page, TextElement } from "@/mocks/types";

const PAGE_TYPE_LABEL: Record<string, string> = {
  title: "Title page",
  copyright: "Copyright",
  art: "Art page",
  text: "Text page",
  picture: "Picture page",
  coloring: "Coloring page",
  "word-search": "Word search",
  trivia: "Trivia",
  sudoku: "Sudoku",
  math: "Math page",
  prompt: "Prompt page",
  answers: "Answers",
};

/** Canvas area: hosts the current view (Scroll / Spread / Grid), per-page
 * chrome (label + actions, per F1), the AI-changes popover anchor and the
 * text-edit overlay. */
export function CanvasArea({ book }: { book: Book }) {
  const view = useStudio((s) => s.view);
  const zoom = useStudio((s) => s.zoom);
  const fitWidth = useStudio((s) => s.fitWidth);
  const aiPopover = useStudio((s) => s.aiPopover);
  const closeAiPopover = useStudio((s) => s.closeAiPopover);
  const selectPage = useStudio((s) => s.selectPage);
  const selectedPageId = useStudio((s) => s.selectedPageId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<{ pageId: string; el: TextElement; rect: { left: number; top: number; width: number; height: number; fontSize: number } } | null>(null);

  const availW = 10000; // replaced by measured container below
  void availW;

  return (
    <div
      className="relative flex-1 overflow-auto bg-canvas"
      ref={scrollRef}
      aria-label="Book canvas"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAiPopover();
      }}
    >
      {view === "grid" ? (
        <GridView book={book} zoom={Math.max(0.12, zoom)} onSelect={(id) => { selectPage(id); useStudio.getState().setView("scroll"); }} />
      ) : (
        <PageFlow
          book={book}
          zoom={zoom}
          fitWidth={fitWidth}
          scrollRef={scrollRef}
          spread={view === "spread"}
          onTextEdit={(pageId, el, rect) => setEditing({ pageId, el, rect })}
        />
      )}

      {aiPopover && <AiPopoverAnchor book={book} />}

      {editing && (
        <TextEditorOverlay
          rect={editing.rect}
          initialText={editing.el.text}
          fontSize={editing.rect.fontSize}
          onCommit={(text) => {
            const store = useApp.getState();
            const page = book.pages.find((p) => p.id === editing.pageId);
            if (page) {
              store.updateScene(book.id, page.id, {
                elements: page.scene.elements.map((e) =>
                  e.id === editing.el.id ? { ...e, text } : e,
                ),
              });
            }
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

/** Anchor the AI popover to the selected image element's on-screen rect. */
function AiPopoverAnchor({ book }: { book: Book }) {
  const aiPopover = useStudio((s) => s.aiPopover);
  const closeAiPopover = useStudio((s) => s.closeAiPopover);
  const zoom = useStudio((s) => s.zoom);
  const fitWidth = useStudio((s) => s.fitWidth);
  void fitWidth;
  const page = book.pages.find((p) => p.id === aiPopover?.pageId);
  const el = page?.scene.elements.find((e) => e.id === aiPopover?.elementId);
  if (!aiPopover || !page || !el) return null;
  const left = 40 + el.x * zoom + el.w * zoom + 12;
  const top = 40 + el.y * zoom;
  return (
    <AiChangesPopover
      bookId={book.id}
      pageId={page.id}
      elementId={el.id}
      anchor={{ x: left, y: top }}
      onClose={closeAiPopover}
    />
  );
}

function PageFlow({
  book,
  zoom,
  fitWidth,
  spread,
  onTextEdit,
  scrollRef,
}: {
  book: Book;
  zoom: number;
  fitWidth: boolean;
  spread: boolean;
  onTextEdit: (pageId: string, el: TextElement, rect: { left: number; top: number; width: number; height: number; fontSize: number }) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const containerW = scrollRef.current?.clientWidth ?? 1200;
  const effZoom = fitWidth ? Math.min(2, Math.max(0.1, (containerW - 96) / (book.trim.w * IN))) : zoom;
  const pageW = book.trim.w * IN * effZoom;
  const pageH = book.trim.h * IN * effZoom;
  const selectPage = useStudio((s) => s.selectPage);
  const selectedPageId = useStudio((s) => s.selectedPageId);
  const movePage = useApp((s) => s.movePage);
  const duplicatePage = useApp((s) => s.duplicatePage);
  const deletePage = useApp((s) => s.deletePage);
  const updateScene = useApp((s) => s.updateScene);

  const pairs = useMemo(() => {
    if (!spread) return book.pages.map((p) => [p]);
    const out: Page[][] = [];
    for (let i = 0; i < book.pages.length; i += 2) out.push(book.pages.slice(i, i + 2));
    return out;
  }, [book.pages, spread]);

  return (
    <div className="flex flex-col items-center gap-8 px-6 py-8">
      {pairs.map((group, gi) => (
        <div key={group.map((p) => p.id).join("-")} className={spread ? "flex gap-6" : "contents"}>
          {group.map((page) => {
            const idx = book.pages.findIndex((p) => p.id === page.id);
            return (
              <ContextMenu key={page.id}>
                <ContextMenuTrigger asChild>
                  <div
                    className="flex flex-col items-center"
                    onMouseEnter={() => selectPage(page.id)}
                  >
                    <div className="mb-2 flex h-9 w-full items-center gap-2" style={{ width: pageW }}>
                      <span className="text-sm font-medium text-ink-2">
                        Page {idx + 1} · {PAGE_TYPE_LABEL[page.type] ?? page.type}
                      </span>
                      <div className="ml-auto flex items-center gap-0.5 text-ink-3">
                        <Tooltip content="Move up">
                          <button aria-label={`Move page ${idx + 1} up`} disabled={idx === 0} onClick={() => movePage(book.id, page.id, -1)} className="grid size-7 place-items-center rounded-sm hover:bg-surface-3 disabled:opacity-40">
                            <ArrowUp className="size-4" aria-hidden />
                          </button>
                        </Tooltip>
                        <Tooltip content="Move down">
                          <button aria-label={`Move page ${idx + 1} down`} disabled={idx === book.pages.length - 1} onClick={() => movePage(book.id, page.id, 1)} className="grid size-7 place-items-center rounded-sm hover:bg-surface-3 disabled:opacity-40">
                            <ArrowDown className="size-4" aria-hidden />
                          </button>
                        </Tooltip>
                        <Tooltip content="Duplicate">
                          <button aria-label={`Duplicate page ${idx + 1}`} onClick={() => duplicatePage(book.id, page.id)} className="grid size-7 place-items-center rounded-sm hover:bg-surface-3">
                            <Copy className="size-4" aria-hidden />
                          </button>
                        </Tooltip>
                        <Tooltip content="Delete">
                          <button aria-label={`Delete page ${idx + 1}`} onClick={() => deletePage(book.id, page.id)} className="grid size-7 place-items-center rounded-sm hover:bg-surface-3 hover:text-danger">
                            <Trash2 className="size-4" aria-hidden />
                          </button>
                        </Tooltip>
                        <Tooltip content="Replace page art (AI)">
                          <button aria-label={`Replace page ${idx + 1} art`} onClick={() => {
                            const imgEl = page.scene.elements.find((e) => e.kind === "image");
                            if (imgEl) {
                              useStudio.getState().openAiPopover(page.id, imgEl.id);
                            } else {
                              useStudio.getState().setFlag("addPageOpen", true);
                            }
                          }} className="grid size-7 place-items-center rounded-sm hover:bg-surface-3">
                            <Replace className="size-4" aria-hidden />
                          </button>
                        </Tooltip>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button aria-label={`More for page ${idx + 1}`} className="grid size-7 place-items-center rounded-sm hover:bg-surface-3">
                              <MoreHorizontal className="size-4" aria-hidden />
                            </button>
                          </DropdownMenuTrigger>
                          <PageMoreMenu bookId={book.id} page={page} />
                        </DropdownMenu>
                      </div>
                    </div>

                    <div
                      onClick={() => selectPage(page.id)}
                      className={`rounded-[2px] transition-shadow ${
                        selectedPageId === page.id ? "ring-2 ring-primary/70" : ""
                      }`}
                    >
                      <PageStage
                        book={book}
                        page={page}
                        index={idx}
                        zoom={effZoom}
                        width={pageW + 32}
                        onTextEdit={(pageId, el, pos) =>
                          onTextEdit(pageId, el, {
                            left: pos.x * effZoom,
                            top: pos.y * effZoom,
                            width: el.w * effZoom,
                            height: el.h * effZoom,
                            fontSize: el.fontSize * effZoom,
                          })
                        }
                      />
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => duplicatePage(book.id, page.id)}>
                    <Copy className="size-4" aria-hidden /> Duplicate
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() =>
                      updateScene(book.id, page.id, {
                        elements: page.scene.elements.map((e) => ({ ...e, locked: !e.locked })),
                      })
                    }
                  >
                    <Lock className="size-4" aria-hidden /> Lock all items
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem danger onClick={() => deletePage(book.id, page.id)}>
                    <Trash2 className="size-4" aria-hidden /> Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function PageMoreMenu({ bookId, page }: { bookId: string; page: Page }) {
  const duplicatePage = useApp((s) => s.duplicatePage);
  const deletePage = useApp((s) => s.deletePage);
  const unlockAll = useApp((s) => s.updateScene);
  return (
    <DropdownMenuContent align="end">
      <ContextMenuItemLike onClick={() => duplicatePage(bookId, page.id)}>
        <Copy className="size-4" aria-hidden /> Duplicate
      </ContextMenuItemLike>
      <ContextMenuItemLike
        onClick={() =>
          unlockAll(bookId, page.id, {
            elements: page.scene.elements.map((e) => ({ ...e, locked: false })),
          })
        }
      >
        <Unlock className="size-4" aria-hidden /> Unlock all items
      </ContextMenuItemLike>
      <ContextMenuSeparator />
      <ContextMenuItemLike danger onClick={() => deletePage(bookId, page.id)}>
        <Trash2 className="size-4" aria-hidden /> Delete
      </ContextMenuItemLike>
    </DropdownMenuContent>
  );
}

function ContextMenuItemLike({
  children,
  onClick,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      role="menuitem"
      tabIndex={-1}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
      className={`mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-sm outline-none hover:bg-surface-3 ${
        danger ? "text-danger hover:bg-danger-soft" : "text-ink"
      } ${disabled ? "cursor-not-allowed text-ink-3" : ""}`}
    >
      {children}
    </div>
  );
}

function GridView({ book, zoom, onSelect }: { book: Book; zoom: number; onSelect: (id: string) => void }) {
  const selectedPageId = useStudio((s) => s.selectedPageId);
  return (
    <div className="flex flex-wrap content-start justify-center gap-5 p-8">
      {book.pages.map((p, i) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className="group flex flex-col items-center gap-1.5"
          aria-label={`Open page ${i + 1}`}
        >
          <div
            className={`overflow-hidden rounded-sm bg-white transition-shadow ${
              selectedPageId === p.id ? "ring-2 ring-primary" : "group-hover:ring-2 group-hover:ring-line-strong"
            }`}
          >
            <PageThumb page={p} book={book} scale={zoom} />
          </div>
          <span className="text-xs text-ink-3">{i + 1}</span>
        </button>
      ))}
    </div>
  );
}

function TextEditorOverlay({
  rect,
  initialText,
  fontSize,
  onCommit,
  onCancel,
}: {
  rect: { left: number; top: number; width: number; height: number; fontSize: number };
  initialText: string;
  fontSize: number;
  onCommit: (text: string) => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useState(() => {
    // autofocus after mount
    setTimeout(() => ref.current?.focus(), 30);
    return null;
  });
  return (
    <div className="absolute inset-0 z-[var(--z-panel)]" onMouseDown={(e) => { if (e.target === e.currentTarget) onCommit((ref.current?.value ?? initialText)); }}>
      <textarea
        ref={ref}
        defaultValue={initialText}
        onBlur={(e) => onCommit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
        className="absolute rounded-sm border-2 border-primary bg-white p-1 shadow-lg focus:outline-none"
        style={{
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          fontSize,
          lineHeight: 1.2,
          textAlign: "center",
        }}
        aria-label="Edit text"
      />
    </div>
  );
}
