import type { BookType, CREDIT_COSTS as Costs } from "./types";
import { CREDIT_COSTS } from "./types";

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "stylePicker"
  | "checkbox"
  | "topics";

export interface FieldDef {
  kind: FieldKind;
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  max?: number;
  counterNote?: string;
  enhanceAI?: boolean;
  options?: { value: string; label: string }[];
  helper?: string;
  min?: number;
  maxNum?: number;
  /** number field label shown in reference style "Number of Pages (10-30)" */
  rangeLabel?: [number, number];
  defaultValue?: string | number | boolean;
}

export interface GeneratorDef {
  type: BookType;
  /** sidebar label */
  label: string;
  tagline: string;
  cta: string;
  /** cost description shown in the modal credit banner */
  cost: string;
  /** credits spent for the mock create call (0 = free flow) */
  baseCredits: number;
  /** credits per extra page beyond basePages */
  perPageCredit?: number;
  basePages?: number;
  fields: FieldDef[];
  /** algorithmic generators stream pages instantly (observed: sudoku/math) */
  instant?: boolean;
  /** non-fiction gets the outline review step (observed F8) */
  outlineStep?: boolean;
}

export const GENERATORS: Record<string, GeneratorDef> = {
  "kids-story": {
    type: "kids-story",
    label: "Kids Books",
    tagline: "Illustrated storybooks with a consistent main character.",
    cta: "Generate Kids Book",
    cost: "Base: 8 credits (10 pages) + 1 credit per additional page",
    baseCredits: 8,
    perPageCredit: 1,
    basePages: 10,
    fields: [
      {
        kind: "text",
        key: "title",
        label: "Book Title",
        placeholder: "Enter your kids book title…",
        required: true,
        max: 200,
        counterNote: "characters (KDP limit)",
        enhanceAI: true,
      },
      {
        kind: "textarea",
        key: "story",
        label: "Story Description",
        placeholder: "Describe the adventure, setting, and what happens in your story…",
        required: true,
        max: 3000,
        enhanceAI: true,
      },
      {
        kind: "number",
        key: "pages",
        label: "Number of Pages",
        rangeLabel: [10, 30],
        defaultValue: 10,
        required: true,
      },
      {
        kind: "text",
        key: "character",
        label: "Main Character",
        placeholder: "Name and describe them clearly — they should look consistent on every page",
      },
      {
        kind: "stylePicker",
        key: "style",
        label: "Illustration Style",
        defaultValue: "Bedtime story",
      },
    ],
  },
  "non-fiction": {
    type: "non-fiction",
    label: "Non-Fiction",
    tagline: "Outline-first guides, how-tos and educational books.",
    cta: "Generate Book",
    cost: "6 credits (base) + 2 per regenerated chapter",
    baseCredits: 6,
    outlineStep: true,
    fields: [
      { kind: "select", key: "template", label: "Template", options: [
        { value: "howto", label: "How-to guide" },
        { value: "explainer", label: "Explainer" },
        { value: "myths", label: "Myths & facts" },
      ], defaultValue: "howto" },
      { kind: "text", key: "title", label: "Book Title", placeholder: "Enter your book title…", required: true, max: 200, counterNote: "characters (KDP limit)", enhanceAI: true },
      { kind: "textarea", key: "description", label: "What should the book cover?", placeholder: "Describe the coverage, tone and reader…", required: true, max: 3000, enhanceAI: true },
      { kind: "select", key: "style", label: "Writing style", options: [
        { value: "friendly", label: "Friendly expert" },
        { value: "practical", label: "Practical & direct" },
        { value: "academic", label: "Academic" },
      ], defaultValue: "friendly" },
      { kind: "select", key: "audience", label: "Audience", options: [
        { value: "beginner", label: "Beginners" },
        { value: "hobbyist", label: "Enthusiasts" },
        { value: "pro", label: "Professionals" },
      ], defaultValue: "beginner" },
      { kind: "select", key: "chapterLength", label: "Chapter length", options: [
        { value: "short", label: "Short (2–3 pages)" },
        { value: "medium", label: "Medium (4–6 pages)" },
      ], defaultValue: "medium" },
      { kind: "number", key: "chapters", label: "Number of chapters", rangeLabel: [3, 20], defaultValue: 6, required: true },
    ],
  },
  coloring: {
    type: "coloring",
    label: "Coloring Books",
    tagline: "Themed line-art collections, 12+ styles.",
    cta: "Generate Coloring Book",
    cost: "10 credits for a 30-page book + 5 for an AI cover",
    baseCredits: 10,
    fields: [
      { kind: "text", key: "title", label: "Book Title", placeholder: "Enter your coloring book title…", required: true, max: 200, counterNote: "characters (KDP limit)", enhanceAI: true },
      { kind: "textarea", key: "theme", label: "Theme", placeholder: "Describe your subject — e.g. “Cozy rooms with friendly cats, clear outlines and plenty of open space.”", required: true, max: 2000, enhanceAI: true },
      { kind: "stylePicker", key: "style", label: "Art Style", defaultValue: "Bold and easy" },
      { kind: "number", key: "pages", label: "Number of Pages", rangeLabel: [10, 40], defaultValue: 30, required: true },
    ],
  },
  "word-search": {
    type: "word-search",
    label: "Word Search",
    tagline: "Themed word-search puzzles with an answer key.",
    cta: "Create Word Search Book",
    cost: "Free — algorithm-generated",
    baseCredits: 0,
    instant: true,
    fields: [
      { kind: "text", key: "title", label: "Book Title", placeholder: "Enter your word search title…", required: true, max: 200, counterNote: "characters (KDP limit)" },
      { kind: "textarea", key: "theme", label: "Theme", placeholder: "What is the book about? Used to pick words.", required: true },
      { kind: "select", key: "difficulty", label: "Difficulty", options: [
        { value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" },
      ], defaultValue: "easy" },
      { kind: "number", key: "pages", label: "Number of Puzzles", rangeLabel: [10, 60], defaultValue: 30, required: true },
    ],
  },
  trivia: {
    type: "trivia",
    label: "Trivia",
    tagline: "Fact-checked question rounds with answers after each round.",
    cta: "Create Trivia Book",
    cost: "6 credits (24 pages)",
    baseCredits: 6,
    fields: [
      { kind: "text", key: "title", label: "Book Title", placeholder: "Enter your trivia book title…", required: true, max: 200, counterNote: "characters (KDP limit)", enhanceAI: true },
      { kind: "textarea", key: "theme", label: "Theme", placeholder: "What topic are the questions about?", required: true, enhanceAI: true },
      { kind: "number", key: "pages", label: "Number of Pages", rangeLabel: [24, 60], defaultValue: 24, required: true },
      { kind: "number", key: "questions", label: "Questions per page", rangeLabel: [2, 10], defaultValue: 5, required: true },
    ],
  },
  sudoku: {
    type: "sudoku",
    label: "Sudoku",
    tagline: "Large-print algorithm puzzles, ready in seconds.",
    cta: "Create Sudoku Book",
    cost: "Free — algorithm-generated",
    baseCredits: 0,
    instant: true,
    fields: [
      { kind: "text", key: "title", label: "Book Title", placeholder: "Enter your sudoku book title…", required: true, max: 200, counterNote: "characters (KDP limit)" },
      { kind: "select", key: "difficulty", label: "Difficulty", options: [
        { value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }, { value: "expert", label: "Expert" },
      ], defaultValue: "easy" },
      { kind: "number", key: "per", label: "Puzzles per page", rangeLabel: [1, 4], defaultValue: 2, required: true },
      { kind: "number", key: "pages", label: "Number of Pages", rangeLabel: [24, 100], defaultValue: 50, required: true },
    ],
  },
  math: {
    type: "math",
    label: "Math workbook",
    tagline: "Computed practice pages, answers, certificate.",
    cta: "Create workbook",
    cost: "Free — algorithm-generated",
    baseCredits: 0,
    instant: true,
    fields: [
      { kind: "text", key: "title", label: "Workbook Title", placeholder: "Enter your workbook title…", required: true, max: 200, counterNote: "characters (KDP limit)" },
      { kind: "select", key: "grade", label: "Grade", options: [
        { value: "1", label: "Grade 1" }, { value: "2", label: "Grade 2" }, { value: "3", label: "Grade 3" }, { value: "4", label: "Grade 4" },
      ], defaultValue: "2" },
      { kind: "topics", key: "topics", label: "What to practice", helper: "Pick one or more topics — e.g. times tables 2–10." },
      { kind: "number", key: "pages", label: "Practice pages", rangeLabel: [20, 100], defaultValue: 50, required: true },
      { kind: "checkbox", key: "pictures", label: "Include picture pages", defaultValue: true },
      { kind: "checkbox", key: "cover", label: "Include a cover", defaultValue: true },
      { kind: "checkbox", key: "certificate", label: "Include a completion certificate", defaultValue: false },
    ],
  },
  journal: {
    type: "journal",
    label: "Journal",
    tagline: "Prompted journals from free templates.",
    cta: "Create journal",
    cost: "Free — templates use no credits",
    baseCredits: 0,
    instant: true,
    fields: [
      { kind: "text", key: "title", label: "Journal Title", placeholder: "Enter your journal title…", required: true, max: 200, counterNote: "characters (KDP limit)" },
      { kind: "select", key: "trim", label: "Trim size", options: [
        { value: "square", label: "8.5 × 8.5 in" }, { value: "pocket", label: "6 × 9 in" }, { value: "usLetter", label: "8.5 × 11 in" },
      ], defaultValue: "pocket" },
      { kind: "number", key: "pages", label: "Number of Pages", rangeLabel: [20, 200], defaultValue: 100, required: true },
    ],
  },
  blank: {
    type: "blank",
    label: "Blank book",
    tagline: "Start from empty pages — free.",
    cta: "Create book",
    cost: "Free",
    baseCredits: 0,
    instant: true,
    fields: [
      { kind: "text", key: "title", label: "Book Title", placeholder: "Enter your book title…", required: true, max: 200, counterNote: "characters (KDP limit)" },
      { kind: "select", key: "trim", label: "Trim size", options: [
        { value: "square", label: "8.5 × 8.5 in" }, { value: "pocket", label: "6 × 9 in" }, { value: "usLetter", label: "8.5 × 11 in" },
      ], defaultValue: "square" },
      { kind: "number", key: "pages", label: "Number of Pages", rangeLabel: [8, 200], defaultValue: 24, required: true },
    ],
  },
  "color-by-number": {
    type: "color-by-number",
    label: "Color by number",
    tagline: "UNOBSERVED form — placeholder fields.",
    cta: "Create book",
    cost: "Credits shown before you start",
    baseCredits: 5,
    fields: [
      { kind: "text", key: "title", label: "Book Title", placeholder: "Enter your book title…", required: true, max: 200, counterNote: "characters (KDP limit)" },
      { kind: "textarea", key: "theme", label: "Theme", placeholder: "Describe the images to convert…", required: true },
      { kind: "number", key: "pages", label: "Number of Pages", rangeLabel: [10, 40], defaultValue: 20, required: true },
    ],
  },
};

export function costFor(def: GeneratorDef, pages: number): number {
  if (def.baseCredits === 0) return 0;
  if (def.perPageCredit && def.basePages !== undefined) {
    return def.baseCredits + Math.max(0, pages - def.basePages) * def.perPageCredit;
  }
  return def.baseCredits;
}

export const creditCostCopy = CREDIT_COSTS;
export type { BookType };
