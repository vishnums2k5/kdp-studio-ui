"use client";

import { useCallback, useRef } from "react";
import { useApp } from "@/mocks/store";
import { GENERATORS, costFor, type GeneratorDef } from "@/mocks/generators";
import { TRIM_OPTIONS } from "@/mocks/data";
import type { Book, Page } from "@/mocks/types";
import { sceneArt } from "@/mocks/art";
import { sleep } from "@/lib/utils";

let pageCounter = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${++pageCounter}`;

function aiPage(title: string, i: number): Page {
  return {
    id: uid("p"),
    type: "art",
    label: `Art page ${i}`,
    scene: {
      elements: [
        {
          id: uid("e"),
          kind: "text",
          x: 26,
          y: 36,
          w: 460,
          h: 36,
          text: `${title} — page ${i}`,
          fontSize: 22,
          weight: 700,
          align: "center",
          color: "#1C1E26",
        },
        {
          id: uid("e"),
          kind: "image",
          x: 96,
          y: 104,
          w: 320,
          h: 320,
          src: `mock:gen:${i}`,
          alt: `${title} illustration ${i}`,
          storedDpi: 131,
        },
      ],
    },
  };
}

/** Resolve mock:gen:<n> at render time. */
export function resolveGenSrc(src: string, seed = 500): string {
  if (src.startsWith("mock:gen:")) return sceneArt(seed + Number(src.slice("mock:gen:".length)));
  return src;
}

/**
 * Mock AI generation runner: streams pages into the book one at a time
 * (observed behavior: "the book opens immediately and pages arrive one at a
 * time"), drives the task tray progress, and flips the book to ready.
 */
export function useGeneration() {
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const run = useCallback((def: GeneratorDef, book: Book, pages: number) => {
    const { addTask, patchTask, appendPages, updateBook } = useApp.getState();
    const task = addTask(
      "generate-book",
      `Generating “${book.title}”`,
      book.id,
    );
    const total = Math.max(1, pages);
    let i = 0;
    const step = () => {
      i += 1;
      appendPages(book.id, [aiPage(book.title, i)]);
      patchTask(task.id, {
        progress: Math.round((i / total) * 100),
      });
      if (i < total) {
        const t = setTimeout(step, def.instant ? 60 : 420);
        timers.current.add(t);
      } else {
        patchTask(task.id, { status: "done", progress: 100, resultNote: `${total} pages` });
        updateBook(book.id, { status: "ready" });
      }
    };
    const t0 = setTimeout(step, def.instant ? 200 : 900);
    timers.current.add(t0);
  }, []);

  return run;
}

export interface CreateFlowOptions {
  values: Record<string, string | number | boolean>;
  def: GeneratorDef;
  trimValue: string;
}

/** Shared create logic: validates credits, creates the book, starts mock
 * generation, returns the book (caller navigates to the studio). */
export async function startBook(
  def: GeneratorDef,
  values: Record<string, string | number | boolean | string[]>,
  trimValue: string,
): Promise<Book> {
  const store = useApp.getState();
  const trim = (TRIM_OPTIONS.find((t) => t.value === trimValue) ?? TRIM_OPTIONS[0]!).trim;
  const pages = Number(values.pages ?? def.basePages ?? 24);
  const cost = costFor(def, pages);
  if (cost > 0 && store.user.credits < cost) {
    throw new Error("Not enough credits");
  }
  const book = store.createBook(
    {
      title: String(values.title ?? "Untitled book"),
      type: def.type,
      trim,
      pageCount: def.instant ? pages : 0,
      author: store.user.name,
      style: String(values.style ?? "Classic"),
    },
    cost,
  );
  return book;
}

/** Outline helper for non-fiction (observed: outline first, then confirm). */
export function mockOutline(title: string, chapters: number): string[] {
  const base = title.replace(/^(the|a)\s+/i, "").split(/\s+/).slice(0, 4).join(" ");
  return Array.from({ length: chapters }, (_, i) =>
    `${i + 1}. ${base} — chapter ${i + 1}: key ideas, common mistakes, and a practical checklist`,
  );
}

export const _sleep = sleep;
export const _costFor = costFor;
export const GENERATOR_LIST = Object.values(GENERATORS);
