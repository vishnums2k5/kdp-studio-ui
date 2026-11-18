"use client";

import { CircleCheck, CircleX, X } from "lucide-react";
import { Progress } from "@/components/ui";
import { useApp } from "@/mocks/store";

/** Background task tray (observed: generation tasks; export tasks). */
export function TaskTray({ onClose }: { onClose: () => void }) {
  const tasks = useApp((s) => s.tasks);
  return (
    <div
      role="dialog"
      aria-label="Task tray"
      className="fixed bottom-14 right-5 z-[var(--z-toast)] w-80 rounded-lg border border-line bg-surface p-3 shadow-lg"
    >
      <div className="flex items-center justify-between px-1 pb-2">
        <p className="text-sm font-bold">Tasks</p>
        <button
          onClick={onClose}
          aria-label="Close task tray"
          className="grid size-6 place-items-center rounded-sm text-ink-2 hover:bg-surface-3"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="px-1 py-3 text-sm text-ink-3">No background tasks.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {tasks.slice(0, 6).map((t) => (
            <li key={t.id} className="rounded-md border border-line p-2.5">
              <div className="flex items-center gap-2">
                {t.status === "done" ? (
                  <CircleCheck className="size-4 text-success" aria-hidden />
                ) : t.status === "failed" ? (
                  <CircleX className="size-4 text-danger" aria-hidden />
                ) : (
                  <span className="size-4 animate-spin rounded-full border-2 border-line border-t-primary" aria-hidden />
                )}
                <p className="min-w-0 flex-1 truncate text-sm font-medium">{t.title}</p>
                <span className="text-xs text-ink-3">{t.progress}%</span>
              </div>
              {t.status !== "done" && t.status !== "failed" && (
                <Progress value={t.progress} className="mt-2 h-1.5" label={`${t.title} progress`} />
              )}
              {t.resultNote && (
                <p className="mt-1 text-xs text-ink-3">{t.resultNote}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
