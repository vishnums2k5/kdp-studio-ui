"use client";

import { create } from "zustand";

export type StudioView = "scroll" | "spread" | "grid";
export type StudioTool =
  | "pages"
  | "elements"
  | "text"
  | "images"
  | "draw"
  | "design"
  | "accents"
  | "characters";

interface StudioState {
  bookId: string | null;
  activeTool: StudioTool;
  view: StudioView;
  zoom: number; // 0.1..2
  fitWidth: boolean;
  safeArea: boolean;
  selectedPageId: string | null;
  selectedElementId: string | null;
  aiPopover: { pageId: string; elementId: string } | null;
  colorMode: "color" | "bw";
  exportOpen: boolean;
  bookMenuOpen: boolean;
  addPageOpen: boolean;
  shortcutsOpen: boolean;
  taskTrayOpen: boolean;
  previewMode: boolean;
  /* undo/redo over scenes */
  past: string[];
  future: string[];

  openBook: (id: string, defaults?: { colorMode?: "color" | "bw"; view?: StudioView }) => void;
  setTool: (t: StudioTool) => void;
  setView: (v: StudioView) => void;
  setZoom: (z: number) => void;
  zoomBy: (delta: number) => void;
  toggleFitWidth: () => void;
  toggleSafeArea: () => void;
  selectPage: (id: string | null) => void;
  selectElement: (id: string | null) => void;
  openAiPopover: (pageId: string, elementId: string) => void;
  closeAiPopover: () => void;
  setColorMode: (m: "color" | "bw") => void;
  setFlag: (k: "exportOpen" | "bookMenuOpen" | "addPageOpen" | "shortcutsOpen" | "taskTrayOpen" | "previewMode", v: boolean) => void;
  /** snapshot current scenes for undo (call BEFORE mutating) */
  snapshot: (serialized: string) => void;
  /** restore snapshots; applyScene mutators consume returned data */
  undo: (current: string) => { past: string[]; future: string[]; restore?: string };
  redo: (current: string) => { past: string[]; future: string[]; restore?: string };
}

export const useStudio = create<StudioState>((set, get) => ({
  bookId: null,
  activeTool: "pages",
  view: "scroll",
  zoom: 0.5,
  fitWidth: false,
  safeArea: false,
  selectedPageId: null,
  selectedElementId: null,
  aiPopover: null,
  colorMode: "color",
  exportOpen: false,
  bookMenuOpen: false,
  addPageOpen: false,
  shortcutsOpen: false,
  taskTrayOpen: false,
  previewMode: false,
  past: [],
  future: [],

  openBook: (id, defaults) =>
    set({
      bookId: id,
      activeTool: "pages",
      view: defaults?.view ?? "scroll",
      zoom: 0.5,
      fitWidth: false,
      safeArea: false,
      selectedPageId: null,
      selectedElementId: null,
      aiPopover: null,
      colorMode: defaults?.colorMode ?? "color",
      exportOpen: false,
      bookMenuOpen: false,
      addPageOpen: false,
      shortcutsOpen: false,
      taskTrayOpen: false,
      previewMode: false,
      past: [],
      future: [],
    }),
  setTool: (t) => set({ activeTool: t, selectedElementId: null }),
  setView: (v) => set({ view: v }),
  setZoom: (z) => set({ zoom: Math.min(2, Math.max(0.1, z)), fitWidth: false }),
  zoomBy: (delta) =>
    set((s) => ({ zoom: Math.min(2, Math.max(0.1, s.zoom + delta)), fitWidth: false })),
  toggleFitWidth: () => set((s) => ({ fitWidth: !s.fitWidth })),
  toggleSafeArea: () => set((s) => ({ safeArea: !s.safeArea })),
  selectPage: (id) => set({ selectedPageId: id, selectedElementId: null }),
  selectElement: (id) => set({ selectedElementId: id }),
  openAiPopover: (pageId, elementId) =>
    set({ aiPopover: { pageId, elementId }, selectedElementId: elementId, selectedPageId: pageId }),
  closeAiPopover: () => set({ aiPopover: null }),
  setColorMode: (m) => set({ colorMode: m }),
  setFlag: (k, v) => set({ [k]: v } as Partial<StudioState>),

  snapshot: (serialized) =>
    set((s) => ({
      past: [...s.past.slice(-24), serialized],
      future: [],
    })),

  undo: (current) => {
    const s = get();
    if (s.past.length === 0) return { past: s.past, future: s.future };
    const restore = s.past[s.past.length - 1];
    return {
      past: s.past.slice(0, -1),
      future: [current, ...s.future].slice(0, 24),
      restore,
    };
  },

  redo: (current) => {
    const s = get();
    if (s.future.length === 0) return { past: s.past, future: s.future };
    const restore = s.future[0];
    return {
      past: [...s.past, current].slice(-24),
      future: s.future.slice(1),
      restore,
    };
  },
}));
