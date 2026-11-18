"use client";

import { useEffect, useState } from "react";

/** Tiny use-image hook (react-konva ecosystem classic). */
export function useImage(src: string): HTMLImageElement | undefined {
  const [img, setImg] = useState<HTMLImageElement | undefined>();
  useEffect(() => {
    if (!src) return;
    let alive = true;
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => alive && setImg(image);
    image.src = src;
    return () => {
      alive = false;
    };
  }, [src]);
  return img;
}
