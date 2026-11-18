"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Circle,
  Ellipse,
  Group,
  Image as KImage,
  Layer,
  Line,
  Rect,
  Stage,
  Star,
  Text as KText,
  Transformer,
  Arrow as KArrow,
} from "react-konva";
import type Konva from "konva";
import { resolveSrc } from "@/lib/resolve-src";
import { useImage } from "@/lib/use-image";
import { useStudio } from "@/lib/studio-store";
import { useApp } from "@/mocks/store";
import type { Book, ImageElement, Page, SceneElement, ShapeElement, TextElement } from "@/mocks/types";

export const IN = 96; // CSS px per inch at 100% zoom

function ElementNode({
  el,
  book,
  pageId,
  zoom,
  onDoubleClickText,
  draggable,
}: {
  el: SceneElement;
  book: Book;
  pageId: string;
  zoom: number;
  onDoubleClickText: (el: TextElement, pos: { x: number; y: number }) => void;
  draggable: boolean;
}) {
  const selectElement = useStudio((s) => s.selectElement);
  const selectedId = useStudio((s) => s.selectedElementId);
  const openAiPopover = useStudio((s) => s.openAiPopover);
  const shapeRef = useRef<Konva.Node | null>(null);
  const isSelected = selectedId === el.id;

  const commit = (patch: Partial<SceneElement>) => {
    const store = useApp.getState();
    const book2 = store.book(book.id);
    const page = book2?.pages.find((p) => p.id === pageId);
    if (!book2 || !page) return;
    store.updateScene(book2.id, pageId, {
      elements: page.scene.elements.map((e) => (e.id === el.id ? ({ ...e, ...patch } as SceneElement) : e)),
    });
  };

  const commonProps = {
    id: el.id,
    x: el.x * zoom,
    y: el.y * zoom,
    width: el.w * zoom,
    height: el.h * zoom,
    draggable: draggable && !el.locked && isSelected,
    onClick: () => selectElement(el.id),
    onTap: () => selectElement(el.id),
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      commit({ x: Math.round(e.target.x() / zoom), y: Math.round(e.target.y() / zoom) });
    },
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      const sx = node.scaleX();
      const sy = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
      commit({
        x: Math.round(node.x() / zoom),
        y: Math.round(node.y() / zoom),
        w: Math.max(16, Math.round((el.w * sx) / 1)),
        h: Math.max(16, Math.round((el.h * sy) / 1)),
        rotation: Math.round(node.rotation()),
      });
    },
  };

  if (el.kind === "text") {
    return (
      <KText
        {...commonProps}
        ref={shapeRef as React.RefObject<Konva.Text | null>}
        text={el.text}
        fontSize={el.fontSize * zoom}
        fontStyle={`${el.weight}`}
        align={el.align}
        width={el.w * zoom}
        height={el.h * zoom}
        fill={el.color}
        perfectDrawEnabled={false}
        onDblClick={(e) =>
          onDoubleClickText(el, { x: e.target.x(), y: e.target.y() })
        }
      />
    );
  }

  if (el.kind === "image") {
    return <ImageNode el={el} zoom={zoom} commonProps={commonProps} shapeRef={shapeRef} onOpenAi={() => openAiPopover(pageId, el.id)} />;
  }

  const shape = el as ShapeElement;
  const stroke = shape.stroke ?? "#1C1E26";
  const sw = (shape.strokeWidth ?? 2) * zoom;
  switch (shape.shape) {
    case "ellipse":
      return (
        <Ellipse
          {...commonProps}
          ref={shapeRef as React.RefObject<Konva.Ellipse | null>}
          x={(el.x + el.w / 2) * zoom}
          y={(el.y + el.h / 2) * zoom}
          radiusX={(el.w / 2) * zoom}
          radiusY={(el.h / 2) * zoom}
          fill={shape.fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      );
    case "line":
      return (
        <Line
          {...commonProps}
          ref={shapeRef as React.RefObject<Konva.Line | null>}
          points={[0, (el.h / 2) * zoom, el.w * zoom, (el.h / 2) * zoom]}
          stroke={stroke}
          strokeWidth={sw}
        />
      );
    case "star":
      return (
        <Star
          {...commonProps}
          ref={shapeRef as React.RefObject<Konva.Star | null>}
          x={(el.x + el.w / 2) * zoom}
          y={(el.y + el.h / 2) * zoom}
          numPoints={5}
          innerRadius={(el.w / 4) * zoom}
          outerRadius={(el.w / 2) * zoom}
          fill={shape.fill ?? "#F4C542"}
          stroke={stroke}
          strokeWidth={sw}
        />
      );
    case "arrow":
      return (
        <KArrow
          {...commonProps}
          ref={shapeRef as React.RefObject<Konva.Arrow | null>}
          points={[0, (el.h / 2) * zoom, el.w * zoom, (el.h / 2) * zoom]}
          fill={stroke}
          stroke={stroke}
          strokeWidth={sw}
        />
      );
    default:
      return (
        <Rect
          {...commonProps}
          ref={shapeRef as React.RefObject<Konva.Rect | null>}
          cornerRadius={(shape.shape === "speech" ? el.h / 2 : shape.shape === "frame" ? 0 : 8) * zoom}
          fill={shape.fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      );
  }
}

function ImageNode({
  el,
  zoom,
  commonProps,
  shapeRef,
  onOpenAi,
}: {
  el: ImageElement;
  zoom: number;
  commonProps: Record<string, unknown>;
  shapeRef: React.RefObject<Konva.Node | null>;
  onOpenAi: () => void;
}) {
  const img = useImage(resolveSrc(el.src));
  if (!img) return null;
  return (
    <KImage
      {...commonProps}
      ref={shapeRef as React.RefObject<Konva.Image | null>}
      image={img}
      onDblClick={onOpenAi}
    />
  );
}

/** One interactive page: Konva stage + guides + selection transformer. */
export function PageStage({
  book,
  page,
  index,
  zoom,
  width,
  onTextEdit,
}: {
  book: Book;
  page: Page;
  index: number;
  zoom: number;
  width: number;
  onTextEdit: (pageId: string, el: TextElement, pos: { x: number; y: number }) => void;
}) {
  const pageW = book.trim.w * IN * zoom;
  const pageH = book.trim.h * IN * zoom;
  const safeArea = useStudio((s) => s.safeArea);
  const colorMode = useStudio((s) => s.colorMode);
  const selectedId = useStudio((s) => s.selectedElementId);
  const selectElement = useStudio((s) => s.selectElement);
  const containerRef = useRef<HTMLDivElement>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [stageW, setStageW] = useState(width);
  const [stageH, setStageH] = useState(pageH);

  useEffect(() => {
    setStageW(Math.max(width, pageW + 32));
    setStageH(pageH + 32);
  }, [width, pageW, pageH]);

  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;
    const layer = tr.getLayer();
    const node = layer?.findOne(`#${selectedId}`);
    if (node) {
      tr.nodes([node]);
      tr.getLayer()?.batchDraw();
    } else {
      tr.nodes([]);
    }
  }, [selectedId, page.scene.elements, zoom]);

  const bleed = book.bleed ? 0.125 * IN * zoom : 0;
  const margin = 0.625 * IN * zoom;

  const guides = useMemo(() => {
    if (!safeArea) return null;
    return (
      <Group listening={false}>
        <Rect
          x={-bleed}
          y={-bleed}
          width={pageW + bleed * 2}
          height={pageH + bleed * 2}
          stroke="#BF6A00"
          dash={[6, 4]}
          strokeWidth={1}
        />
        <Rect x={margin} y={margin} width={pageW - margin * 2} height={pageH - margin * 2} stroke="#178A50" dash={[4, 4]} strokeWidth={1} />
        <Rect
          x={0.25 * IN * zoom}
          y={0.25 * IN * zoom}
          width={pageW - 0.5 * IN * zoom}
          height={pageH - 0.5 * IN * zoom}
          stroke="#2563AE"
          dash={[2, 4]}
          strokeWidth={1}
        />
      </Group>
    );
  }, [safeArea, pageW, pageH, bleed, margin, zoom]);

  return (
    <div ref={containerRef} style={{ width: stageW, height: stageH }} className="relative">
      <Stage
        width={stageW}
        height={stageH}
        style={{ position: "absolute", left: 0, top: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) selectElement(null);
        }}
        onTouchStart={(e) => {
          if (e.target === e.target.getStage()) selectElement(null);
        }}
      >
        <Layer>
          <Rect
            x={16}
            y={16}
            width={pageW}
            height={pageH}
            fill={colorMode === "bw" ? "#FFFFFF" : "#FFFFFF"}
            shadowColor="#1C1E26"
            shadowOpacity={0.12}
            shadowBlur={12}
            shadowOffsetY={2}
            listening={false}
          />
          {/* page content is offset 16px so shadows/bleed guides fit */}
          <Group x={16} y={16} clipX={0} clipY={0} clipWidth={pageW} clipHeight={pageH}>
            {guides}
            {page.scene.elements.map((el) => (
              <ElementNode
                key={el.id}
                el={el}
                book={book}
                pageId={page.id}
                zoom={zoom}
                draggable
                onDoubleClickText={(el2, pos) => onTextEdit(page.id, el2, { x: pos.x + 16, y: pos.y + 16 })}
              />
            ))}
          </Group>
        </Layer>
        <Layer>
          <Transformer
            ref={trRef}
            rotateEnabled
            keepRatio={false}
            anchorSize={8}
            anchorCornerRadius={2}
            anchorStroke="#5646D6"
            anchorFill="#FFFFFF"
            borderStroke="#5646D6"
            borderStrokeWidth={2}
          />
        </Layer>
      </Stage>
      {safeArea && (
        <span className="absolute left-[18px] top-[14px] rounded-sm bg-surface/85 px-1.5 py-0.5 text-[10px] font-medium text-ink-3">
          Page {index + 1} · trim {book.trim.w}×{book.trim.h} in · bleed {book.bleed ? "0.125 in" : "off"} · safe 0.25 in
        </span>
      )}
    </div>
  );
}
