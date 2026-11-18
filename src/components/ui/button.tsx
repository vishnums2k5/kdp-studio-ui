"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "danger-ghost"
  | "icon";
type Size = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantCls: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover shadow-sm disabled:bg-primary/50",
  secondary:
    "bg-surface text-ink border border-line hover:bg-surface-3 hover:border-line-strong",
  ghost: "text-ink-2 hover:bg-surface-3 hover:text-ink",
  danger: "bg-danger text-white hover:opacity-90 shadow-sm",
  "danger-ghost": "text-danger hover:bg-danger-soft",
  icon: "text-ink-2 hover:bg-surface-3 hover:text-ink",
};

const sizeCls: Record<Size, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5 rounded-sm [&_svg]:size-3.5",
  sm: "h-8 px-3 text-sm gap-1.5 rounded-sm [&_svg]:size-4",
  md: "h-9 px-3.5 text-sm gap-2 rounded-md [&_svg]:size-4",
  lg: "h-11 px-5 text-base gap-2 rounded-md [&_svg]:size-[18px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", loading, children, disabled, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-[var(--d-fast)] select-none",
          variant === "icon" ? "h-8 w-8 rounded-sm" : sizeCls[size],
          variantCls[variant],
          "disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...rest}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
