"use client";

import { create } from "zustand";
import type {
  Book,
  BookType,
  ImageAsset,
  LedgerEntry,
  Page,
  PageScene,
  PageType,
  Task,
  Template,
  TrimSize,
  User,
} from "./types";
import {
  seedBooks,
  seedImages,
  seedLedger,
  seedTemplates,
  seedUser,
} from "./data";
import { sceneArt } from "./art";

let counter = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++counter}`;

export interface NewBookSpec {
  title: string;
  type: BookType;
  trim: TrimSize;
  pageCount: number;
  author?: string;
  style?: string;
  colorMode?: "color" | "bw";
}

interface AppState {
  user: User;
  books: Book[];
  ledger: LedgerEntry[];
  tasks: Task[];
  images: ImageAsset[];
  templates: Template[];

  /* derived */
  balance: () => number;

  /* books */
  book: (id: string) => Book | undefined;
  createBook: (spec: NewBookSpec, spendCredits: number) => Book;
  updateBook: (id: string, patch: Partial<Book>) => void;
  renameBook: (id: string, title: string) => void;
  deleteBook: (id: string) => void;
  duplicateBook: (id: string) => Book | undefined;
  archiveBook: (id: string, archived: boolean) => void;
  addPage: (bookId: string, type: PageType, label?: string) => Page | undefined;
  duplicatePage: (bookId: string, pageId: string) => void;
  deletePage: (bookId: string, pageId: string) => void;
  movePage: (bookId: string, pageId: string, dir: -1 | 1) => void;
  updateScene: (bookId: string, pageId: string, scene: PageScene) => void;
  appendPages: (bookId: string, pages: Page[]) => void;
  updatePageImage: (
    bookId: string,
    pageId: string,
    elementId: string,
    next: { src?: string; alt?: string },
    historyNote: string,
  ) => void;

  /* credits */
  spend: (amount: number, reason: string) => boolean;
  refund: (amount: number, reason: string) => void;
  grant: (amount: number, reason: string) => void;

  /* tasks */
  addTask: (kind: Task["kind"], title: string, bookId?: string) => Task;
  patchTask: (id: string, patch: Partial<Task>) => void;

  /* images */
  addImage: (img: Pick<ImageAsset, "name" | "src" | "folder">) => ImageAsset;
  deleteImages: (ids: string[]) => void;
  tagImage: (id: string, tags: string[]) => void;
}

function blankScene(): PageScene {
  return { elements: [] };
}

function seededScene(type: PageType, label: string, seed: number): PageScene {
  // Minimal starter scenes; the studio renders them exactly.
  if (type === "art" || type === "picture" || type === "coloring") {
    return {
      elements: [
        {
          id: uid("e"),
          kind: "text",
          x: 26,
          y: 36,
          w: 460,
          h: 36,
          text: label,
          fontSize: 24,
          weight: 700,
          align: "center",
          color: "#1C1E26",
        },
        {
          id: uid("e"),
          kind: "image",
          x: 96,
          y: 110,
          w: 320,
          h: 320,
          src: `mock:art:${seed}`,
          alt: label,
          storedDpi: 131,
        },
      ],
    };
  }
  return { elements: [] };
}

/** Resolve a "mock:art:<seed>" src into a data URI at render time. */
export function resolveArtSrc(src: string): string {
  if (src.startsWith("mock:art:")) {
    const seed = Number(src.slice("mock:art:".length)) || 1;
    return sceneArt(seed);
  }
  return src;
}

export const useApp = create<AppState>((set, get) => ({
  user: seedUser,
  books: seedBooks,
  ledger: seedLedger,
  tasks: [],
  images: seedImages,
  templates: seedTemplates,

  balance: () => get().user.credits,
  book: (id) => get().books.find((b) => b.id === id),

  createBook: (spec, spendCredits) => {
    const id = uid("book");
    const now = new Date().toISOString();
    const pages: Page[] = [];
    if (spendCredits > 0) {
      // AI flows start with a title page and stream the rest in.
      pages.push({
        id: uid("p"),
        type: "title",
        label: "Title page",
        scene: {
          elements: [
            {
              id: uid("e"),
              kind: "text",
              x: 26,
              y: 200,
              w: 460,
              h: 60,
              text: spec.title,
              fontSize: 34,
              weight: 700,
              align: "center",
              color: "#1C1E26",
            },
            {
              id: uid("e"),
              kind: "text",
              x: 26,
              y: 268,
              w: 460,
              h: 28,
              text: spec.author || "KDP Studio",
              fontSize: 16,
              weight: 400,
              align: "center",
              color: "#5A5E6E",
            },
          ],
        },
      });
    } else {
      for (let i = 0; i < spec.pageCount; i++) {
        pages.push({
          id: uid("p"),
          type: i === 0 ? "title" : "text",
          label: i === 0 ? "Title page" : `Page ${i + 1}`,
          scene: blankScene(),
        });
      }
    }
    const book: Book = {
      id,
      title: spec.title,
      author: spec.author || "KDP Studio",
      type: spec.type,
      status: spendCredits > 0 ? "generating" : "ready",
      trim: spec.trim,
      bleed: true,
      colorMode: spec.colorMode ?? "color",
      style: spec.style || "Classic",
      pages,
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({
      books: [book, ...s.books],
      user: spendCredits > 0
        ? { ...s.user, credits: s.user.credits - spendCredits }
        : s.user,
      ledger:
        spendCredits > 0
          ? [
              {
                id: uid("l"),
                at: now,
                delta: -spendCredits,
                reason: `${spec.title} — create book`,
                balanceAfter: s.user.credits - spendCredits,
              },
              ...s.ledger,
            ]
          : s.ledger,
    }));
    return book;
  },

  updateBook: (id, patch) =>
    set((s) => ({
      books: s.books.map((b) =>
        b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b,
      ),
    })),

  renameBook: (id, title) => get().updateBook(id, { title }),

  deleteBook: (id) => set((s) => ({ books: s.books.filter((b) => b.id !== id) })),

  duplicateBook: (id) => {
    const src = get().book(id);
    if (!src) return undefined;
    const copy: Book = {
      ...structuredClone(src),
      id: uid("book"),
      title: `${src.title} (copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ books: [copy, ...s.books] }));
    return copy;
  },

  archiveBook: (id, archived) => get().updateBook(id, { archived }),

  addPage: (bookId, type, label) => {
    const book = get().book(bookId);
    if (!book) return undefined;
    const n = book.pages.length + 1;
    const resolvedLabel =
      label ?? (type === "answers" ? "Answers" : `Page ${n}`);
    const page: Page = {
      id: uid("p"),
      type,
      label: resolvedLabel,
      scene: seededScene(type, resolvedLabel, Math.floor(Math.random() * 1000)),
    };
    get().updateBook(bookId, { pages: [...book.pages, page] });
    return page;
  },

  duplicatePage: (bookId, pageId) => {
    const book = get().book(bookId);
    if (!book) return;
    const idx = book.pages.findIndex((p) => p.id === pageId);
    if (idx < 0) return;
    const src = book.pages[idx];
    if (!src) return;
    const copy: Page = {
      ...structuredClone(src),
      id: uid("p"),
      scene: {
        elements: src.scene.elements.map((e) => ({
          ...structuredClone(e),
          id: uid("e"),
        })),
      },
    };
    const pages = [...book.pages];
    pages.splice(idx + 1, 0, copy);
    get().updateBook(bookId, { pages });
  },

  deletePage: (bookId, pageId) => {
    const book = get().book(bookId);
    if (!book) return;
    get().updateBook(bookId, {
      pages: book.pages.filter((p) => p.id !== pageId),
    });
  },

  movePage: (bookId, pageId, dir) => {
    const book = get().book(bookId);
    if (!book) return;
    const idx = book.pages.findIndex((p) => p.id === pageId);
    const next = idx + dir;
    if (idx < 0 || next < 0 || next >= book.pages.length) return;
    const a = book.pages[idx];
    const b = book.pages[next];
    if (!a || !b) return;
    const pages = [...book.pages];
    pages[idx] = b;
    pages[next] = a;
    get().updateBook(bookId, { pages });
  },

  updateScene: (bookId, pageId, scene) => {
    const book = get().book(bookId);
    if (!book) return;
    get().updateBook(bookId, {
      pages: book.pages.map((p) => (p.id === pageId ? { ...p, scene } : p)),
    });
  },

  appendPages: (bookId, newPages) => {
    const book = get().book(bookId);
    if (!book) return;
    get().updateBook(bookId, { pages: [...book.pages, ...newPages] });
  },

  updatePageImage: (bookId, pageId, elementId, next, historyNote) => {
    const book = get().book(bookId);
    if (!book) return;
    const pages = book.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        scene: {
          elements: p.scene.elements.map((e) => {
            if (e.id !== elementId || e.kind !== "image") return e;
            const entry = {
              id: uid("h"),
              src: next.src ?? e.src,
              note: historyNote,
              at: new Date().toISOString(),
            };
            return {
              ...e,
              src: next.src ?? e.src,
              alt: next.alt ?? e.alt,
              history: [entry, ...(e.history ?? [])].slice(0, 12),
            };
          }),
        },
      };
    });
    get().updateBook(bookId, { pages });
  },

  spend: (amount, reason) => {
    const { user } = get();
    if (user.credits < amount) return false;
    const balanceAfter = user.credits - amount;
    set({
      user: { ...user, credits: balanceAfter },
      ledger: [
        {
          id: uid("l"),
          at: new Date().toISOString(),
          delta: -amount,
          reason,
          balanceAfter,
        },
        ...get().ledger,
      ],
    });
    return true;
  },

  refund: (amount, reason) => {
    const { user } = get();
    const balanceAfter = user.credits + amount;
    set({
      user: { ...user, credits: balanceAfter },
      ledger: [
        {
          id: uid("l"),
          at: new Date().toISOString(),
          delta: amount,
          reason: `${reason} (refunded)`,
          balanceAfter,
        },
        ...get().ledger,
      ],
    });
  },

  grant: (amount, reason) => {
    const { user } = get();
    const balanceAfter = user.credits + amount;
    set({
      user: { ...user, credits: balanceAfter },
      ledger: [
        {
          id: uid("l"),
          at: new Date().toISOString(),
          delta: amount,
          reason,
          balanceAfter,
        },
        ...get().ledger,
      ],
    });
  },

  addTask: (kind, title, bookId) => {
    const task: Task = {
      id: uid("t"),
      kind,
      title,
      status: "running",
      progress: 0,
      createdAt: Date.now(),
      bookId,
    };
    set((s) => ({ tasks: [task, ...s.tasks] }));
    return task;
  },

  patchTask: (id, patch) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  addImage: (img) => {
    const asset: ImageAsset = {
      id: uid("img"),
      w: 1024,
      h: 1024,
      createdAt: new Date().toISOString(),
      tags: [],
      ...img,
    };
    set((s) => ({ images: [asset, ...s.images] }));
    return asset;
  },

  deleteImages: (ids) =>
    set((s) => ({ images: s.images.filter((i) => !ids.includes(i.id)) })),

  tagImage: (id, tags) =>
    set((s) => ({
      images: s.images.map((i) => (i.id === id ? { ...i, tags } : i)),
    })),
}));
