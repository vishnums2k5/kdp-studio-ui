"use client";

import { useState } from "react";
import { Button, Switch, Dialog, DialogContent } from "@/components/ui";
import { useApp } from "@/mocks/store";
import { useStudio } from "@/lib/studio-store";
import type { PageType } from "@/mocks/types";

const ADD_PAGE_TYPES: { type: PageType; label: string; credit?: number }[] = [
  { type: "word-search", label: "Word search" },
  { type: "trivia", label: "Trivia round" },
  { type: "sudoku", label: "Sudoku" },
  { type: "math", label: "Math page" },
  { type: "coloring", label: "Coloring page", credit: 1 },
  { type: "art", label: "Picture page", credit: 1 },
  { type: "text", label: "Text page" },
  { type: "prompt", label: "Prompt page" },
];

/** Add-page menu (observed F1: "all puzzle types plus blank, text, picture,
 * coloring"). AI page types cost 1 credit per page (observed help). */
export function AddPageMenu({
  bookId,
  open,
  onOpenChange,
}: {
  bookId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const addPage = useApp((s) => s.addPage);
  const spend = useApp((s) => s.spend);
  const credits = useApp((s) => s.user.credits);

  const add = (type: PageType, credit?: number) => {
    if (credit && credits < credit) return;
    if (credit) spend(credit, `Add ${type} page`);
    addPage(bookId, type);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(92vw,480px)]">
        <div className="p-6">
          <h2 className="text-xl font-bold">Add page</h2>
          <p className="mt-1 text-sm text-ink-2">
            AI page types cost 1 credit each; algorithm pages are free.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {ADD_PAGE_TYPES.map((t) => (
              <button
                key={t.type}
                onClick={() => add(t.type, t.credit)}
                className="flex items-center justify-between rounded-md border border-line px-3.5 py-2.5 text-sm hover:border-primary hover:bg-primary-soft/40 transition-colors"
              >
                {t.label}
                <span className="text-xs text-ink-3">
                  {t.credit ? `${t.credit} cr` : "free"}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-md bg-surface-2 p-3">
            <span className="text-sm font-medium">Answer key on</span>
            <Switch checked onCheckedChange={() => {}} aria-label="Answer key on" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Book setup dialog (observed F3 text: author name; spine warning). */
export function BookSetupDialog({
  bookId,
  open,
  onOpenChange,
}: {
  bookId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  const updateBook = useApp((s) => s.updateBook);
  const [author, setAuthor] = useState(book?.author ?? "");
  if (!book) return null;
  const spineThin = book.pages.length < 79; // KDP: ~0.06in/page → <79 pages too thin for spine text

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(92vw,440px)]">
        <div className="p-6">
          <h2 className="text-xl font-bold">Book setup</h2>
          <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium">
            Author name
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              onBlur={() => updateBook(bookId, { author })}
              className="h-9 rounded-md border border-line px-3 text-sm focus:border-primary focus:outline-none focus:shadow-focus"
              placeholder="e.g. Lantern Lane Press"
            />
          </label>
          {spineThin && (
            <p role="status" className="mt-3 rounded-md bg-warning-soft p-3 text-sm text-warning">
              With {book.pages.length} pages the spine is too thin for spine text — the
              cover tool will suggest hiding it.
            </p>
          )}
          <div className="mt-5 flex justify-end">
            <Button onClick={() => { updateBook(bookId, { author }); onOpenChange(false); }}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
