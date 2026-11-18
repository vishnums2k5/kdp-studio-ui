"use client";

import * as RTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = RTabs.Root;

export function TabsList({
  className,
  ...rest
}: RTabs.TabsListProps) {
  return (
    <RTabs.List
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-surface-2 p-1",
        className,
      )}
      {...rest}
    />
  );
}

export function TabsTrigger({
  className,
  ...rest
}: RTabs.TabsTriggerProps) {
  return (
    <RTabs.Trigger
      className={cn(
        "rounded-sm px-3 h-7 text-sm font-medium text-ink-2 transition-colors duration-[var(--d-fast)]",
        "hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-sm",
        "focus-visible:shadow-focus focus-visible:outline-none",
        className,
      )}
      {...rest}
    />
  );
}

export const TabsContent = RTabs.Content;
