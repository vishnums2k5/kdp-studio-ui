"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastKind = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

const ToastCtx = createContext<{
  toast: (t: Omit<ToastItem, "id">) => void;
}>({ toast: () => {} });

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const toast = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = nextId++;
      setItems((prev) => [...prev.slice(-4), { ...t, id }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 5000),
      );
    },
    [dismiss],
  );

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const icons: Record<ToastKind, React.ReactNode> = {
    success: <CheckCircle2 className="size-5 text-success" aria-hidden />,
    error: <XCircle className="size-5 text-danger" aria-hidden />,
    info: <Info className="size-5 text-info" aria-hidden />,
    warning: <TriangleAlert className="size-5 text-warning-strong" aria-hidden />,
  };

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[var(--z-toast)] flex w-80 flex-col gap-2"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className="flex items-start gap-3 rounded-lg border border-line bg-surface p-3.5 shadow-lg animate-slide-up"
          >
            {icons[t.kind]}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-ink-2">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="grid size-6 shrink-0 place-items-center rounded-sm text-ink-3 hover:bg-surface-3 hover:text-ink transition-colors"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
