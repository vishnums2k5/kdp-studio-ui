import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  TriangleAlert,
} from "lucide-react";
import { Button } from "./button";

/* --------------------------------- Table -------------------------------- */

export function Table({ className, ...rest }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn("w-full text-sm", className)} {...rest} />
  );
}

export function Th({ className, ...rest }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-ink-3 border-b border-line whitespace-nowrap",
        className,
      )}
      {...rest}
    />
  );
}

export function Td({ className, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-4 py-3 border-b border-line align-middle", className)} {...rest} />
  );
}

/* ------------------------------- Pagination ------------------------------ */

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
}: {
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  className?: string;
}) {
  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <Button variant="icon" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
        <ChevronLeft />
      </Button>
      {Array.from({ length: pageCount }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1)
        .map((p, i, arr) => (
          <span key={p} className="flex items-center">
            {i > 0 && arr[i - 1] !== p - 1 && (
              <span className="px-1 text-ink-3">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "size-8 grid place-items-center rounded-sm text-sm transition-colors",
                p === page
                  ? "bg-primary text-on-primary font-medium"
                  : "text-ink-2 hover:bg-surface-3",
              )}
            >
              {p}
            </button>
          </span>
        ))}
      <Button variant="icon" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page">
        <ChevronRight />
      </Button>
    </nav>
  );
}

/* ------------------------------ Empty state ------------------------------ */

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line-strong bg-surface-2 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="grid size-12 place-items-center rounded-full bg-surface-3 text-ink-3">
        <Inbox className="size-6" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-2">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* --------------------------------- Banner -------------------------------- */

export function Banner({
  tone = "info",
  title,
  children,
  onDismiss,
  className,
}: {
  tone?: "info" | "warning" | "success" | "danger";
  title: string;
  children?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const tones = {
    info: "bg-info-soft text-info",
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
  } as const;
  return (
    <div
      role={tone === "warning" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-md p-3.5", tones[tone], className)}
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {children && <div className="mt-1 text-sm">{children}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="rounded-sm px-1.5 text-base leading-none opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
