import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Book, Page } from "@/mocks/types";
import { resolveSrc } from "./resolve-src";

/**
 * Mock export: assembles a real PDF from page scenes (text rendered with
 * standard fonts, images rasterized from data URIs). The print-grade vector
 * pipeline belongs to Phase 12 — this proves the export UX end to end.
 */
type Embedded = Awaited<ReturnType<PDFDocument["embedPng"]>>;
async function svgToPng(doc: PDFDocument, src: string): Promise<{ embedded: Embedded } | null> {
  try {
    const img = await renderSvgToPngBytes(src);
    if (!img) return null;
    const embedded = await doc.embedPng(img);
    return { embedded };
  } catch {
    return null;
  }
}

async function renderSvgToPngBytes(src: string): Promise<Uint8Array | null> {
  if (!src.startsWith("data:image/svg+xml")) return null;
  // Rasterize the SVG via an offscreen canvas.
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("svg load failed"));
    img.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || 300;
  canvas.height = img.naturalHeight || 300;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
  if (!blob) return null;
  return new Uint8Array(await blob.arrayBuffer());
}

export async function buildPdf(
  book: Book,
  pages: Page[],
  imagesOnly = false,
): Promise<Blob> {
  const doc = await PDFDocument.create();
  doc.setTitle(book.title);
  doc.setAuthor(book.author || "KDP Studio");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageW = (book.trim.w + (book.bleed ? 0.25 : 0)) * 72;
  const pageH = (book.trim.h + (book.bleed ? 0.25 : 0)) * 72;

  for (const page of pages) {
    if (imagesOnly) {
      for (const el of page.scene.elements.filter((e) => e.kind === "image")) {
        const p = doc.addPage([600, 600]);
        const png = await svgToPng(doc, resolveSrc((el as { src: string }).src));
        if (png) {
          p.drawImage(png.embedded, { x: 50, y: 50, width: 500, height: 500 });
        }
        p.drawText((el as { alt?: string }).alt ?? "image", {
          x: 50, y: 20, size: 10, font, color: rgb(0.4, 0.4, 0.45),
        });
      }
      continue;
    }
    const p = doc.addPage([pageW, pageH]);
    const scale = 72 / 96; // scene px → pt
    for (const el of page.scene.elements) {
      if (el.kind === "text") {
        const lines = el.text.split("\n");
        lines.forEach((line, i) => {
          const size = el.fontSize * scale;
          const width = el.w * scale;
          let x = el.x * scale;
          if (el.align === "center") x += (width - font.widthOfTextAtSize(line, size) * (size / (el.fontSize * scale))) / 2;
          if (el.align === "center") x = el.x * scale + (width - Math.min(font.widthOfTextAtSize(line, size), width)) / 2;
          p.drawText(line, {
            x,
            y: pageH - (el.y + el.h) * scale + i * (el.fontSize * 1.45 * scale),
            size,
            font: el.weight >= 700 ? bold : font,
            color: rgb(0.11, 0.12, 0.15),
          });
        });
      } else if (el.kind === "image") {
        const png = await svgToPng(doc, resolveSrc(el.src));
        if (png) {
          p.drawImage(png.embedded, {
            x: el.x * scale,
            y: pageH - (el.y + el.h) * scale,
            width: el.w * scale,
            height: el.h * scale,
          });
        }
      }
    }
  }

  const bytes = await doc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
