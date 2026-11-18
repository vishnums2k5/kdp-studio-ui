"use client";

import * as RSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder,
  ariaLabel,
  className,
  disabled,
  id,
}: {
  options: SelectOption[];
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <RSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <RSelect.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 text-sm",
          "hover:border-line-strong data-[placeholder]:text-ink-3",
          "focus:outline-none focus:shadow-focus focus:border-primary",
          "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-3",
          className,
        )}
      >
        <RSelect.Value placeholder={placeholder ?? "Select…"} />
        <RSelect.Icon>
          <ChevronDown className="size-4 text-ink-3" aria-hidden />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={4}
          className="z-[var(--z-modal)] min-w-[var(--radix-select-trigger-width)] rounded-md border border-line bg-surface shadow-lg py-1"
        >
          <RSelect.Viewport className="max-h-72">
            {options.map((o) => (
              <RSelect.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-1.5 text-sm outline-none cursor-pointer",
                  "data-[highlighted]:bg-surface-3",
                  "data-[disabled]:text-ink-3 data-[disabled]:cursor-not-allowed",
                )}
              >
                <RSelect.ItemText>{o.label}</RSelect.ItemText>
                <RSelect.ItemIndicator>
                  <Check className="size-4 text-primary" aria-hidden />
                </RSelect.ItemIndicator>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}
