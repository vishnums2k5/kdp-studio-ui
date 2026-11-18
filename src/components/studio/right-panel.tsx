"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  Crop,
  FlipHorizontal2,
  FlipVertical2,
  Info,
  Sparkles,
  TriangleAlert,
  Check,
  Replace,
  Undo2,
} from "lucide-react";
import {
  Badge,
  Button,
  Field,
  Input,
  Slider,
  Switch,
  Checkbox,
} from "@/components/ui";
import { useApp } from "@/mocks/store";
import { useStudio } from "@/lib/studio-store";
import { kdpCheck, kdpFixCount } from "@/lib/kdp";
import { resolveSrc } from "@/lib/resolve-src";
import type { ImageElement, TextElement } from "@/mocks/types";

/** Right panel: default = book summary + KDP check (F1 t0005); with a
 * selected element = contextual inspector (F4 t0010). */
export function RightPanel({ bookId }: { bookId: string }) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  const selectedId = useStudio((s) => s.selectedElementId);
  const selectedPageId = useStudio((s) => s.selectedPageId);
  const setFlag = useStudio((s) => s.setFlag);
  const openAiPopover = useStudio((s) => s.openAiPopover);
  const updateBook = useApp((s) => s.updateBook);
  const appendPages = useApp((s) => s.appendPages);

  if (!book) return null;
  const page = book.pages.find((p) => p.id === selectedPageId);
  const el =
    selectedId && page
      ? (page.scene.elements.find((e) => e.id === selectedId) ?? null)
      : null;

  if (el && el.kind === "image" && page) {
    return <PictureInspector bookId={bookId} el={el} />;
  }
  if (el && el.kind === "text" && page) {
    return <TextInspector bookId={bookId} pageId={page.id} el={el} />;
  }

  const checks = kdpCheck(book);
  const fixes = kdpFixCount(checks);

  return (
    <aside
      aria-label="Book panel"
      className="flex w-[340px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-line bg-surface p-4"
    >
      <div>
        <h2 className="text-lg font-bold">{book.title}</h2>
        <p className="mt-0.5 text-sm text-ink-3">
          {book.pages.length} pages · {book.trim.w} × {book.trim.h} in ·{" "}
          {book.bleed ? "with bleed" : "no bleed"} ·{" "}
          {useStudio.getState().colorMode === "bw" ? "B&W" : "color"}
        </p>
        <p className="mt-3 text-sm text-ink-2">
          Click anything on a page to change it; drag to move, pull a corner to
          resize, double-click text to edit. Right-click for more.
        </p>
      </div>

      <div
        className={`rounded-lg border p-4 ${
          fixes > 0
            ? "border-warning-strong/40 bg-warning-soft"
            : "border-success/30 bg-success-soft"
        }`}
        aria-label="KDP check"
      >
        <div className="flex items-center gap-2">
          <TriangleAlert className="size-4.5 text-warning-strong" aria-hidden />
          <p className="text-sm font-bold">
            {fixes > 0
              ? `${fixes} thing${fixes > 1 ? "s" : ""} to fix before KDP`
              : "No problems found"}
          </p>
        </div>
        <p className="mt-1.5 text-xs text-ink-2">
          KDP&apos;s published trim, bleed, margin and page-count rules.
          Amazon&apos;s Previewer makes the final check when you upload.
        </p>
        <ul className="mt-3 flex flex-col gap-3">
          {checks.map((c) => (
            <li key={c.id} className="flex gap-2.5">
              <span className="mt-0.5 shrink-0">
                {c.level === "pass" ? (
                  <Check className="size-4 text-success" aria-hidden />
                ) : c.level === "fix" ? (
                  <TriangleAlert className="size-4 text-warning-strong" aria-hidden />
                ) : (
                  <Info className="size-4 text-info" aria-hidden />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{c.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-2">{c.detail}</p>
                {c.action && (
                  <Button
                    variant="ghost"
                    size="xs"
                    className="mt-1 text-primary underline"
                    onClick={() => {
                      if (c.action!.kind === "add-notes") {
                        const need = 24 - book.pages.length;
                        appendPages(
                          book.id,
                          Array.from({ length: Math.max(need, 0) }, (_, i) => ({
                            id: `notes-${book.id}-${i}-${Math.random().toString(36).slice(2, 6)}`,
                            type: "prompt" as const,
                            label: `Notes ${i + 1}`,
                            scene: { elements: [] },
                          })),
                        );
                      } else {
                        setFlag("bookMenuOpen", true);
                      }
                    }}
                  >
                    {c.action.label}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-line p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
          Book details
        </p>
        <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-ink-3">Author</dt>
          <dd className="font-medium">{book.author || "—"}</dd>
          <dt className="text-ink-3">Style</dt>
          <dd className="font-medium">{book.style}</dd>
          <dt className="text-ink-3">Front pages</dt>
          <dd className="font-medium">
            <button className="text-primary hover:underline" onClick={() => updateBook(book.id, {})}>
              6 front pages off
            </button>
          </dd>
        </dl>
        <Badge tone="neutral" className="mt-3">
          The preview on the right is the exact file you&apos;ll download
        </Badge>
      </div>

      {/* hidden placeholder to keep openAiPopover referenced for future image select flows */}
      <span className="hidden" onClick={() => openAiPopover("", "")} />
    </aside>
  );
}

function PictureInspector({ bookId, el }: { bookId: string; el: ImageElement }) {
  const updateSceneFor = useApp((s) => s.updateScene);
  const selectedPageId = useStudio((s) => s.selectedPageId);
  const book = useApp.getState().book(bookId);
  const target = book?.pages.find((p) => p.id === selectedPageId);
  const [trim, setTrim] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const [fillFrame, setFillFrame] = useState(false);
  const [desc, setDesc] = useState(el.alt ?? "");

  const commit = (patch: Partial<ImageElement>) => {
    if (!book || !target) return;
    updateSceneFor(book.id, target.id, {
      elements: target.scene.elements.map((e) => (e.id === el.id ? ({ ...e, ...patch } as ImageElement) : e)),
    });
  };

  return (
    <aside
      aria-label="Picture inspector"
      className="flex w-[340px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-line bg-surface p-4"
    >
      <h2 className="text-lg font-bold">Picture</h2>
      <div className="rounded-md bg-success-soft px-3.5 py-3 text-sm text-success">
        {Math.round(((el.w / 96) / (book?.trim.w ?? 8.5)) * (el.storedDpi ?? 131))}{" "}
        pixels per inch at this size in the PDF (stored at {el.storedDpi ?? 131};
        page art is enlarged for print, as the classic export does): prints sharp.
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => openFor(el.id)}>
          <Sparkles className="size-4" aria-hidden /> AI changes
        </Button>
        <Button variant="secondary" size="sm" onClick={() => commit({ src: resolveSrc(`mock:gen:${Math.floor(Math.random() * 500)}`) })}>
          <Replace className="size-4" aria-hidden /> Replace
        </Button>
        <Button variant="secondary" size="sm"><Crop className="size-4" aria-hidden /> Crop</Button>
        <Button variant="secondary" size="sm" onClick={() => commit({ src: flipDataUrl(el.src, "h") })}>
          <FlipHorizontal2 className="size-4" aria-hidden /> Flip
        </Button>
        <Button variant="secondary" size="sm" onClick={() => commit({ src: flipDataUrl(el.src, "v") })}>
          <FlipVertical2 className="size-4" aria-hidden /> Flip vertical
        </Button>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <Checkbox checked={fillFrame} onCheckedChange={(v) => setFillFrame(!!v)} id="fill-frame" />
        <span>
          <span className="font-medium">Fill the frame</span>
          <span className="block text-xs text-ink-2">
            Crop the picture to the frame&apos;s shape instead of showing all of it. The
            original picture is kept.
          </span>
        </span>
      </label>

      {(["left", "top", "right", "bottom"] as const).map((side) => (
        <Field key={side} label={`Trim ${side}`}>
          <div className="flex items-center gap-3">
            <Slider
              className="flex-1"
              value={[trim[side]]}
              max={50}
              onValueChange={(v: number[]) => setTrim((t) => ({ ...t, [side]: v[0] ?? 0 }))}
            />
            <span className="w-10 text-right text-sm text-ink-2">{trim[side]}%</span>
          </div>
        </Field>
      ))}

      <Field label="Description (for accessibility)">
        <Input value={desc} onChange={(e) => { setDesc(e.target.value); commit({ alt: e.target.value }); }} />
      </Field>

      <div>
        <p className="text-sm font-bold">Position</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {([
            ["X", el.x], ["Y", el.y], ["W", el.w], ["H", el.h],
          ] as const).map(([k, v]) => (
            <label key={k} className="flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-sm">
              <span className="text-ink-3">{k}</span>
              <input
                aria-label={`Position ${k} in inches`}
                type="number"
                step={0.1}
                defaultValue={(v / 96).toFixed(2)}
                className="w-full bg-transparent text-right focus:outline-none"
                onChange={(e) => {
                  const inches = Number(e.target.value) || 0;
                  const px = Math.round(inches * 96);
                  if (k === "X") commit({ x: px });
                  if (k === "Y") commit({ y: px });
                  if (k === "W") commit({ w: Math.max(16, px) });
                  if (k === "H") commit({ h: Math.max(16, px) });
                }}
              />
              <span className="text-ink-3">in</span>
            </label>
          ))}
        </div>
      </div>

      {(el.history?.length ?? 0) > 0 && (
        <div>
          <p className="text-sm font-bold">History</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {el.history!.slice(0, 5).map((h) => (
              <li key={h.id} className="flex items-center gap-2 rounded-md border border-line p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveSrc(h.src)} alt="" className="size-10 rounded-sm object-cover" />
                <span className="min-w-0 flex-1 truncate text-xs text-ink-2">{h.note}</span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => commit({ src: h.src })}
                  aria-label="Restore this version"
                >
                  <Undo2 className="size-3.5" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

function openFor(elementId: string) {
  const { selectedPageId, openAiPopover } = useStudio.getState();
  if (selectedPageId) openAiPopover(selectedPageId, elementId);
}

/** Flip helper: CSS-free canvas-less flip by re-encoding the SVG with a transform. */
function flipDataUrl(src: string, axis: "h" | "v"): string {
  if (!src.startsWith("data:image/svg+xml")) return src;
  const comma = src.indexOf(",");
  const svg = decodeURIComponent(src.slice(comma + 1));
  const flipped = svg.replace(
    /<svg([^>]*)>/,
    `<svg$1><g transform="${axis === "h" ? "scale(-1,1) translate(-300,0)" : "scale(1,-1) translate(0,-300)"}">`,
  ).replace(/<\/svg>/, "</g></svg>");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(flipped)}`;
}

function TextInspector({
  bookId,
  pageId,
  el,
}: {
  bookId: string;
  pageId: string;
  el: TextElement;
}) {
  const updateScene = useApp((s) => s.updateScene);
  const book = useApp.getState().book(bookId);
  const page = book?.pages.find((p) => p.id === pageId);

  const commit = (patch: Partial<TextElement>) => {
    if (!book || !page) return;
    updateScene(book.id, pageId, {
      elements: page.scene.elements.map((e) => (e.id === el.id ? ({ ...e, ...patch } as TextElement) : e)),
    });
  };

  return (
    <aside
      aria-label="Text inspector"
      className="flex w-[340px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-line bg-surface p-4"
    >
      <h2 className="text-lg font-bold">Text</h2>
      <Field label="Content">
        <textarea
          value={el.text}
          onChange={(e) => commit({ text: e.target.value })}
          className="min-h-24 w-full rounded-md border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none focus:shadow-focus"
        />
      </Field>
      <Field label={`Font size (${el.fontSize} pt)`}>
        <Slider
          value={[el.fontSize]}
          min={8}
          max={72}
          onValueChange={(v) => commit({ fontSize: v[0] ?? el.fontSize })}
        />
      </Field>
      <div>
        <p className="mb-1.5 text-sm font-medium">Weight</p>
        <div className="flex gap-2">
          {([400, 500, 700] as const).map((w) => (
            <Button
              key={w}
              size="sm"
              variant={el.weight === w ? "primary" : "secondary"}
              onClick={() => commit({ weight: w })}
            >
              {w === 400 ? "Regular" : w === 500 ? "Medium" : "Bold"}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium">Align</p>
        <div className="flex gap-2">
          {(["left", "center", "right"] as const).map((a) => (
            <Button
              key={a}
              size="sm"
              variant={el.align === a ? "primary" : "secondary"}
              onClick={() => commit({ align: a })}
            >
              <ArrowLeftRight className="size-3.5" aria-hidden /> {a}
            </Button>
          ))}
        </div>
      </div>
      <label className="flex items-center justify-between text-sm font-medium">
        Locked
        <Switch checked={!!el.locked} onCheckedChange={(v) => commit({ locked: v })} aria-label="Lock element" />
      </label>
    </aside>
  );
}
