"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { GENERATORS } from "@/mocks/generators";
import { useApp } from "@/mocks/store";
import { coverFor } from "@/mocks/data";
import { CreateBookModal } from "@/components/create/create-book-modal";
import { BOOK_TYPE_LABEL } from "@/mocks/types";

export default function GeneratorPage() {
  const params = useParams<{ flow: string }>();
  const def = GENERATORS[params.flow];
  const books = useApp((s) => s.books);
  const [open, setOpen] = useState(false);

  if (!def) {
    return (
      <>
        <Topbar title="Create" />
        <div className="mx-auto max-w-6xl px-6 py-8">
          <EmptyState
            title="Unknown generator"
            description="Pick a generator from the Create book hub."
            action={
              <Link href="/create"><Button size="sm">Open create hub</Button></Link>
            }
          />
        </div>
      </>
    );
  }

  const mine = books.filter((b) => b.type === def.type && !b.archived);

  return (
    <>
      <Topbar title={def.label} />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{def.label}</h2>
            <p className="mt-1 text-sm text-ink-2">{def.tagline}</p>
            <p className="mt-1 text-xs text-ink-2">{def.cost}</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" aria-hidden />
            Create New Book
          </Button>
        </div>

        <h3 className="mb-3 mt-8 text-lg font-bold">Your {def.label.toLowerCase()}</h3>
        {mine.length === 0 ? (
          <EmptyState
            title={`No ${def.label.toLowerCase()} yet`}
            description="Create one to see it here."
            action={<Button size="sm" onClick={() => setOpen(true)}>Create New Book</Button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {mine.map((b) => (
              <Link key={b.id} href={`/studio/${b.id}`}>
                <Card interactive className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverFor(b)} alt="" className="aspect-[10/13] w-full object-cover" />
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">{b.title}</p>
                    <p className="mt-0.5 text-xs text-ink-3">{b.pages.length} pages</p>
                    <div className="mt-2">
                      {b.status === "generating" ? (
                        <Badge tone="warning">Generating…</Badge>
                      ) : (
                        <Badge tone="success">Ready</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateBookModal def={def} open={open} onOpenChange={setOpen} />
    </>
  );
}
