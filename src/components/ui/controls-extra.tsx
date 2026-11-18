"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";

/* ----------------------- Segmented (Color | B&W) ------------------------ */

export function Segmented<T extends string>({
  options,
  value,
  onValueChange,
  className,
  size = "md",
  ariaLabel,
}: {
  options: { value: T; label: string; icon?: React.ReactNode; ariaLabel?: string }[];
  value: T;
  onValueChange: (v: T) => void;
  className?: string;
  size?: "sm" | "md";
  ariaLabel?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-surface p-0.5",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            aria-label={o.ariaLabel ?? o.label}
            onClick={() => onValueChange(o.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm font-medium transition-colors duration-[var(--d-fast)]",
              size === "sm" ? "h-6 px-2 text-xs" : "h-7 px-2.5 text-sm",
              active
                ? "bg-primary text-on-primary"
                : "text-ink-2 hover:bg-surface-3 hover:text-ink",
            )}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ Suggestion chip -------------------------- */

export function Chip({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-pill border border-line bg-surface px-3 py-1.5 text-sm text-ink-2 whitespace-nowrap",
        "hover:border-primary hover:text-primary transition-colors duration-[var(--d-fast)]",
        "focus-visible:shadow-focus focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* --------------------------------- Kbd ---------------------------------- */

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-line bg-surface-2 px-1 font-sans text-[10px] font-medium text-ink-2">
      {children}
    </kbd>
  );
}

/* ------------------------------- Combobox ------------------------------- */

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  ariaLabel,
  className,
  emptyMessage = "No matches",
}: {
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  ariaLabel?: string;
  className?: string;
  emptyMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [options, query],
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={ariaLabel}
          aria-expanded={open}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 text-sm",
            "hover:border-line-strong focus-visible:shadow-focus focus-visible:outline-none",
            !selected && "text-ink-3",
            className,
          )}
        >
          {selected?.label ?? placeholder}
          <ChevronsUpDown className="size-4 text-ink-3" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1.5">
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="mb-1"
          aria-label={searchPlaceholder}
        />
        <div className="max-h-56 overflow-y-auto" role="listbox" aria-label={ariaLabel}>
          {filtered.length === 0 && (
            <p className="px-3 py-2 text-sm text-ink-3">{emptyMessage}</p>
          )}
          {filtered.map((o) => (
            <button
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onValueChange?.(o.value);
                setOpen(false);
                setQuery("");
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-sm text-left",
                "hover:bg-surface-3 transition-colors",
                o.value === value && "text-primary font-medium",
              )}
            >
              {o.label}
              {o.value === value && <Check className="size-4" aria-hidden />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
