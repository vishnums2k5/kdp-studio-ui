"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  FilePlus2,
  MoreHorizontal,
  Trash2,
  Lock,
  Unlock,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Select,
  Switch,
  Button,
} from "@/components/ui";
import { useApp } from "@/mocks/store";
import { useStudio } from "@/lib/studio-store";
import { PageThumb } from "./scene-preview";
import { cn } from "@/lib/utils";
import type { Book, Page } from "@/mocks/types";

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

/** Pages panel — filmstrip + answer key + "left out of the book" sections
 * (structure per F1 t0005). */
export function PagesPanel({ bookId }: { bookId: string }) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  const selectedPageId = useStudio((s) => s.selectedPageId);
  const selectPage = useStudio((s) => s.selectPage);
  const setFlag = useStudio((s) => s.setFlag);
  const movePage = useApp((s) => s.movePage);
  const duplicatePage = useApp((s) => s.duplicatePage);
  const deletePage = useApp((s) => s.deletePage);
  const updateBook = useApp((s) => s.updateBook);
  const [answerKey, setAnswerKey] = useState(
    book?.pages.some((p) => p.type === "answers") ?? false,
  );
  const [answersPerPage, setAnswersPerPage] = useState("4");

  if (!book) return null;
  const answerPages = book.pages.filter((p) => p.type === "answers");

  return (
    <aside
      aria-label="Pages panel"
      className="flex w-[300px] shrink-0 flex-col border-r border-line bg-surface"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-bold">{book.pages.length} pages</span>
        <Button size="sm" onClick={() => setFlag("addPageOpen", true)}>
          <FilePlus2 className="size-4" aria-hidden /> Add page
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex flex-col gap-2.5" role="list" aria-label="Page list">
          {book.pages.map((p, i) => (
            <PageCard
              key={p.id}
              book={book}
              page={p}
              index={i}
              selected={selectedPageId === p.id}
              onSelect={() => selectPage(p.id)}
              onMove={(dir) => movePage(bookId, p.id, dir)}
              onDuplicate={() => duplicatePage(bookId, p.id)}
              onDelete={() => deletePage(bookId, p.id)}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-line px-4 py-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
            Answer key
          </span>
          <Switch
            checked={answerKey}
            onCheckedChange={(v) => {
              setAnswerKey(v);
              updateBook(bookId, { style: book.style });
            }}
            aria-label="Answer key on"
          />
        </div>
        {answerPages.length > 0 && (
          <p className="mt-1.5 text-xs text-ink-3">
            {answerPages.length} answer page{answerPages.length > 1 ? "s" : ""} (page{" "}
            {book.pages.findIndex((p) => p.type === "answers") + 1})
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-ink-2">Answers per page</span>
          <Select
            className="ml-auto w-32"
            ariaLabel="Answers per page"
            value={answersPerPage}
            onValueChange={setAnswersPerPage}
            options={[
              { value: "1", label: "1 per page" },
              { value: "2", label: "2 per page" },
              { value: "4", label: "4 per page" },
              { value: "8", label: "8 per page" },
            ]}
          />
        </div>
      </div>

      <div className="border-t border-line px-4 py-3.5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-2">
          Left out of the book
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-ink-2">6 front pages off</span>
          <Button variant="ghost" size="sm" onClick={() => setFlag("bookMenuOpen", true)}>
            Book setup
          </Button>
        </div>
      </div>
    </aside>
  );
}

function PageCard({
  book,
  page,
  index,
  selected,
  onSelect,
  onMove,
  onDuplicate,
  onDelete,
}: {
  book: Book;
  page: Page;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      role="listitem"
      className={cn(
        "flex items-stretch gap-3 rounded-md border p-2 transition-colors duration-[var(--d-fast)]",
        selected ? "border-primary bg-primary-soft/40" : "border-line hover:bg-surface-2",
      )}
    >
      <button
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-current={selected ? "true" : undefined}
        aria-label={`${PAGE_TYPE_LABEL[page.type] ?? page.type}, page ${index + 1}`}
      >
        <div className="grid w-16 shrink-0 place-items-center overflow-hidden rounded-sm bg-white p-0.5">
          <PageThumb page={page} book={book} scale={0.052} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-ink-3">{index + 1}</p>
          <p className="truncate text-sm font-medium text-ink">
            {PAGE_TYPE_LABEL[page.type] ?? page.type}
          </p>
        </div>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={`Page ${index + 1} actions`}
            className="grid size-7 shrink-0 self-center place-items-center rounded-sm text-ink-3 hover:bg-surface-3 hover:text-ink"
          >
            <MoreHorizontal className="size-4" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onMove(-1)} disabled={index === 0}>
            <ArrowUp className="size-4" aria-hidden /> Move up
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onMove(1)}>
            <ArrowDown className="size-4" aria-hidden /> Move down
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="size-4" aria-hidden /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem danger onClick={onDelete}>
            <Trash2 className="size-4" aria-hidden /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


