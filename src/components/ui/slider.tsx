"use client";

import * as RSlider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({
  className,
  ...rest
}: RSlider.SliderProps) {
  return (
    <RSlider.Root
      className={cn(
        "relative flex h-5 w-full touch-none select-none items-center",
        className,
      )}
      {...rest}
    >
      <RSlider.Track className="relative h-1 w-full grow rounded-full bg-surface-3">
        <RSlider.Range className="absolute h-full rounded-full bg-primary" />
      </RSlider.Track>
      <RSlider.Thumb
        className={cn(
          "block size-4 rounded-full bg-primary shadow-sm",
          "hover:bg-primary-hover focus-visible:shadow-focus focus-visible:outline-none",
          "disabled:opacity-50",
        )}
        aria-label="Value"
      />
    </RSlider.Root>
  );
}
