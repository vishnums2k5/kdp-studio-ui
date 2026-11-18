"use client";

import * as RPopover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export const Popover = RPopover.Root;
export const PopoverTrigger = RPopover.Trigger;
export const PopoverAnchor = RPopover.Anchor;

export function PopoverContent({
  className,
  ...rest
}: RPopover.PopoverContentProps) {
  return (
    <RPopover.Portal>
      <RPopover.Content
        sideOffset={6}
        className={cn(
          "z-[var(--z-modal)] rounded-lg border border-line bg-surface shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          className,
        )}
        {...rest}
      />
    </RPopover.Portal>
  );
}
