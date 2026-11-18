"use client";

import { useMemo, useState } from "react";
import { Download, FileDown, CircleCheck, CircleX } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge, Button, Card, EmptyState, Progress } from "@/components/ui";
import { useApp } from "@/mocks/store";
import { buildPdf } from "@/lib/export-pdf";

/** Tasks & downloads (Phase 8): task list w/ progress + downloads history. */
export default function TasksPage() {
  const tasks = useApp((s) => s.tasks);
  const books = useApp((s) => s.books);
  const ledger = useApp((s) => s.ledger);
  const downloads = useMemo(
    () => ledger.filter((l) => l.reason.startsWith("Export")),
    [ledger],
  ); // history proxy (mock)

  const exportBook = async (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    const blob = await buildPdf(book, book.pages);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${book.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    useApp.getState().grant(0, `Export — ${book.title}`);
  };

  return (
    <>
      <Topbar title="Tasks & downloads" />
      <div className="mx-auto max-w-4xl px-6 py-8">
        <section aria-labelledby="tasks" className="mb-8">
          <h2 id="tasks" className="mb-3 text-lg font-bold">Background tasks</h2>
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks running"
              description="Generation and export tasks show their progress here."
            />
          ) : (
            <ul className="flex flex-col gap-2.5">
              {tasks.map((t) => (
                <Card key={t.id} className="p-4">
                  <div className="flex items-center gap-2.5">
                    {t.status === "done" ? (
                      <CircleCheck className="size-4.5 text-success" aria-hidden />
                    ) : t.status === "failed" ? (
                      <CircleX className="size-4.5 text-danger" aria-hidden />
                    ) : (
                      <span className="size-4.5 animate-spin rounded-full border-2 border-line border-t-primary" aria-hidden />
                    )}
                    <p className="min-w-0 flex-1 truncate font-medium">{t.title}</p>
                    <Badge tone={t.status === "failed" ? "danger" : t.status === "done" ? "success" : "warning"}>
                      {t.status}
                    </Badge>
                  </div>
                  {t.status === "running" && (
                    <Progress value={t.progress} className="mt-3" label={`${t.title} progress`} />
                  )}
                  {t.resultNote && <p className="mt-2 text-xs text-ink-3">{t.resultNote}</p>}
                </Card>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="downloads">
          <h2 id="downloads" className="mb-3 text-lg font-bold">Quick export</h2>
          <Card className="divide-y divide-line">
            {books.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-3.5">
                <FileDown className="size-4.5 text-ink-3" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.title}</p>
                  <p className="text-xs text-ink-3">{b.pages.length} pages · print-ready PDF</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => exportBook(b.id)}>
                  <Download className="size-3.5" aria-hidden /> Download
                </Button>
              </div>
            ))}
          </Card>
          <p className="mt-3 text-xs text-ink-3">
            Export history is tracked with the credits ledger in this mock; the
            real downloads store lands with Phase 12.
          </p>
          {downloads.length > 0 && (
            <p className="mt-1 text-xs text-ink-3">
              {downloads.length} export event{downloads.length > 1 ? "s" : ""} recorded.
            </p>
          )}
        </section>
      </div>
    </>
  );
}

