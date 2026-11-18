"use client";

import { useState } from "react";
import {
  ChevronDown,
  ListTodo,
  Cloud,
  Copy,
  FileDown,
  FileText,
  Keyboard,
  Layers,
  ListPlus,
  Palette,
  PenLine,
  Pencil,
  Redo2,
  RotateCcw,
  Sparkles,
  Type,
  Undo2,
  Users,
  Images,
} from "lucide-react";
import Link from "next/link";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Kbd,
  Segmented,
  Tooltip,
} from "@/components/ui";
import { useApp } from "@/mocks/store";
import { useStudio, type StudioTool } from "@/lib/studio-store";
import { BookSetupDialog } from "./add-page-menu";

export function StudioTopbar({
  bookId,
  onUndo,
  onRedo,
}: {
  bookId: string;
  onUndo: () => void;
  onRedo: () => void;
}) {
  const book = useApp((s) => s.books.find((b) => b.id === bookId));
  const colorMode = useStudio((s) => s.colorMode);
  const setColorMode = useStudio((s) => s.setColorMode);
  const setFlag = useStudio((s) => s.setFlag);
  const bookMenuOpen = useStudio((s) => s.bookMenuOpen);
  const shortcutsOpen = useStudio((s) => s.shortcutsOpen);
  const taskTrayOpen = useStudio((s) => s.taskTrayOpen);
  const [saved] = useState<"saved" | "saving">("saved");
  const [setupOpen, setSetupOpen] = useState(false);

  if (!book) return null;

  return (
    <header className="flex h-[68px] shrink-0 items-center gap-2 border-b border-line bg-surface px-4">
      <Link
        href="/books"
        className="grid size-8 place-items-center rounded-sm text-ink-2 hover:bg-surface-3"
        aria-label="Back to My Books"
      >
        ←
      </Link>
      <h1 className="max-w-[26ch] truncate text-lg font-bold">{book.title}</h1>

      {/* Book menu (top, per F1 t0005) */}
      <DropdownMenu open={bookMenuOpen} onOpenChange={(o) => setFlag("bookMenuOpen", o)}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm" className="ml-2">
            Book <ChevronDown className="size-3.5" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>Book</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setSetupOpen(true)}>
            <Pencil className="size-4" aria-hidden /> Book setup
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFlag("addPageOpen", true)}>
            <ListPlus className="size-4" aria-hidden /> Add page…
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFlag("addPageOpen", true)}>
            <Layers className="size-4" aria-hidden /> Resize book
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Front pages</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setFlag("addPageOpen", true)}>
            <FileText className="size-4" aria-hidden /> Title & copyright pages
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFlag("addPageOpen", true)}>
            <RotateCcw className="size-4" aria-hidden /> Restore versions…
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setFlag("addPageOpen", true)}>
            <Type className="size-4" aria-hidden /> KDP listing text…
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFlag("addPageOpen", true)}>
            <Copy className="size-4" aria-hidden /> Difficulty copies…
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFlag("addPageOpen", true)}>
            <BookOpenish className="size-4" aria-hidden /> Volumes…
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setFlag("exportOpen", true)}>
            <FileDown className="size-4" aria-hidden /> Export…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Segmented
        ariaLabel="Color mode"
        className="ml-2"
        value={colorMode}
        onValueChange={setColorMode}
        options={[
          { value: "color", label: "Color", icon: <span className="size-3 rounded-full" style={{ background: "linear-gradient(135deg,#E8A24C,#5646D6)" }} /> },
          { value: "bw", label: "B&W", icon: <span className="size-3 rounded-full border border-line-strong bg-white" /> },
        ]}
      />

      <div className="ml-1 flex items-center gap-1">
        <Tooltip content="Undo"><Button variant="icon" size="sm" onClick={onUndo} aria-label="Undo"><Undo2 /></Button></Tooltip>
        <Tooltip content="Redo"><Button variant="icon" size="sm" onClick={onRedo} aria-label="Redo"><Redo2 /></Button></Tooltip>
      </div>

      <span className="ml-1 inline-flex items-center gap-1.5 text-sm text-ink-2" aria-live="polite">
        <Cloud className={`size-4 ${saved === "saved" ? "text-success" : "text-ink-3"}`} aria-hidden />
        {saved === "saved" ? "Saved" : "Saving…"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <Tooltip content="Keyboard shortcuts (UNOBSERVED in reference — placeholder overlay)">
          <Button variant="icon" size="sm" onClick={() => setFlag("shortcutsOpen", true)} aria-label="Keyboard shortcuts">
            <Keyboard />
          </Button>
        </Tooltip>
        <Tooltip content="Background tasks">
          <Button variant="icon" size="sm" onClick={() => setFlag("taskTrayOpen", !taskTrayOpen)} aria-label="Background tasks">
            <ListTodo />
          </Button>
        </Tooltip>
        <Button size="sm" onClick={() => setFlag("exportOpen", true)}>
          <FileDown className="size-4" aria-hidden /> Export
        </Button>
      </div>

      <BookSetupDialog bookId={bookId} open={setupOpen} onOpenChange={setSetupOpen} />

      <Dialog open={shortcutsOpen} onOpenChange={(o) => setFlag("shortcutsOpen", o)}>
        <DialogContent className="w-[min(92vw,420px)]">
          <div className="p-6">
            <DialogTitle>Keyboard shortcuts</DialogTitle>
            <p className="mt-1 text-sm text-ink-2">
              Reference overlay UNOBSERVED — placeholder set.
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {[
                ["Undo", ["⌘", "Z"]],
                ["Redo", ["⇧", "⌘", "Z"]],
                ["Delete element", ["⌫"]],
                ["Deselect", ["Esc"]],
                ["Zoom", ["⌘", "+ / −"]],
              ].map(([label, keys]) => (
                <li key={label as string} className="flex items-center justify-between">
                  <span>{label}</span>
                  <span className="flex gap-1">
                    {(keys as string[]).map((k) => <Kbd key={k}>{k}</Kbd>)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function BookOpenish({ className }: { className?: string }) {
  return <Layers className={className} aria-hidden />;
}

/* ------------------------------- Left rail ------------------------------- */

export const RAIL_ITEMS: {
  tool: StudioTool;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { tool: "pages", label: "Pages", icon: Layers },
  { tool: "elements", label: "Elements", icon: RailShapes },
  { tool: "text", label: "Text", icon: Type },
  { tool: "images", label: "Images", icon: Images },
  { tool: "draw", label: "Draw", icon: PenLine },
  { tool: "design", label: "Design", icon: Palette },
  { tool: "accents", label: "Accents", icon: Sparkles },
  { tool: "characters", label: "Characters", icon: Users },
];

function RailShapes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="8" cy="8" r="4" />
      <rect x="12" y="12" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function StudioRail() {
  const activeTool = useStudio((s) => s.activeTool);
  const setTool = useStudio((s) => s.setTool);
  return (
    <nav
      aria-label="Studio tools"
      className="flex w-[88px] shrink-0 flex-col gap-1 border-r border-line bg-surface py-3"
    >
      {RAIL_ITEMS.map((item, i) => {
        const active = activeTool === item.tool;
        const Icon = item.icon;
        return (
          <div key={item.tool}>
            {(i === 5 || i === 7) && <hr className="mx-4 my-1.5 border-line" />}
            <Tooltip content={item.label} side="right">
              <button
                onClick={() => setTool(item.tool)}
                aria-pressed={active}
                aria-label={item.label}
                className={`mx-2 flex h-16 w-[72px] flex-col items-center justify-center gap-1.5 rounded-md text-[11px] font-medium transition-colors duration-[var(--d-fast)] ${
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-ink-2 hover:bg-surface-3 hover:text-ink"
                }`}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </button>
            </Tooltip>
          </div>
        );
      })}
    </nav>
  );
}
