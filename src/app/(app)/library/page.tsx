"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  EmptyState,
  Input,
  Select,
  useToast,
} from "@/components/ui";
import { useApp } from "@/mocks/store";
import { coverArt } from "@/mocks/art";
import type { Template } from "@/mocks/types";

const CATEGORIES = [
  { value: "all", label: "All categories" },
  { value: "journal", label: "Journals" },
  { value: "planner", label: "Planners" },
  { value: "log", label: "Logs" },
  { value: "story", label: "Story frames" },
  { value: "education", label: "Education" },
];

export default function LibraryPage() {
  const templates = useApp((s) => s.templates);
  const createBook = useApp((s) => s.createBook);
  const { toast } = useToast();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [preview, setPreview] = useState<Template | null>(null);

  const filtered = templates.filter((t) => {
    if (cat !== "all" && t.category !== cat) return false;
    if (query.trim() && !t.name.toLowerCase().includes(query.trim().toLowerCase()))
      return false;
    return true;
  });

  const useTemplate = (t: Template) => {
    const book = createBook(
      { title: t.name, type: "journal", trim: t.trim, pageCount: Math.min(t.pageCount, 24), style: "Calm lines" },
      0,
    );
    toast({
      kind: "success",
      title: "Template copied",
      description: `“${t.name}” is open in the Studio — free, no credits.`,
    });
    router.push(`/studio/${book.id}`);
  };

  return (
    <>
      <Topbar title="Guides & templates" />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className="pl-9"
              aria-label="Search templates"
            />
          </div>
          <Select className="w-44" ariaLabel="Category" value={cat} onValueChange={setCat} options={CATEGORIES} />
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary-soft p-4">
          <Sparkles className="mt-0.5 size-4.5 text-primary" aria-hidden />
          <div>
            <p className="text-sm font-semibold">Templates and blank books are free</p>
            <p className="mt-0.5 text-sm text-ink-2">
              No AI, no credits — copy one and fill it in by hand or with the Studio tools.
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No matching templates" description="Try another category or search." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((t) => (
              <Card key={t.id} interactive className="overflow-hidden" onClick={() => setPreview(t)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverArt(t.name, t.thumbHue, false)} alt="" className="aspect-[10/13] w-full object-cover" />
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="mt-0.5 text-xs text-ink-3">
                    {t.trim.w}×{t.trim.h} in · {t.pageCount} pages
                  </p>
                  <Badge tone="success" className="mt-2">Free</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="w-[min(92vw,560px)]">
          {preview && (
            <div className="p-6">
              <DialogTitle>{preview.name}</DialogTitle>
              <p className="mt-2 text-sm text-ink-2">{preview.description}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverArt(preview.name, preview.thumbHue, false)}
                alt=""
                className="mx-auto mt-4 h-64 rounded-md border border-line object-cover"
              />
              <div className="mt-3 flex items-center justify-center gap-2">
                <Badge tone="neutral">{preview.trim.w}×{preview.trim.h} in</Badge>
                <Badge tone="neutral">{preview.pageCount} pages</Badge>
                <Badge tone="success">Free</Badge>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button onClick={() => useTemplate(preview)}>Use this template</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
