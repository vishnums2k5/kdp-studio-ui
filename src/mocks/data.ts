import type {
  Book,
  ImageAsset,
  LedgerEntry,
  Page,
  PageType,
  Template,
  TrimSize,
  User,
} from "./types";
import { coverArt, sceneArt } from "./art";

const TRIM_SQUARE: TrimSize = { w: 8.5, h: 8.5 };
const TRIM_LETTER: TrimSize = { w: 8.5, h: 11 };
const TRIM_POCKET: TrimSize = { w: 6, h: 9 };

export const TRIM_OPTIONS: { value: string; label: string; trim: TrimSize }[] = [
  { value: "square", label: "8.5 × 8.5 in", trim: TRIM_SQUARE },
  { value: "usLetter", label: "8.5 × 11 in", trim: TRIM_LETTER },
  { value: "pocket", label: "6 × 9 in", trim: TRIM_POCKET },
];

let pid = 0;
const pageId = () => `p${++pid}`;

function el(kind: "title" | "body", text: string, y: number, size: number, w = 460) {
  return {
    id: `e${++pid}`,
    kind: "text" as const,
    x: (512 - w) / 2,
    y,
    w,
    h: size * 1.5,
    text,
    fontSize: size,
    weight: (kind === "title" ? 700 : 400) as 400 | 700,
    align: "center" as const,
    color: "#1C1E26",
  };
}

function artPage(label: string, seed: number, title?: string): Page {
  const elements = [];
  if (title) elements.push(el("title", title, 36, 30));
  elements.push({
    id: `e${++pid}`,
    kind: "image" as const,
    x: 96,
    y: title ? 110 : 120,
    w: 320,
    h: 320,
    src: sceneArt(seed),
    alt: label,
    storedDpi: 131,
  });
  return { id: pageId(), type: "art", label, scene: { elements } };
}

function coloringPage(label: string, seed: number): Page {
  return {
    id: pageId(),
    type: "coloring",
    label,
    scene: {
      elements: [
        el("title", label, 40, 24),
        {
          id: `e${++pid}`,
          kind: "image" as const,
          x: 106,
          y: 110,
          w: 300,
          h: 300,
          src: sceneArt(seed, true),
          alt: `${label} line art`,
          storedDpi: 131,
        },
      ],
    },
  };
}

function textPage(type: PageType, label: string, lines: string[]): Page {
  return {
    id: pageId(),
    type,
    label,
    scene: {
      elements: [
        el("title", label, 48, 22),
        ...lines.map((l, i) => el("body", l, 110 + i * 26, 14)),
      ],
    },
  };
}

function puzzlePage(
  type: PageType,
  label: string,
  seed: number,
  heading: string,
): Page {
  const rngRows = 10;
  const letters = "ABCDEFGHIKLMNOPRSTUVWXYZ";
  // deterministic grid — SSR and client must agree (no Math.random in render paths)
  let s0 = seed * 7919 + 12345;
  const rnd = () => {
    s0 = (s0 * 1103515245 + 12345) % 2147483648;
    return s0 / 2147483648;
  };
  const grid = Array.from({ length: rngRows }, () =>
    Array.from({ length: 10 }, () => letters[Math.floor(rnd() * letters.length)]),
  );
  return {
    id: pageId(),
    type,
    label,
    scene: {
      elements: [
        el("title", heading, 44, 26),
        {
          id: `e${++pid}`,
          kind: "text" as const,
          x: 116,
          y: 96,
          w: 280,
          h: 300,
          text: grid.map((r) => r.join("  ")).join("\n"),
          fontSize: 13,
          weight: 500,
          align: "center",
          color: "#1C1E26",
        },
        el("body", "Find: SQUIRREL · ACORN · OAK · FERN · BERRY", 404, 12, 460),
      ],
    },
  };
}

/* --------------------------- Woodland Activity Sampler (F1 frame) --------------------------- */

const woodland: Book = {
  id: "woodland-activity-sampler",
  title: "Woodland Activity Sampler",
  author: "Lantern Lane Press",
  type: "trivia",
  status: "ready",
  trim: TRIM_SQUARE,
  bleed: true,
  colorMode: "color",
  style: "Playful primer",
  createdAt: "2026-11-02T09:12:00Z",
  updatedAt: "2026-11-18T14:03:00Z",
  tags: ["sample"],
  listing: {
    description:
      "A sampler of woodland activities for young readers — art pages, word searches and trivia rounds with an answer key at the back.",
    keywords: ["woodland animals", "activity book", "kids trivia", "word search"],
  },
  pages: [
    artPage("Art page", 3, "Woodland Friends"),
    puzzlePage("word-search", "Word Search 1", 4, "Word Search 1"),
    textPage("trivia", "Trivia: Round 1 (Woodland Animals)", [
      "1. Which animal caches acorns for winter?",
      "2. What is a baby squirrel called?",
      "3. Name three birds found in oak woods.",
      "4. What do deer eat in late autumn?",
      "5. True or false: foxes hunt alone.",
    ]),
    textPage("answers", "Trivia answers", [
      "1. The gray squirrel.  2. A kit or pup.",
      "3. Woodpecker, nuthatch, jay.",
      "4. Acorns, beechnuts, browse.",
      "5. True.",
    ]),
  ],
};

/* --------------------------- Pip the Brave Little Hedgehog (F3/F4 frames) --------------------------- */

const pipPages: Page[] = [
  textPage("title", "Pip the Brave Little Hedgehog", ["by Lantern Lane Press"]),
  textPage("copyright", "Copyright", [
    "© 2026 Lantern Lane Press.",
    "All rights reserved.",
  ]),
];
for (let i = 1; i <= 21; i++) {
  pipPages.push(artPage(`Art page ${i}`, i + 20, `Pip the Brave Little Hedgehog — page ${i}`));
}
pipPages.push({
  id: pageId(),
  type: "picture",
  label: "Picture page",
  scene: {
    elements: [
      {
        id: `e${++pid}`,
        kind: "image",
        x: 106,
        y: 110,
        w: 300,
        h: 300,
        src: sceneArt(42, true),
        alt: "Pip explores the lantern woods",
        storedDpi: 131,
      },
    ],
  },
});
for (let i = 23; i <= 26; i++) {
  pipPages.push(artPage(`Art page ${i}`, i + 40, `Pip the Brave Little Hedgehog — page ${i}`));
}
const pip: Book = {
  id: "pip-the-brave-little-hedgehog",
  title: "Pip the Brave Little Hedgehog",
  author: "Lantern Lane Press",
  type: "kids-story",
  status: "ready",
  trim: TRIM_SQUARE,
  bleed: true,
  colorMode: "color",
  style: "Bedtime story",
  createdAt: "2026-10-27T16:40:00Z",
  updatedAt: "2026-11-17T11:22:00Z",
  tags: ["kids", "story"],
  listing: {
    description:
      "Pip the hedgehog is scared of the dark woods — until one lantern-lit night teaches him that brave comes in small sizes.",
    keywords: ["hedgehog story", "bedtime book", "brave kids story", "lantern woods"],
  },
  pages: pipPages,
};

const coralMandalas: Book = {
  id: "coral-reef-mandalas",
  title: "Coral Reef Mandalas",
  author: "Lantern Lane Press",
  type: "coloring",
  status: "ready",
  trim: TRIM_SQUARE,
  bleed: true,
  colorMode: "bw",
  style: "Bold and easy",
  createdAt: "2026-11-10T10:00:00Z",
  updatedAt: "2026-11-16T09:05:00Z",
  tags: ["coloring", "ocean"],
  pages: Array.from({ length: 12 }, (_, i) =>
    coloringPage(`Coral mandala ${i + 1}`, i + 60),
  ),
};

const farmTrivia: Book = {
  id: "farm-trivia-for-toddlers",
  title: "Farm Trivia for Toddlers",
  author: "Lantern Lane Press",
  type: "trivia",
  status: "generating",
  trim: TRIM_SQUARE,
  bleed: true,
  colorMode: "color",
  style: "Kids look",
  createdAt: "2026-11-18T18:00:00Z",
  updatedAt: "2026-11-18T18:04:00Z",
  pages: [artPage("Art page", 77, "Farm Friends")],
};

const gratitudeJournal: Book = {
  id: "gratitude-journal-100-days",
  title: "Gratitude Journal — 100 Days",
  author: "Lantern Lane Press",
  type: "journal",
  status: "ready",
  trim: TRIM_POCKET,
  bleed: false,
  colorMode: "bw",
  style: "Calm lines",
  createdAt: "2026-11-05T08:30:00Z",
  updatedAt: "2026-11-15T20:12:00Z",
  tags: ["journal", "free"],
  pages: [
    textPage("title", "Gratitude Journal", ["100 days of small thanks"]),
    textPage("copyright", "Copyright", ["© 2026 Lantern Lane Press."]),
    ...Array.from({ length: 6 }, (_, i) =>
      textPage("prompt", `Day ${i + 1}`, [
        "Three things I am grateful for today:",
        "1. …",
        "2. …",
        "3. …",
        "One thing that made me smile: …",
      ]),
    ),
  ],
};

const mathWorkbook: Book = {
  id: "times-tables-workbook",
  title: "Times Tables Workbook 2–10",
  author: "Lantern Lane Press",
  type: "math",
  status: "ready",
  trim: TRIM_LETTER,
  bleed: false,
  colorMode: "bw",
  style: "Large-print bold",
  createdAt: "2026-11-08T13:00:00Z",
  updatedAt: "2026-11-14T16:45:00Z",
  tags: ["math", "large-print"],
  pages: [
    textPage("title", "Times Tables Workbook", ["Grades 2–4 · Multiplication"]),
    ...Array.from({ length: 4 }, (_, i) =>
      textPage("math", `Practice ${i + 1}`, [
        "1) 3 × 4 = …    2) 6 × 7 = …",
        "3) 8 × 9 = …    4) 5 × 5 = …",
        "5) 9 × 2 = …    6) 7 × 3 = …",
      ]),
    ),
    textPage("answers", "Answer key", [
      "1) 12  2) 42  3) 72  4) 25  5) 18  6) 21",
    ]),
  ],
};

export const seedBooks: Book[] = [
  woodland,
  pip,
  coralMandalas,
  farmTrivia,
  gratitudeJournal,
  mathWorkbook,
];

export const seedUser: User = {
  name: "Ada Byrd",
  email: "ada@lanternlane.example",
  plan: "Standard",
  credits: 142,
};

export const seedLedger: LedgerEntry[] = [
  { id: "l1", at: "2026-11-18T18:00:00Z", delta: -6, reason: "Farm Trivia for Toddlers — create book", balanceAfter: 142 },
  { id: "l2", at: "2026-11-17T11:22:00Z", delta: -1, reason: "AI picture edit — Pip page 21", balanceAfter: 148 },
  { id: "l3", at: "2026-11-16T09:05:00Z", delta: 0, reason: "Coral Reef Mandalas — algorithm pages (free)", balanceAfter: 149 },
  { id: "l4", at: "2026-11-14T16:45:00Z", delta: -8, reason: "Pip the Brave Little Hedgehog — regenerate page 12", balanceAfter: 149 },
  { id: "l5", at: "2026-11-01T00:00:00Z", delta: 180, reason: "Standard plan — monthly credits", balanceAfter: 157 },
];

const IMAGE_NAMES = [
  "lantern-woods",
  "hedgehog-study",
  "coral-mandala-01",
  "fox-portrait",
  "oak-leaf-border",
  "moon-over-pines",
  "mushroom-cluster",
  "river-bend",
  "owl-at-dusk",
] as const;

export const seedImages: ImageAsset[] = Array.from({ length: 9 }, (_, i) => ({
  id: `img-${i + 1}`,
  name: IMAGE_NAMES[i] ?? `image-${i + 1}`,
  src: sceneArt(i + 80),
  folder: i < 3 ? "Pip" : i < 6 ? "Coral Reef" : "Nature studies",
  tags: i < 3 ? ["pip", "story"] : i < 6 ? ["coloring"] : ["stock"],
  w: 1024,
  h: 1024,
  createdAt: `2026-11-${String(20 - i).padStart(2, "0")}T12:00:00Z`,
}));

export const seedTemplates: Template[] = [
  { id: "t1", name: "Gratitude journal", category: "journal", trim: TRIM_POCKET, pageCount: 100, description: "A daily prompt, three gratitude lines and a smile-space. Free — no AI, no credits.", thumbHue: 2 },
  { id: "t2", name: "Habit tracker", category: "planner", trim: TRIM_POCKET, pageCount: 60, description: "Weekly habit grid with a reflection line per day.", thumbHue: 0 },
  { id: "t3", name: "Reading log", category: "log", trim: TRIM_LETTER, pageCount: 40, description: "Track titles, minutes and a one-line review per day.", thumbHue: 4 },
  { id: "t4", name: "Bedtime story frame", category: "story", trim: TRIM_SQUARE, pageCount: 24, description: "Picture-per-page frame you fill with your own art and text.", thumbHue: 3 },
  { id: "t5", name: "Handwriting practice", category: "education", trim: TRIM_LETTER, pageCount: 50, description: "Guided letter and number tracing pages, large print.", thumbHue: 1 },
  { id: "t6", name: "Recipe keeper", category: "log", trim: TRIM_POCKET, pageCount: 80, description: "One recipe per page with ingredients, steps and notes.", thumbHue: 5 },
];

export function coverFor(book: Book): string {
  return coverArt(book.title, book.title.length, book.colorMode === "bw");
}
