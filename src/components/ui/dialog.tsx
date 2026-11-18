"use client";

import * as RDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = RDialog.Root;
export const DialogTrigger = RDialog.Trigger;
export const DialogClose = RDialog.Close;

export function DialogContent({
  className,
  children,
  showClose = true,
  ...rest
}: RDialog.DialogContentProps & { showClose?: boolean }) {
  return (
    <RDialog.Portal>
      <RDialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-ink/55 backdrop-blur-[2px]" />
      <RDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[var(--z-modal)] w-[min(92vw,var(--dialog-w,680px))] max-h-[92vh] -translate-x-1/2 -translate-y-1/2",
          "rounded-xl bg-surface shadow-lg outline-none overflow-y-auto",
          className,
        )}
        {...rest}
      >
        {children}
        {showClose && (
          <RDialog.Close
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm text-ink-2 hover:bg-surface-3 hover:text-ink transition-colors focus-visible:shadow-focus focus-visible:outline-none"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </RDialog.Close>
        )}
      </RDialog.Content>
    </RDialog.Portal>
  );
}

export function DialogTitle({
  className,
  ...rest
}: RDialog.DialogTitleProps) {
  return (
    <RDialog.Title
      className={cn("text-xl font-bold text-ink", className)}
      {...rest}
    />
  );
}

export function DialogDescription({
  className,
  ...rest
}: RDialog.DialogDescriptionProps) {
  return (
    <RDialog.Description
      className={cn("text-sm text-ink-2", className)}
      {...rest}
    />
  );
}

/* -------------------------------- Drawer -------------------------------- */

export function DrawerContent({
  className,
  children,
  side = "left",
  ...rest
}: RDialog.DialogContentProps & { side?: "left" | "right" | "bottom" }) {
  const pos =
    side === "left"
      ? "left-0 top-0 h-full w-[min(88vw,var(--shell-sidebar-w-mobile))] border-r animate-slide-in-left"
      : side === "right"
        ? "right-0 top-0 h-full w-[min(88vw,420px)] border-l animate-slide-in-right"
        : "bottom-0 left-0 right-0 max-h-[85vh] rounded-t-xl border-t animate-slide-up";
  return (
    <RDialog.Portal>
      <RDialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-ink/55" />
      <RDialog.Content
        className={cn(
          "fixed z-[var(--z-modal)] bg-surface shadow-lg outline-none",
          pos,
          className,
        )}
        {...rest}
      >
        {children}
      </RDialog.Content>
    </RDialog.Portal>
  );
}

export const Drawer = RDialog.Root;
export const DrawerTrigger = RDialog.Trigger;
export const DrawerClose = RDialog.Close;
export const DrawerTitle = DialogTitle;
export const DrawerDescription = DialogDescription;
