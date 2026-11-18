"use client";

import * as RCheckbox from "@radix-ui/react-checkbox";
import * as RRadio from "@radix-ui/react-radio-group";
import * as RSwitch from "@radix-ui/react-switch";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  indeterminate,
  ...rest
}: RCheckbox.CheckboxProps & { indeterminate?: boolean }) {
  return (
    <RCheckbox.Root
      className={cn(
        "size-4.5 shrink-0 rounded-sm border grid place-items-center transition-colors duration-[var(--d-fast)]",
        "data-[state=unchecked]:bg-surface data-[state=unchecked]:border-line-strong hover:border-primary",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary",
        "focus-visible:shadow-focus focus-visible:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      <RCheckbox.Indicator>
        {indeterminate ? (
          <Minus className="size-3.5 text-on-primary" aria-hidden />
        ) : (
          <Check className="size-3.5 text-on-primary" aria-hidden />
        )}
      </RCheckbox.Indicator>
    </RCheckbox.Root>
  );
}

export const RadioGroup = RRadio.Root;

export function RadioItem({
  className,
  ...rest
}: RRadio.RadioGroupItemProps) {
  return (
    <RRadio.Item
      className={cn(
        "size-4.5 rounded-full border border-line-strong bg-surface grid place-items-center",
        "hover:border-primary focus-visible:shadow-focus focus-visible:outline-none",
        "data-[state=checked]:border-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      <RRadio.Indicator className="size-2.5 rounded-full bg-primary" />
    </RRadio.Item>
  );
}

export function Switch({ className, ...rest }: RSwitch.SwitchProps) {
  return (
    <RSwitch.Root
      className={cn(
        "h-6 w-10 shrink-0 rounded-full p-0.5 transition-colors duration-[var(--d-base)]",
        "bg-line-strong data-[state=checked]:bg-primary",
        "focus-visible:shadow-focus focus-visible:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      <RSwitch.Thumb className="block size-5 rounded-full bg-white shadow-sm transition-transform duration-[var(--d-base)] data-[state=checked]:translate-x-4" />
    </RSwitch.Root>
  );
}
