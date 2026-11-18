"use client";

import { forwardRef, useId } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------- Input ---------------------------------- */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-9 w-full rounded-md border bg-surface px-3 text-sm text-ink placeholder:text-ink-3",
        "transition-colors duration-[var(--d-fast)]",
        invalid
          ? "border-danger focus:border-danger"
          : "border-line hover:border-line-strong focus:border-primary",
        "focus:outline-none focus:shadow-focus",
        "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-3",
        "read-only:bg-surface-2",
        className,
      )}
      {...rest}
    />
  );
});

/* ------------------------------ Textarea -------------------------------- */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-3 resize-y min-h-20",
          "transition-colors duration-[var(--d-fast)]",
          invalid
            ? "border-danger focus:border-danger"
            : "border-line hover:border-line-strong focus:border-primary",
          "focus:outline-none focus:shadow-focus",
          "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-3",
          className,
        )}
        {...rest}
      />
    );
  },
);

/* -------------------------------- Field --------------------------------- */

export function Field({
  label,
  hint,
  error,
  counter,
  enhanceAIArea,
  children,
  required,
  htmlFor,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  /** "0 / 200 characters (KDP limit)"-style counter line */
  counter?: string;
  /** reference shows a ghost "Enhance Prompt with AI" action under inputs */
  enhanceAIArea?: boolean;
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}) {
  const fallbackId = useId();
  const id = htmlFor ?? fallbackId;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {enhanceAIArea && (
        <button
          type="button"
          tabIndex={-1}
          className="inline-flex items-center gap-1.5 self-start text-xs text-ink-3 hover:text-primary transition-colors"
          aria-hidden
        >
          <Sparkles className="size-3.5" aria-hidden />
          Enhance Prompt with AI
        </button>
      )}
      {counter && <span className="text-xs text-ink-3">{counter}</span>}
      {hint && !error && <span className="text-xs text-ink-3">{hint}</span>}
      {error && (
        <span role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
