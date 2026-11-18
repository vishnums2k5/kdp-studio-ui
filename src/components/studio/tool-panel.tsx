"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Circle,
  Image as ImageIcon,
  Minus,
  PenTool,
  Square,
  Star,
  Type,
  Upload,
  Palette,
  Sparkles,
  Users,
  MessageSquare,
  Frame,
  QrCode,
  ArrowRight,
} from "lucide-react";
import { Button, Field, Slider, Select } from "@/components/ui";
import { useApp } from "@/mocks/store";
import { useStudio } from "@/lib/studio-store";
import { resolveSrc } from "@/lib/resolve-src";
import type { ShapeElement, TextElement, Page } from "@/mocks/types";

let elSeq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${++elSeq}`;

/** Left tool panels beyond Pages (Elements / Text / Images / Draw / Design /
 * Accents / Characters) — inventory per F1 text. */
export function ToolPanel({
  bookId,
  beforeMutation,
}: {
  bookId: string;
  beforeMutation: () => void;
}) {
  const tool = useStudio((s) => s.activeTool);
  const selectPage = useStudio((s) => s.selectPage);
  const selectedPageId = useStudio((s) => s.selectedPageId);
  const book = useApp.getState().book(bookId);
  if (!book) return null;
  const page: Page | undefined =
    book.pages.find((p) => p.id === selectedPageId) ?? book.pages[0];

  const addElement = (el: ShapeElement | TextElement) => {
    beforeMutation();
    if (!page) return;
    useApp.getState().updateScene(book.id, page.id, {
      elements: [...page.scene.elements, el],
    });
    useStudio.getState().selectElement(el.id);
    selectPage(page.id);
  };

  const addShape = (shape: ShapeElement["shape"], defaults: Partial<ShapeElement> = {}) => {
    addElement({
      id: uid("e"),
      kind: "shape",
      x: 200,
      y: 380,
      w: 120,
      h: 90,
      shape,
      stroke: "#1C1E26",
      strokeWidth: 2,
      fill: shape === "ellipse" ? "#D6DEF9" : undefined,
      ...defaults,
    });
  };

  const addText = (preset: "heading" | "paragraph" | "label") => {
    addElement({
      id: uid("e"),
      kind: "text",
      x: 96,
      y: preset === "heading" ? 120 : 420,
      w: 320,
      h: preset === "heading" ? 44 : 72,
      text:
        preset === "heading"
          ? "Double-click to edit"
          : preset === "paragraph"
            ? "Select this text and type to replace it. Keep it 0.25 in inside the trim."
            : "small label",
      fontSize: preset === "heading" ? 28 : preset === "paragraph" ? 14 : 11,
      weight: preset === "heading" ? 700 : 400,
      align: "center",
      color: "#1C1E26",
    } as TextElement);
  };

  return (
    <aside
      aria-label={`${tool} panel`}
      className="flex w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-line bg-surface p-4"
    >
      {tool === "elements" && (
        <>
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3">Elements</h2>
          <p className="text-xs text-ink-3">Drag equivalents: click to drop at page center.</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" onClick={() => addShape("line", { h: 4, w: 200 })}><Minus className="size-3.5" aria-hidden /> Line</Button>
            <Button variant="secondary" size="sm" onClick={() => addShape("rect", { fill: "#EEF0FC" })}><Square className="size-3.5" aria-hidden /> Rectangle</Button>
            <Button variant="secondary" size="sm" onClick={() => addShape("ellipse", { fill: "#FBE1EC" })}><Circle className="size-3.5" aria-hidden /> Circle</Button>
            <Button variant="secondary" size="sm" onClick={() => addShape("star", { fill: "#F4C542" })}><Star className="size-3.5" aria-hidden /> Star</Button>
            <Button variant="secondary" size="sm" onClick={() => addShape("arrow")}><ArrowRight className="size-3.5" aria-hidden /> Arrow</Button>
            <Button variant="secondary" size="sm" onClick={() => addShape("speech", { fill: "#FFFFFF" })}><MessageSquare className="size-3.5" aria-hidden /> Speech</Button>
            <Button variant="secondary" size="sm" onClick={() => addShape("frame", { strokeWidth: 6 })}><Frame className="size-3.5" aria-hidden /> Frame</Button>
            <Button variant="secondary" size="sm" onClick={() => addShape("qr", { fill: "#1C1E26" })}><QrCode className="size-3.5" aria-hidden /> QR code</Button>
          </div>
        </>
      )}

      {tool === "text" && (
        <>
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3">Text</h2>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={() => addText("heading")}><Type className="size-4" aria-hidden /> Heading</Button>
            <Button variant="secondary" onClick={() => addText("paragraph")}><Type className="size-4" aria-hidden /> Paragraph</Button>
            <Button variant="secondary" onClick={() => addText("label")}><Type className="size-4" aria-hidden /> Small label</Button>
          </div>
          <p className="text-xs text-ink-3">
            Double-click any text on the page to edit it in place.
          </p>
        </>
      )}

      {tool === "images" && <ImagesPanel bookId={bookId} pageId={page?.id} />}
      {tool === "draw" && <DrawPanel />}
      {tool === "design" && <DesignPanel bookId={bookId} />}
      {tool === "accents" && <AccentsPanel bookId={bookId} />}
      {tool === "characters" && <CharactersPanel bookId={bookId} />}
    </aside>
  );
}

function ImagesPanel({ bookId, pageId }: { bookId: string; pageId?: string }) {
  const images = useApp((s) => s.images);
  const addImage = useApp((s) => s.addImage);
  const updateScene = useApp((s) => s.updateScene);
  const book = useApp.getState().book(bookId);
  const page = book?.pages.find((p) => p.id === pageId);
  const [busy, setBusy] = useState(false);

  const place = (src: string) => {
    if (!book || !page) return;
    useStudio.getState().snapshot(JSON.stringify(book.pages.map((p) => p.scene)));
    updateScene(book.id, page.id, {
      elements: [
        ...page.scene.elements,
        {
          id: uid("e"),
          kind: "image",
          x: 136,
          y: 320,
          w: 240,
          h: 240,
          src,
          alt: "Placed image",
          storedDpi: 131,
        },
      ],
    });
  };

  return (
    <>
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3">Images</h2>
      <Button
        variant="secondary"
        onClick={async () => {
          setBusy(true);
          const asset = addImage({ name: `upload-${Date.now()}`, src: resolveSrc(`mock:art:${Math.floor(Math.random() * 900)}`), folder: "Uploads" });
          place(asset.src);
          setBusy(false);
        }}
        loading={busy}
      >
        <Upload className="size-4" aria-hidden /> Upload image
      </Button>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-3">Reuse book images</p>
        <div className="grid grid-cols-3 gap-2">
          {images.slice(0, 9).map((img) => (
            <button
              key={img.id}
              onClick={() => place(img.src)}
              className="overflow-hidden rounded-md border border-line hover:border-primary"
              aria-label={`Add ${img.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolveSrc(img.src)} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-3">Generate with AI</p>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => place(`mock:gen:${Math.floor(Math.random() * 900)}`)}
        >
          <Sparkles className="size-4 text-accent" aria-hidden /> Generate picture…
        </Button>
        <p className="mt-1.5 text-xs text-ink-3">Uses 1 credit when kept; previewing is free.</p>
      </div>
      <p className="text-xs text-ink-3">
        Images land on page {pageId ? "" : "1"}; drag to move, pull a corner to resize.
      </p>
    </>
  );
}

function DrawPanel() {
  const [size, setSize] = useState([4]);
  return (
    <>
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3">Draw</h2>
      <p className="text-sm text-ink-2">
        Freehand drawing on the canvas. (Pen tool scaffold — full drawing lands
        with canvas polish.)
      </p>
      <Field label={`Brush size (${size[0]} px)`}>
        <Slider value={size} min={1} max={24} onValueChange={setSize} />
      </Field>
      <Button variant="secondary" disabled>
        <PenTool className="size-4" aria-hidden /> Start drawing
      </Button>
      <p className="text-xs text-ink-3">
        Disabled — drawing requires canvas pointer capture shipping in the next
        pass (see known issues).
      </p>
    </>
  );
}

function DesignPanel({ bookId }: { bookId: string }) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  const updateBook = useApp((s) => s.updateBook);
  if (!book) return null;
  const styles = ["Classic", "Playful primer", "Large-print bold", "Bedtime story", "Kids look"];
  const trims = [
    { v: "8.5×8.5", label: "8.5 × 8.5 in", w: 8.5, h: 8.5 },
    { v: "8.5×11", label: "8.5 × 11 in", w: 8.5, h: 11 },
    { v: "6×9", label: "6 × 9 in", w: 6, h: 9 },
  ];
  return (
    <>
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3">Design</h2>
      <div>
        <p className="mb-2 text-sm font-medium">Whole-book styles</p>
        <div className="flex flex-col gap-1.5">
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => updateBook(book.id, { style: s })}
              className={`rounded-md border px-3.5 py-2 text-left text-sm transition-colors ${
                book.style === s ? "border-primary bg-primary-soft/50 font-medium" : "border-line hover:bg-surface-2"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-3">Styles update every page at once.</p>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Page size</p>
        <div className="flex flex-col gap-1.5">
          {trims.map((t) => (
            <button
              key={t.v}
              onClick={() => updateBook(book.id, { trim: { w: t.w, h: t.h } })}
              className={`rounded-md border px-3.5 py-2 text-left text-sm transition-colors ${
                book.trim.w === t.w && book.trim.h === t.h
                  ? "border-primary bg-primary-soft/50 font-medium"
                  : "border-line hover:bg-surface-2"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center justify-between rounded-md border border-line px-3.5 py-2.5 text-sm font-medium">
        Black &amp; white
        <input
          type="checkbox"
          checked={book.colorMode === "bw"}
          onChange={(e) => updateBook(book.id, { colorMode: e.target.checked ? "bw" : "color" })}
          className="size-4 accent-[rgb(var(--c-primary))]"
          aria-label="Black and white mode"
        />
      </label>
      <label className="flex items-center justify-between rounded-md border border-line px-3.5 py-2.5 text-sm font-medium">
        Bleed
        <input
          type="checkbox"
          checked={book.bleed}
          onChange={(e) => updateBook(book.id, { bleed: e.target.checked })}
          className="size-4 accent-[rgb(var(--c-primary))]"
          aria-label="Bleed"
        />
      </label>
    </>
  );
}

function AccentsPanel({ bookId }: { bookId: string }) {
  const book = useApp.getState().book(bookId);
  if (!book) return null;
  const place = (hue: number) => {
    const page = book.pages[0];
    if (!page) return;
    useStudio.getState().snapshot(JSON.stringify(book.pages.map((p) => p.scene)));
    useApp.getState().updateScene(book.id, page.id, {
      elements: [
        ...page.scene.elements,
        {
          id: uid("e"),
          kind: "shape",
          shape: "star",
          x: 430,
          y: 60,
          w: 60,
          h: 60,
          fill: `hsl(${hue} 70% 60%)`,
          stroke: "none",
          strokeWidth: 0,
        },
      ],
    });
  };
  return (
    <>
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3">Accents</h2>
      <p className="text-sm text-ink-2">
        Margin ornaments placed to avoid puzzles and clues.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {["Autumn", "Ocean", "Garden", "Sky"].map((theme, i) => (
          <Button key={theme} variant="secondary" size="sm" onClick={() => place(i * 70 + 40)}>
            {theme} corners
          </Button>
        ))}
      </div>
    </>
  );
}

function CharactersPanel({ bookId }: { bookId: string }) {
  const book = useApp.getState().book(bookId);
  const images = useApp((s) => s.images);
  if (!book) return null;
  return (
    <>
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3">Characters</h2>
      <p className="text-sm text-ink-2">
        Pick characters so AI edits keep them looking the same across pages.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {images.slice(0, 6).map((img) => (
          <button
            key={img.id}
            onClick={() => useStudio.getState().openAiPopover(book.pages[0]!.id, book.pages[0]!.scene.elements.find((e) => e.kind === "image")?.id ?? "")}
            className="overflow-hidden rounded-md border border-line hover:border-primary"
            aria-label={`Use character ${img.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resolveSrc(img.src)} alt="" className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
      <p className="inline-flex items-center gap-1 text-xs text-ink-3">
        Select a picture on the page first, then choose a character. <ArrowUpRight className="size-3" aria-hidden />
      </p>
    </>
  );
}

export { ImageIcon, Palette };
