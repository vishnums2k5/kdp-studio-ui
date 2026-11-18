"use client";

import { useState } from "react";
import { Download, FileDown } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  useToast,
} from "@/components/ui";
import { useApp } from "@/mocks/store";
import { useStudio } from "@/lib/studio-store";
import { buildPdf } from "@/lib/export-pdf";

export type Scope = "book" | "puzzles" | "answers" | "selected" | "images";

const SCOPES: { value: Scope; label: string; note: string }[] = [
  { value: "book", label: "Print-ready book", note: "Full interior PDF, front pages included" },
  { value: "puzzles", label: "Puzzles only", note: "Just the puzzle pages" },
  { value: "answers", label: "Answer key only", note: "Only answer pages" },
  { value: "selected", label: "Selected pages", note: "The page currently open in the canvas" },
  { value: "images", label: "Images", note: "All page art as PNG files" },
];

/** Export dialog (observed F1: full book / puzzles only / answer key only /
 * selected pages / images → Download PDF). PDF assembly is mocked client-side
 * with pdf-lib (real vector pipeline is Phase 12). */
export function ExportDialog({
  bookId,
  open,
  onOpenChange,
}: {
  bookId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  const addTask = useApp((s) => s.addTask);
  const patchTask = useApp((s) => s.patchTask);
  const setFlag = useStudio((s) => s.setFlag);
  const selectedPageId = useStudio((s) => s.selectedPageId);
  const { toast } = useToast();
  const [scope, setScope] = useState<Scope>("book");
  const [running, setRunning] = useState(false);

  if (!book) return null;

  const run = async () => {
    setRunning(true);
    const task = addTask("export", `Export “${book.title}” (${scope})`, book.id);
    await new Promise((r) => setTimeout(r, 300));
    patchTask(task.id, { progress: 40 });
    try {
      const pages =
        scope === "book"
          ? book.pages
          : scope === "puzzles"
            ? book.pages.filter((p) =>
                ["word-search", "trivia", "sudoku", "math", "coloring"].includes(p.type),
              )
            : scope === "answers"
              ? book.pages.filter((p) => p.type === "answers")
              : scope === "selected"
                ? book.pages.filter((p) => p.id === selectedPageId)
                : book.pages;
      const blob = await buildPdf(book, pages, scope === "images");
      patchTask(task.id, { progress: 100, status: "done", resultNote: `${pages.length} pages` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title.replace(/\s+/g, "-").toLowerCase()}${scope === "book" ? "" : `-${scope}`}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ kind: "success", title: "Export ready", description: `${pages.length} pages exported.` });
    } catch {
      patchTask(task.id, { status: "failed", resultNote: "Export failed" });
      toast({ kind: "error", title: "Export failed", description: "Try again in a moment." });
    } finally {
      setRunning(false);
      setFlag("exportOpen", false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setFlag("exportOpen", o); onOpenChange(o); }}>
      <DialogContent className="w-[min(92vw,460px)]">
        <div className="p-6">
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="size-5 text-primary" aria-hidden /> Export
          </DialogTitle>
          <DialogDescription className="mt-1">
            “{book.title}” · {book.pages.length} pages · {book.trim.w}×{book.trim.h} in
          </DialogDescription>

          <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Export scope">
            {SCOPES.map((s) => (
              <button
                key={s.value}
                role="radio"
                aria-checked={scope === s.value}
                onClick={() => setScope(s.value)}
                className={`flex items-start gap-3 rounded-md border px-3.5 py-2.5 text-left transition-colors ${
                  scope === s.value
                    ? "border-primary bg-primary-soft/50"
                    : "border-line hover:bg-surface-2"
                }`}
              >
                <span className={`mt-1 size-3.5 rounded-full border-2 ${scope === s.value ? "border-primary bg-primary" : "border-line-strong"}`} aria-hidden />
                <span>
                  <span className="block text-sm font-medium">{s.label}</span>
                  <span className="block text-xs text-ink-2">{s.note}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setFlag("exportOpen", false); onOpenChange(false); }}>
              Cancel
            </Button>
            <Button loading={running} onClick={run}>
              <Download className="size-4" aria-hidden /> Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
