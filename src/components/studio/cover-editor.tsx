"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Download, FileDown, HelpCircle, Pencil } from "lucide-react";
import { Badge, Button, Chip, Input, Switch, Field, Textarea, useToast, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { coverArt } from "@/mocks/art";
import { resolveSrc } from "@/lib/resolve-src";
import { useApp } from "@/mocks/store";
import { PageThumb } from "@/components/studio/scene-preview";

/** Cover editor (`/studio/<id>/cover`) — structure per F3 t0080: top bar
 * (← Library, title+author, Editing pill, Tutorial/Front/Back/Full PDF),
 * spread preview with BACK | spine | FRONT, suggestion chips, AI prompt bar,
 * right panel "Cover settings" with Edit|Details tabs. */
export function CoverEditor({ bookId }: { bookId: string }) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  if (!book) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <Link href="/books" className="text-sm text-primary hover:underline">
          Book not found — back to My Books
        </Link>
      </div>
    );
  }

  const spineTooThin = book.pages.length < 79;
  const firstArt = book.pages.find((p) => p.scene.elements.some((e) => e.kind === "image"));

  return <CoverEditorInner bookId={bookId} spineTooThin={spineTooThin} firstArtSrc={firstArt ? resolveSrc((firstArt.scene.elements.find((e) => e.kind === "image") as { src: string }).src) : ""} />;
}


function CoverEditorInner({
  bookId,
  spineTooThin,
  firstArtSrc,
}: {
  bookId: string;
  spineTooThin: boolean;
  firstArtSrc: string;
}) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  const updateBook = useApp((s) => s.updateBook);
  const spend = useApp((s) => s.spend);
  const addTask = useApp((s) => s.addTask);
  const patchTask = useApp((s) => s.patchTask);
  const { toast } = useToast();
  const [tab, setTab] = useState("edit");
  const [target, setTarget] = useState<"front" | "back">("front");
  const [hideSpine, setHideSpine] = useState(spineTooThin);
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [variant, setVariant] = useState(0);
  void firstArtSrc;

  if (!book) return null;
  const cover = coverArt(book.title, book.title.length + variant, book.colorMode === "bw");

  const generate = async () => {
    setBusy(true);
    const ok = spend(5, `AI cover — ${book.title}`);
    if (!ok) {
      toast({ kind: "warning", title: "Not enough credits", description: "An AI cover uses 5 credits." });
      setBusy(false);
      return;
    }
    const task = addTask("cover", `Generating cover — ${book.title}`, book.id);
    await new Promise((r) => setTimeout(r, 1100));
    patchTask(task.id, { status: "done", progress: 100, resultNote: "Front + back + spine" });
    setVariant((v) => v + 1);
    setBusy(false);
    toast({ kind: "success", title: "Cover generated", description: "Adjust with a prompt below, then Full PDF." });
  };

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-line bg-surface px-5">
        <Link href={`/studio/${bookId}`} className="inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-ink">
          ← Library
        </Link>
        <div>
          <h1 className="text-lg font-bold leading-tight">{book.title}</h1>
          <p className="text-xs text-ink-3">by {book.author}</p>
        </div>
        <Badge tone="info" className="ml-1">
          <Pencil className="size-3" aria-hidden /> Editing
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled>
            <HelpCircle className="size-4" aria-hidden /> Tutorial
          </Button>
          <Button variant="secondary" size="sm" disabled={!hideSpine}>
            <Download className="size-4" aria-hidden /> Front
          </Button>
          <Button variant="secondary" size="sm" disabled={!hideSpine}>
            <Download className="size-4" aria-hidden /> Back
          </Button>
          <Button size="sm" onClick={() => setTab("details")}>
            <FileDown className="size-4" aria-hidden /> Full PDF
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col items-center gap-4 overflow-y-auto px-8 py-6">
          {/* spread preview: BACK | spine | FRONT */}
          <div className="flex items-stretch" aria-label="Cover spread preview">
            <div className="relative w-[300px] overflow-hidden rounded-l-md border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="Back cover" className="size-full scale-x-[-1] object-cover" />
              <span className="absolute bottom-2 left-3 text-xs font-bold text-white drop-shadow">BACK</span>
            </div>
            <div
              role="img"
              className="relative flex w-[46px] items-center justify-center"
              style={{ background: hideSpine ? "#5A5E6E" : "#7C3AED" }}
              aria-label={hideSpine ? "Spine — plain (too thin for text)" : "Spine"}
            >
              {!hideSpine && (
                <span className="whitespace-nowrap text-[11px] font-bold text-white [writing-mode:vertical-rl]">
                  {book.title} · {book.author}
                </span>
              )}
            </div>
            <div className="relative w-[300px] overflow-hidden rounded-r-md border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="Front cover" className="size-full object-cover" />
              <span className="absolute bottom-2 right-3 text-xs font-bold text-white drop-shadow">FRONT</span>
            </div>
          </div>

          {/* suggestion chips (observed F3) */}
          <div className="flex max-w-full flex-wrap justify-center gap-2">
            {["Make it more dramatic", "Darken the background", "Make colors more vibrant", "Add more detail to the art"].map((s) => (
              <Chip key={s} onClick={() => setInstruction(s)}>
                {s}
              </Chip>
            ))}
          </div>

          {/* AI prompt bar (observed F3) */}
          <div className="w-full max-w-2xl">
            <Textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={`Describe changes to the ${target} cover... e.g. "make it more dramatic"`}
              aria-label="Cover change prompt"
            />
            <div className="mt-2 flex items-center gap-2">
              <div className="inline-flex items-center rounded-md border border-line bg-surface p-0.5">
                {(["front", "back"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTarget(t)}
                    aria-pressed={target === t}
                    className={`h-7 rounded-sm px-3 text-sm font-medium capitalize transition-colors ${
                      target === t ? "bg-primary text-on-primary" : "text-ink-2 hover:bg-surface-3"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <Button className="ml-auto" loading={busy} onClick={generate}>
                Generate {target} cover
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-ink-2">
              Drop or paste images · Shift+Enter for a new line · AI cover: 5 credits
            </p>
          </div>
        </main>

        <aside aria-label="Cover settings" className="w-[340px] shrink-0 overflow-y-auto border-l border-line bg-surface p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-3">Cover settings</h2>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full">
              <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-3 flex flex-col gap-4">
              {[
                { label: "FRONT COVER", regen: "front" },
                { label: "BACK COVER", regen: "back" },
              ].map((sec) => (
                <div key={sec.label}>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-ink-3">{sec.label}</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" disabled>
                      <Pencil className="size-3.5" aria-hidden /> Paint Edit
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1" onClick={generate} loading={busy}>
                      Regenerate
                    </Button>
                  </div>
                </div>
              ))}
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-ink-3">BOTH COVERS</p>
                <Button variant="secondary" size="sm" className="w-full" onClick={generate} loading={busy}>
                  Regenerate Both · 2 credits
                </Button>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-ink-3">SPINE</p>
                <div className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 text-sm">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <span className="size-4 rounded-sm" style={{ background: "#7C3AED" }} aria-hidden /> Spine Color
                  </span>
                  <span className="text-xs text-ink-3">#7C3AED</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-sm font-medium">Hide Spine Text</span>
                  <Switch checked={hideSpine} onCheckedChange={setHideSpine} aria-label="Hide spine text" />
                </div>
                {spineTooThin && (
                  <p className="mt-1.5 text-xs text-warning">
                    With {book.pages.length} pages, KDP spine text is below the minimum — keep it hidden.
                  </p>
                )}
                <Field label="Spine title (optional)" className="mt-3">
                  <Input defaultValue={book.title} aria-label="Spine title" />
                </Field>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-3 flex flex-col gap-3">
              <div className="rounded-md border border-line p-3.5 text-sm">
                <p className="flex items-center gap-2 font-semibold text-success">
                  <CheckCircle2 className="size-4" aria-hidden /> KDP readiness
                </p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                  <dt className="text-ink-3">Trim size</dt><dd className="font-medium">{book.trim.w} × {book.trim.h} in</dd>
                  <dt className="text-ink-3">Page count</dt><dd className="font-medium">{book.pages.length}</dd>
                  <dt className="text-ink-3">Spine width</dt><dd className="font-medium">{(book.pages.length * 0.06).toFixed(2)} in</dd>
                  <dt className="text-ink-3">Bleed</dt><dd className="font-medium">{book.bleed ? "0.125 in" : "none"}</dd>
                </dl>
              </div>
              <Button
                onClick={() => {
                  toast({
                    kind: "success",
                    title: "Full cover PDF",
                    description: "Front, back and spine assembled (mock export).",
                  });
                }}
              >
                <FileDown className="size-4" aria-hidden /> Download Full PDF
              </Button>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}
