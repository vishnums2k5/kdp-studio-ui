"use client";

import * as RTooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export const TooltipProvider = RTooltip.Provider;

export function Tooltip({
  content,
  children,
  side = "top",
  className,
  contentClassName,
  delayDuration = 200,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  contentClassName?: string;
  delayDuration?: number;
}) {
  return (
    <RTooltip.Root delayDuration={delayDuration}>
      <RTooltip.Trigger asChild className={className}>
        {children}
      </RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-[var(--z-toast)] rounded-sm bg-ink px-2.5 py-1.5 text-xs text-surface shadow-md max-w-56",
            contentClassName,
          )}
        >
          {content}
          <RTooltip.Arrow className="fill-ink" aria-hidden />
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  );
}
