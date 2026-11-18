"use client";

import { resolveSrc } from "@/lib/resolve-src";
import type { Book, Page, PageScene } from "@/mocks/types";

/** Non-interactive HTML preview of a page scene (filmstrip / grid view). */
export function ScenePreview({
  scene,
  book,
  scale,
  className,
}: {
  scene: PageScene;
  book: Book;
  scale: number;
  className?: string;
}) {
  const w = book.trim.w * 96 * scale;
  const h = book.trim.h * 96 * scale;
  return (
    <div
      className={`relative overflow-hidden bg-white ${className ?? ""}`}
      style={{ width: w, height: h }}
      aria-hidden
    >
      {scene.elements.map((el) => {
        const style: React.CSSProperties = {
          position: "absolute",
          left: el.x * scale,
          top: el.y * scale,
          width: el.w * scale,
          height: el.h * scale,
        };
        if (el.kind === "text") {
          return (
            <div
              key={el.id}
              style={{
                ...style,
                fontSize: el.fontSize * scale,
                fontWeight: el.weight,
                color: el.color,
                textAlign: el.align,
                lineHeight: 1.2,
                whiteSpace: "pre-wrap",
                overflow: "hidden",
              }}
            >
              {el.text}
            </div>
          );
        }
        if (el.kind === "image") {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={el.id} src={resolveSrc(el.src)} alt="" style={{ ...style, objectFit: "cover" }} />
          );
        }
        return (
          <div
            key={el.id}
            style={{
              ...style,
              borderRadius: el.shape === "ellipse" ? "50%" : 8,
              background: el.fill ?? "transparent",
              border: el.stroke ? `${(el.strokeWidth ?? 2) * scale}px solid ${el.stroke}` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

/** Thumbnail for a page (used by the pages panel and grid view). */
export function PageThumb({ book, page, scale = 0.09 }: { book: Book; page: Page; scale?: number }) {
  return <ScenePreview scene={page.scene} book={book} scale={scale} className="rounded-[3px] border border-line shadow-sm" />;
}
