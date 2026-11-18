import { forwardRef } from "react";
import * as RAvatar from "@radix-ui/react-avatar";
import * as RProgress from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

/* -------------------------------- Badge --------------------------------- */

export type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-surface-3 text-ink-2",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  accent: "bg-accent-soft text-accent",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-medium",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------- Avatar -------------------------------- */

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const sizes = { sm: "size-6 text-[10px]", md: "size-8 text-xs", lg: "size-10 text-sm" };
  return (
    <RAvatar.Root className={cn("relative shrink-0", sizes[size], className)}>
      <RAvatar.Image
        src={src}
        alt={name}
        className="size-full rounded-full object-cover"
      />
      <RAvatar.Fallback className="size-full grid place-items-center rounded-full bg-primary text-on-primary font-semibold">
        {initials}
      </RAvatar.Fallback>
    </RAvatar.Root>
  );
}

/* --------------------------------- Card --------------------------------- */

export function Card({
  className,
  interactive,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-surface shadow-sm",
        interactive &&
          "cursor-pointer transition-shadow duration-[var(--d-fast)] hover:shadow-md",
        className,
      )}
      {...rest}
    />
  );
}

/* ------------------------------ Progress bar ---------------------------- */

export function Progress({
  value,
  className,
  barClassName,
  label,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
}) {
  return (
    <RProgress.Root
      value={value}
      aria-label={label ?? "Progress"}
      className={cn("h-2 w-full overflow-hidden rounded-pill bg-surface-3", className)}
    >
      <RProgress.Indicator
        className={cn("h-full rounded-pill bg-primary transition-transform duration-[var(--d-slow)]", barClassName)}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </RProgress.Root>
  );
}

/* --------------------------- Spinner / Skeleton -------------------------- */

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block size-5 rounded-full border-2 border-line border-t-primary animate-spin",
        className,
      )}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("rounded-md bg-surface-3 animate-pulse", className)}
    />
  );
}
