/** Typed domain models — the mock API layer (Phases 1–9) swaps to real
 * services in Phase 12 without touching components. */

export type BookType =
  | "kids-story"
  | "non-fiction"
  | "coloring"
  | "word-search"
  | "trivia"
  | "sudoku"
  | "math"
  | "color-by-number"
  | "journal"
  | "blank";

export type BookStatus = "draft" | "generating" | "ready" | "error";

export type PageType =
  | "title"
  | "copyright"
  | "art"
  | "text"
  | "picture"
  | "coloring"
  | "word-search"
  | "trivia"
  | "sudoku"
  | "math"
  | "prompt"
  | "answers";

export interface TrimSize {
  w: number;
  h: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  type: BookType;
  status: BookStatus;
  trim: TrimSize;
  bleed: boolean;
  colorMode: "color" | "bw";
  style: string;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
  tags?: string[];
  /** KDP listing copy (Book menu → KDP listing text) */
  listing?: { description: string; keywords: string[] };
}

export interface Page {
  id: string;
  type: PageType;
  label: string;
  scene: PageScene;
}

export interface PageScene {
  elements: SceneElement[];
}

export interface BaseElement {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  locked?: boolean;
  hidden?: boolean;
}

export interface TextElement extends BaseElement {
  kind: "text";
  text: string;
  fontSize: number;
  weight: 400 | 500 | 700;
  align: "left" | "center" | "right";
  color: string;
  fontFamily?: string;
}

export interface ImageElement extends BaseElement {
  kind: "image";
  src: string;
  alt?: string;
  /** pixels-per-inch note shown in the inspector (observed in F4 t0010) */
  storedDpi?: number;
  fit?: "contain" | "fill";
  history?: { id: string; src: string; note: string; at: string }[];
}

export interface ShapeElement extends BaseElement {
  kind: "shape";
  shape: "rect" | "ellipse" | "line" | "star" | "arrow" | "speech" | "frame" | "qr";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export type SceneElement = TextElement | ImageElement | ShapeElement;

/* ------------------------------- credits -------------------------------- */

export interface LedgerEntry {
  id: string;
  at: string;
  delta: number;
  reason: string;
  balanceAfter: number;
}

/* -------------------------------- tasks --------------------------------- */

export type TaskKind = "generate-book" | "edit-image" | "regenerate" | "export" | "cover";
export type TaskStatus = "queued" | "running" | "done" | "failed";

export interface Task {
  id: string;
  kind: TaskKind;
  title: string;
  status: TaskStatus;
  progress: number;
  createdAt: number;
  bookId?: string;
  resultNote?: string;
}

/* -------------------------------- assets -------------------------------- */

export interface ImageAsset {
  id: string;
  name: string;
  src: string;
  folder: string;
  tags: string[];
  w: number;
  h: number;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: "journal" | "planner" | "log" | "story" | "education";
  trim: TrimSize;
  pageCount: number;
  description: string;
  thumbHue: number;
}

/* --------------------------------- user --------------------------------- */

export interface User {
  name: string;
  email: string;
  plan: "Basic" | "Standard" | "Premium" | "Unlimited";
  credits: number;
}

export const BOOK_TYPE_LABEL: Record<BookType, string> = {
  "kids-story": "Kids story",
  "non-fiction": "Non-fiction",
  coloring: "Coloring book",
  "word-search": "Word search",
  trivia: "Trivia",
  sudoku: "Sudoku",
  math: "Math workbook",
  "color-by-number": "Color by number",
  journal: "Journal",
  blank: "Blank book",
};

export const CREDIT_COSTS: Partial<Record<BookType, string>> = {
  "kids-story": "Base: 8 credits (10 pages) + 1 credit per additional page",
  coloring: "10 credits for a 30-page book + 5 for an AI cover",
  "non-fiction": "6 credits (base) + 2 per regenerated chapter",
  trivia: "6 credits (24 pages)",
  sudoku: "Free — algorithm-generated",
  math: "Free — algorithm-generated",
  journal: "Free — templates use no credits",
  blank: "Free",
};
