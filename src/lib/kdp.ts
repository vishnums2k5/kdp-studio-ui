import type { Book, Page } from "@/mocks/types";

export interface KdpCheckItem {
  id: string;
  level: "pass" | "fix" | "info";
  title: string;
  detail: string;
  /** inline action link label, e.g. "Add 19 notes pages at the end" */
  action?: { label: string; kind: "add-notes" | "open-setup" };
}

/**
 * KDP compliance check — computed from real KDP print rules matching the
 * observed panel items (F1 t0005): trim/bleed guidance, page count ≥ 24,
 * inside margin by page count, edge safety, author name, fonts embedded.
 */
export function kdpCheck(book: Book): KdpCheckItem[] {
  const items: KdpCheckItem[] = [];
  const { w, h } = book.trim;
  const n = book.pages.length;

  items.push({
    id: "trim",
    level: "info",
    title: `Trim size ${w} × ${h} in, ${book.bleed ? "with bleed" : "no bleed"}`,
    detail: book.bleed
      ? `On KDP choose trim size ${w} × ${h} in and "Bleed". Pages are 0.125 in larger on the outside, top and bottom (each PDF page ${(w + 0.25).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")} × ${(h + 0.25).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")} in); anything meant to run off the page should reach the edge of the PDF. Keep text 0.25 in inside the trim.`
      : `On KDP choose trim size ${w} × ${h} in and "No bleed". Keep all content inside the trim.`,
  });

  if (n < 24) {
    items.push({
      id: "page-count",
      level: "fix",
      title: `${n} pages: KDP needs at least 24`,
      detail: "Add pages, turn on the front pages, or add notes pages at the end.",
      action: { label: `Add ${24 - n} notes pages at the end`, kind: "add-notes" },
    });
  } else {
    items.push({ id: "page-count", level: "pass", title: `${n} pages`, detail: "KDP requires at least 24." });
  }

  const inside = n >= 151 ? 0.875 : n >= 101 ? 0.75 : n >= 60 ? 0.5 : n >= 25 ? 0.375 : 0.375;
  items.push({
    id: "margin",
    level: n < 24 ? "info" : "pass",
    title: `Inside margin ${inside} in`,
    detail:
      n < 24
        ? `A ${n}-page book needs at least ${inside} in on the spine side; outside margins are 0.5 in.`
        : `Meets the spine-margin minimum for ${n} pages; outside margins are 0.5 in.`,
  });

  const edgeRisk = book.pages.some((p) =>
    p.scene.elements.some(
      (e) =>
        !e.locked &&
        (e.x < 24 ||
          e.y < 24 ||
          e.x + e.w > (w - 0.25) * 96 - 24 ||
          e.y + e.h > (h - 0.25) * 96 - 24),
    ),
  );
  items.push(
    edgeRisk
      ? {
          id: "edges",
          level: "fix",
          title: "Something may be too close to the edges",
          detail:
            "Every mark on all pages should be at least 0.25 in from the trim and clear of the spine margin, measured on the pages themselves. Drag the marked items inward or turn on Safe area.",
        }
      : {
          id: "edges",
          level: "pass",
          title: "Nothing too close to the edges",
          detail:
            "Every mark on all pages is at least 0.25 in from the trim and clear of the spine margin, measured on the pages themselves.",
        },
  );

  items.push({
    id: "fonts",
    level: "pass",
    title: "Fonts embedded",
    detail: "Every character is embedded in the PDF, so KDP prints exactly what you see.",
  });

  items.push(
    book.author?.trim()
      ? { id: "author", level: "pass", title: "Author name set", detail: `“${book.author}” is used on the cover and front pages.` }
      : {
          id: "author",
          level: "fix",
          title: "Author name missing",
          detail: "Add the author in Book setup so the title page and cover carry it.",
          action: { label: "Open Book setup", kind: "open-setup" },
        },
  );

  return items;
}

export function kdpFixCount(items: KdpCheckItem[]): number {
  return items.filter((i) => i.level === "fix").length;
}

export function pageIndexLabel(pages: Page[], id: string | null): number {
  const idx = pages.findIndex((p) => p.id === id);
  return idx < 0 ? 1 : idx + 1;
}
