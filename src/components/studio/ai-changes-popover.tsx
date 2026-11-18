"use client";

import { useState } from "react";
import {
  GripVertical,
  Paperclip,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  X,
  History,
  Crop,
  Replace,
  Palette,
} from "lucide-react";
import { Button, Chip } from "@/components/ui";
import { useApp } from "@/mocks/store";
import { useStudio } from "@/lib/studio-store";
import { resolveSrc } from "@/lib/resolve-src";
import { sceneArt } from "@/mocks/art";

const SUGGESTIONS = [
  "Make it more dramatic",
  "Brighten the scene",
  "Add more detail to the art",
  "Soften the colors",
];

/**
 * "AI changes · picture on page N" popover — observed F4 t0010: drag handle,
 * thumbnail, checking status, instruction box + Edit, References/Characters
 * chips, Regenerate/Color/History/Crop/Replace row. Nothing applies until
 * Keep (observed: "nothing changes until you click Keep").
 */
export function AiChangesPopover({
  bookId,
  pageId,
  elementId,
  anchor,
  onClose,
}: {
  bookId: string;
  pageId: string;
  elementId: string;
  /** position in the canvas container (px) */
  anchor: { x: number; y: number };
  onClose: () => void;
}) {
  const updatePageImage = useApp((s) => s.updatePageImage);
  const spend = useApp((s) => s.spend);
  const refund = useApp((s) => s.refund);
  const books = useApp((s) => s.books);
  const [instruction, setInstruction] = useState("");
  const [phase, setPhase] = useState<"idle" | "checking" | "compare">("idle");
  const [original, setOriginal] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0 });

  const book = books.find((b) => b.id === bookId);
  const page = book?.pages.find((p) => p.id === pageId);
  const el = page?.scene.elements.find((e) => e.id === elementId);
  if (!book || !page || !el || el.kind !== "image") return null;

  const runEdit = async () => {
    setPhase("checking");
    setOriginal(el.src);
    await new Promise((r) => setTimeout(r, 900));
    // Mock edit: seeded variation of the art.
    const next = `mock:art:${Math.floor(Math.random() * 5000)}`;
    setCandidate(next);
    setPhase("compare");
  };

  const regenerate = async () => {
    setPhase("checking");
    setOriginal(el.src);
    await new Promise((r) => setTimeout(r, 700));
    setCandidate(`mock:gen:${Math.floor(Math.random() * 5000)}`);
    setPhase("compare");
  };

  const keep = () => {
    const note = instruction.trim() || (phase === "compare" ? "AI edit" : "Regenerate");
    const ok = spend(1, `AI picture edit — ${book.title} page`);
    if (!ok) {
      onClose();
      return;
    }
    updatePageImage(bookId, pageId, elementId, { src: candidate! }, note);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label="AI changes"
      className="absolute z-[var(--z-panel)] w-[420px] rounded-lg border border-line bg-surface shadow-lg animate-pop-in"
      style={{ left: Math.max(8, anchor.x + drag.x), top: Math.max(8, anchor.y + drag.y) }}
    >
      <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
        <span
          className="cursor-grab text-ink-3"
          aria-hidden
          onPointerDown={(e) => {
            const startX = e.clientX;
            const startY = e.clientY;
            const move = (ev: PointerEvent) =>
              setDrag({ x: drag.x + ev.clientX - startX, y: drag.y + ev.clientY - startY });
            const up = () => {
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerup", up);
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
          }}
        >
          <GripVertical className="size-4" aria-hidden />
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={resolveSrc(el.src)} alt="" className="size-6 rounded-sm object-cover" />
        <p className="text-sm font-semibold">AI changes · picture on page</p>
        <button
          onClick={onClose}
          aria-label="Close AI changes"
          className="ml-auto grid size-7 place-items-center rounded-sm text-ink-2 hover:bg-surface-3"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="p-3.5">
        {phase === "checking" && (
          <p className="mb-3 flex items-center gap-2 text-sm text-ink-2" aria-live="polite">
            <span className="size-3.5 animate-spin rounded-full border-2 border-line border-t-primary" aria-hidden />
            Checking this picture against the story…
          </p>
        )}

        {phase === "compare" && original && candidate ? (
          <div className="mb-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-3">
              Compare — nothing applied until you Keep
            </p>
            <div className="grid grid-cols-2 gap-2">
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveSrc(original)} alt="Current picture" className="aspect-square w-full rounded-md border border-line object-cover" />
                <figcaption className="mt-1 text-center text-xs text-ink-3">Current</figcaption>
              </figure>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveSrc(candidate)} alt="New picture" className="aspect-square w-full rounded-md border-2 border-primary object-cover" />
                <figcaption className="mt-1 text-center text-xs text-primary font-medium">New</figcaption>
              </figure>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPhase("idle")}>
                Discard
              </Button>
              <Button size="sm" onClick={keep}>
                Keep · 1 credit
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-stretch gap-2">
              <input
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Describe what to change…"
                aria-label="Describe what to change"
                className="h-10 min-w-0 flex-1 rounded-md border border-line px-3 text-sm placeholder:text-ink-3 focus:border-primary focus:outline-none focus:shadow-focus"
              />
              <Button
                onClick={runEdit}
                disabled={!instruction.trim()}
                className="h-10 shrink-0 bg-accent hover:opacity-90"
                aria-label="Edit picture with AI"
              >
                <Sparkles className="size-4" aria-hidden /> Edit
              </Button>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              <Chip onClick={() => {}}>Paperclip references</Chip>
              <Chip onClick={() => {}}>
                <Users className="mr-1 inline size-3.5" aria-hidden /> Characters
              </Chip>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Button variant="secondary" size="sm" onClick={regenerate}>
                <RefreshCw className="size-3.5" aria-hidden /> Regenerate
              </Button>
              <Button variant="secondary" size="sm" disabled>
                <Palette className="size-3.5" aria-hidden /> Color
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowHistory(true)} disabled={(el.history?.length ?? 0) === 0}>
                <History className="size-3.5" aria-hidden /> History
              </Button>
              <Button variant="secondary" size="sm" disabled>
                <Crop className="size-3.5" aria-hidden /> Crop
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const ok = spend(1, `Regenerate — ${book.title}`);
                  if (!ok) return;
                  const next = sceneArt(Math.floor(Math.random() * 5000));
                  await new Promise((r) => setTimeout(r, 500));
                  updatePageImage(bookId, pageId, elementId, { src: `mock:gen:${Math.floor(Math.random() * 5000)}` }, "Regenerate");
                  void next;
                }}
              >
                <Replace className="size-3.5" aria-hidden /> Replace
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { refund(0, ""); onClose(); }} disabled>
                <Send className="size-3.5" aria-hidden /> Apply
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <Chip key={s} onClick={() => setInstruction(s)} className="text-xs">
                  {s}
                </Chip>
              ))}
            </div>
          </>
        )}

        {showHistory && (
          <div className="mt-3 rounded-md border border-line p-2.5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-3">History</p>
            {(el.history?.length ?? 0) === 0 ? (
              <p className="text-xs text-ink-3">No earlier versions yet.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {el.history!.map((h) => (
                  <li key={h.id} className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resolveSrc(h.src)} alt="" className="size-8 rounded-sm object-cover" />
                    <span className="min-w-0 flex-1 truncate text-xs text-ink-2">{h.note}</span>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="ghost" size="xs" className="mt-2" onClick={() => setShowHistory(false)}>
              Close history
            </Button>
          </div>
        )}

        <p className="mt-3 text-[11px] text-ink-3">
          Each AI picture action uses 1 credit; failed actions are refunded
          automatically.
        </p>
      </div>
    </div>
  );
}
