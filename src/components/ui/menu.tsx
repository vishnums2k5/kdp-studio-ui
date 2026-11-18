"use client";

import * as RDropdown from "@radix-ui/react-dropdown-menu";
import * as RCtx from "@radix-ui/react-context-menu";
import { cn } from "@/lib/utils";

/* --------------------------- Dropdown menu ------------------------------ */

export const DropdownMenu = RDropdown.Root;
export const DropdownMenuTrigger = RDropdown.Trigger;

export function DropdownMenuContent({
  className,
  ...rest
}: RDropdown.DropdownMenuContentProps) {
  return (
    <RDropdown.Portal>
      <RDropdown.Content
        sideOffset={6}
        className={cn(
          "z-[var(--z-modal)] min-w-48 rounded-lg border border-line bg-surface py-1.5 shadow-lg",
          className,
        )}
        {...rest}
      />
    </RDropdown.Portal>
  );
}

export function DropdownMenuItem({
  className,
  danger,
  ...rest
}: RDropdown.DropdownMenuItemProps & { danger?: boolean }) {
  return (
    <RDropdown.Item
      className={cn(
        "flex items-center gap-2.5 mx-1.5 rounded-sm px-2.5 py-1.5 text-sm cursor-pointer outline-none",
        "data-[highlighted]:bg-surface-3",
        "data-[disabled]:text-ink-3 data-[disabled]:cursor-not-allowed",
        danger ? "text-danger data-[highlighted]:bg-danger-soft" : "text-ink",
        className,
      )}
      {...rest}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...rest
}: RDropdown.DropdownMenuSeparatorProps) {
  return (
    <RDropdown.Separator
      className={cn("my-1.5 h-px bg-line", className)}
      {...rest}
    />
  );
}

export function DropdownMenuLabel({
  className,
  ...rest
}: RDropdown.DropdownMenuLabelProps) {
  return (
    <RDropdown.Label
      className={cn(
        "px-3.5 py-1.5 text-xs font-medium uppercase tracking-wide text-ink-3",
        className,
      )}
      {...rest}
    />
  );
}

/* ---------------------------- Context menu ------------------------------ */

export const ContextMenu = RCtx.Root;
export const ContextMenuTrigger = RCtx.Trigger;

export function ContextMenuContent({
  className,
  ...rest
}: RCtx.ContextMenuContentProps) {
  return (
    <RCtx.Portal>
      <RCtx.Content
        className={cn(
          "z-[var(--z-modal)] min-w-44 rounded-lg border border-line bg-surface py-1.5 shadow-lg",
          className,
        )}
        {...rest}
      />
    </RCtx.Portal>
  );
}

export function ContextMenuItem({
  className,
  danger,
  ...rest
}: RCtx.ContextMenuItemProps & { danger?: boolean }) {
  return (
    <RCtx.Item
      className={cn(
        "flex items-center gap-2.5 mx-1.5 rounded-sm px-2.5 py-1.5 text-sm cursor-pointer outline-none",
        "data-[highlighted]:bg-surface-3",
        "data-[disabled]:text-ink-3 data-[disabled]:cursor-not-allowed",
        danger ? "text-danger data-[highlighted]:bg-danger-soft" : "text-ink",
        className,
      )}
      {...rest}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...rest
}: RCtx.ContextMenuSeparatorProps) {
  return (
    <RCtx.Separator className={cn("my-1.5 h-px bg-line", className)} {...rest} />
  );
}
