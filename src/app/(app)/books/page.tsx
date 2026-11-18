"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  Copy,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  Pagination,
  Segmented,
  Select,
} from "@/components/ui";
import { useApp } from "@/mocks/store";
import { coverFor } from "@/mocks/data";
import { BOOK_TYPE_LABEL, type Book } from "@/mocks/types";

type View = "grid" | "list";
type SortKey = "recent" | "title" | "pages";

const PAGE_SIZE = 12;

export default function BooksPage() {
  const books = useApp((s) => s.books);
  const actions = useApp.getState();

  const [view, setView] = useState<View>("grid");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [sort, setSort] = useState<SortKey>("recent");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [renaming, setRenaming] = useState<Book | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);

  const filtered = useMemo(() => {
    let list = books.filter((b) => !!b.archived === showArchived);
    if (typeFilter !== "all") list = list.filter((b) => b.type === typeFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.tags ?? []).some((t) => t.includes(q)),
      );
    }
    const sorted = [...list];
    if (sort === "recent")
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "pages") sorted.sort((a, b) => b.pages.length - a.pages.length);
    return sorted;
  }, [books, query, typeFilter, showArchived, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected =
    current.length > 0 && current.every((b) => selected.has(b.id));

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const typeOptions = [
    { value: "all", label: "All types" },
    ...Object.entries(BOOK_TYPE_LABEL).map(([value, label]) => ({ value, label })),
  ];

  return (
    <>
      <Topbar title="My Books" />
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* toolbar */}
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-56 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search books, authors, tags…"
              className="pl-9"
              aria-label="Search books"
            />
          </div>
          <Select
            className="w-44"
            ariaLabel="Filter by book type"
            value={typeFilter}
            onValueChange={(v) => {
              setTypeFilter(v);
              setPage(1);
            }}
            options={typeOptions}
          />
          <Select
            className="w-40"
            ariaLabel="Sort books"
            value={sort}
            onValueChange={(v) => setSort(v as SortKey)}
            options={[
              { value: "recent", label: "Recently edited" },
              { value: "title", label: "Title A–Z" },
              { value: "pages", label: "Most pages" },
            ]}
          />
          <Segmented
            ariaLabel="View mode"
            value={view}
            onValueChange={(v) => setView(v)}
            options={[
              { value: "grid", label: "", ariaLabel: "Grid view", icon: <LayoutGrid className="size-4" aria-hidden /> },
              { value: "list", label: "", ariaLabel: "List view", icon: <List className="size-4" aria-hidden /> },
            ]}
          />
          <Button
            variant={showArchived ? "secondary" : "ghost"}
            onClick={() => {
              setShowArchived((s) => !s);
              setSelected(new Set());
            }}
          >
            <Archive className="size-4" />
            {showArchived ? "Viewing archived" : "Archived"}
          </Button>
        </div>

        {/* bulk bar */}
        {selected.size > 0 && (
          <div
            role="toolbar"
            aria-label="Bulk actions"
            className="mb-4 flex items-center gap-3 rounded-md border border-primary/30 bg-primary-soft px-4 py-2.5"
          >
            <span className="text-sm font-medium text-ink">
              {selected.size} selected
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                for (const id of selected) actions.archiveBook(id, !showArchived);
                setSelected(new Set());
              }}
            >
              {showArchived ? <ArchiveRestore className="size-3.5" /> : <Archive className="size-3.5" />}
              {showArchived ? "Restore" : "Archive"}
            </Button>
            <Button size="sm" variant="danger-ghost" onClick={() => setBulkDelete(true)}>
              <Trash2 className="size-3.5" /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        )}

        {/* list */}
        {filtered.length === 0 ? (
          <EmptyState
            title={query || typeFilter !== "all" ? "No matching books" : showArchived ? "Nothing archived" : "No books yet"}
            description={
              query
                ? "Try a different search or clear the filters."
                : showArchived
                  ? "Archived books will appear here."
                  : "Books you create will appear here."
            }
            action={
              !query && !showArchived ? (
                <Link href="/create">
                  <Button size="sm">Create book</Button>
                </Link>
              ) : undefined
            }
          />
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {current.map((b) => (
              <Card key={b.id} className="group relative overflow-hidden">
                <Checkbox
                  aria-label={`Select ${b.title}`}
                  checked={selected.has(b.id)}
                  onCheckedChange={() => toggleSelect(b.id)}
                  className="absolute left-2.5 top-2.5 z-10 bg-surface/90"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label={`Actions for ${b.title}`}
                      className="absolute right-2 top-2 z-10 grid size-7 place-items-center rounded-sm bg-surface/90 text-ink-2 opacity-0 transition-opacity hover:text-ink group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      <MoreHorizontal className="size-4" aria-hidden />
                    </button>
                  </DropdownMenuTrigger>
                  <BookMenu book={b} onRename={(bk) => { setRenaming(bk); setRenameValue(bk.title); }} onDelete={setDeleting} />
                </DropdownMenu>
                <Link href={`/studio/${b.id}`} className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverFor(b)} alt="" className="aspect-[10/13] w-full object-cover" />
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">{b.title}</p>
                    <p className="mt-0.5 text-xs text-ink-3">
                      {BOOK_TYPE_LABEL[b.type]} · {b.pages.length} pages
                    </p>
                    <div className="mt-2">
                      {b.status === "generating" ? (
                        <Badge tone="warning">Generating…</Badge>
                      ) : (
                        <Badge tone="success">Ready</Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  <th className="w-10 px-3 py-2.5">
                    <Checkbox
                      aria-label="Select all on page"
                      checked={allSelected}
                      indeterminate={!allSelected && current.some((b) => selected.has(b.id))}
                      onCheckedChange={() =>
                        setSelected(
                          allSelected
                            ? new Set()
                            : new Set(current.map((b) => b.id)),
                        )
                      }
                    />
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-ink-3">Title</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-ink-3">Type</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-ink-3">Pages</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-ink-3">Status</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-ink-3">Edited</th>
                  <th className="w-10 px-2 py-2.5" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {current.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-3 py-2">
                      <Checkbox
                        aria-label={`Select ${b.title}`}
                        checked={selected.has(b.id)}
                        onCheckedChange={() => toggleSelect(b.id)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Link href={`/studio/${b.id}`} className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverFor(b)} alt="" className="h-9 w-7 rounded-sm border border-line object-cover" />
                        <span className="font-medium text-ink hover:text-primary">{b.title}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-ink-2">{BOOK_TYPE_LABEL[b.type]}</td>
                    <td className="px-3 py-2 text-ink-2">{b.pages.length}</td>
                    <td className="px-3 py-2">
                      {b.status === "generating" ? (
                        <Badge tone="warning">Generating…</Badge>
                      ) : (
                        <Badge tone="success">Ready</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2 text-ink-3">
                      {new Date(b.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button aria-label={`Actions for ${b.title}`} className="grid size-7 place-items-center rounded-sm text-ink-2 hover:bg-surface-3">
                            <MoreHorizontal className="size-4" aria-hidden />
                          </button>
                        </DropdownMenuTrigger>
                        <BookMenu book={b} onRename={(bk) => { setRenaming(bk); setRenameValue(bk.title); }} onDelete={setDeleting} />
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {pageCount > 1 && (
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="mt-6" />
        )}
      </div>

      {/* rename dialog */}
      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent className="w-[min(92vw,440px)]">
          <div className="p-6">
            <DialogTitle>Rename book</DialogTitle>
            <div className="mt-4">
              <Input
                aria-label="Book title"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
              <Button
                onClick={() => {
                  if (renaming && renameValue.trim())
                    actions.renameBook(renaming.id, renameValue.trim());
                  setRenaming(null);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* delete confirm */}
      <Dialog open={!!deleting || bulkDelete} onOpenChange={(o) => { if (!o) { setDeleting(null); setBulkDelete(false); } }}>
        <DialogContent className="w-[min(92vw,440px)]">
          <div className="p-6">
            <DialogTitle>
              Delete {bulkDelete ? `${selected.size} books` : deleting?.title}?
            </DialogTitle>
            <p className="mt-2 text-sm text-ink-2">
              This permanently removes the book and all its pages. This can&apos;t be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
              <Button
                variant="danger"
                onClick={() => {
                  if (bulkDelete) {
                    for (const id of selected) actions.deleteBook(id);
                    setSelected(new Set());
                    setBulkDelete(false);
                  } else if (deleting) {
                    actions.deleteBook(deleting.id);
                    setDeleting(null);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BookMenu({
  book,
  onRename,
  onDelete,
}: {
  book: Book;
  onRename: (b: Book) => void;
  onDelete: (b: Book) => void;
}) {
  const actions = useApp.getState();
  return (
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => onRename(book)}>
        <Pencil className="size-4" aria-hidden /> Rename
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => actions.duplicateBook(book.id)}>
        <Copy className="size-4" aria-hidden /> Duplicate
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => actions.archiveBook(book.id, !book.archived)}>
        {book.archived ? <ArchiveRestore className="size-4" aria-hidden /> : <Archive className="size-4" aria-hidden />}
        {book.archived ? "Restore" : "Archive"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem danger onClick={() => onDelete(book)}>
        <Trash2 className="size-4" aria-hidden /> Delete…
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
