"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Sparkles, TriangleAlert } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Field,
  Input,
  Select,
  Checkbox,
  Chip,
  Textarea,
} from "@/components/ui";
import type { GeneratorDef } from "@/mocks/generators";
import { costFor } from "@/mocks/generators";
import { useApp } from "@/mocks/store";
import { startBook, useGeneration, mockOutline } from "@/lib/generation";

const STYLE_PRESETS: Record<string, string[]> = {
  "kids-story": ["Bedtime story", "Watercolor", "Flat bold", "Classic primer"],
  coloring: ["Bold and easy", "Mandala", "Cartoon", "Stained glass", "Custom…"],
  "kids-look": ["Kids look", "Playful primer", "Handwritten"],
};

export function CreateBookModal({
  def,
  open,
  onOpenChange,
}: {
  def: GeneratorDef;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();
  const runGeneration = useGeneration();
  const [values, setValues] = useState<Record<string, string | number | boolean | string[]>>(() => {
    const init: Record<string, string | number | boolean | string[]> = {};
    for (const f of def.fields) if (f.defaultValue !== undefined) init[f.key] = f.defaultValue;
    return init;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"form" | "outline">("form");
  const [submitting, setSubmitting] = useState(false);
  const [creditError, setCreditError] = useState(false);

  const pages = Number(values.pages ?? def.basePages ?? 24);
  const cost = costFor(def, pages);
  const credits = useApp((s) => s.user.credits);
  const insufficient = cost > 0 && credits < cost;

  const outline = useMemo(
    () => mockOutline(String(values.title ?? "Your book"), Number(values.chapters ?? 6)),
    [values.title, values.chapters],
  );

  const setValue = (key: string, v: string | number | boolean | string[]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const validate = () => {
    const next: Record<string, string> = {};
    for (const f of def.fields) {
      if (f.required && !String(values[f.key] ?? "").trim()) {
        next[f.key] = "This field is required";
      } else if (f.max && String(values[f.key] ?? "").length > f.max) {
        next[f.key] = `Keep it under ${f.max} characters`;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    if (def.outlineStep && phase === "form") {
      setPhase("outline");
      return;
    }
    setSubmitting(true);
    try {
      const book = await startBook(
        def,
        values,
        def.type === "kids-story" || def.type === "coloring" ? "square" : String(values.trim ?? "square"),
      );
      runGeneration(def, book, def.instant ? pages : Math.max(1, pages));
      onOpenChange(false);
      router.push(`/studio/${book.id}`);
    } catch (e) {
      if ((e as Error).message === "Not enough credits") setCreditError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setPhase("form"); setCreditError(false); } }}>
      <DialogContent style={{ ["--dialog-w" as string]: "720px" }}>
        <div className="p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <DialogTitle>
              {def.type === "kids-story"
                ? "Create New Kids Book"
                : def.type === "non-fiction"
                  ? "Create New Non-Fiction Book"
                  : def.type === "trivia"
                    ? "Create New Trivia Book"
                    : def.type === "sudoku"
                      ? "Create New Sudoku Book"
                      : def.type === "coloring"
                        ? "Create New Coloring Book"
                        : `New ${def.label.toLowerCase()}`}
            </DialogTitle>
          </div>
          <DialogDescription className="mt-1.5">{def.tagline}</DialogDescription>

          {def.outlineStep && phase === "outline" ? (
            <div className="mt-6">
              <h3 className="text-lg font-bold">Review the outline</h3>
              <p className="mt-1 text-sm text-ink-2">
                The outline is the cheapest place to change the book. Confirm to generate
                chapter by chapter.
              </p>
              <ol className="mt-4 flex flex-col gap-2 rounded-md border border-line bg-surface-2 p-4">
                {outline.map((o) => (
                  <li key={o} className="text-sm text-ink">{o}</li>
                ))}
              </ol>
              <div className="mt-5 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setPhase("form")}>Back</Button>
                <Button loading={submitting} onClick={submit}>
                  Confirm and Generate Book
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* credit banner (reference F2 t0010 shows an "8 credits" banner) */}
              <div className="mt-4 flex items-center justify-between rounded-md bg-primary-soft px-4 py-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <Info className="size-4" aria-hidden />
                  {cost > 0 ? `${cost} credits` : "Free"}
                </span>
                <span className="text-xs text-ink-2">{def.cost}</span>
              </div>

              {creditError && (
                <div role="alert" className="mt-4 flex items-start gap-2 rounded-md bg-danger-soft p-3 text-sm text-danger">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    Not enough credits for this book. <a className="underline" href="/account/credits">Buy Credit Packs</a>
                  </span>
                </div>
              )}

              <div className="mt-5 grid max-h-[46vh] gap-4 overflow-y-auto pr-1">
                {def.fields.map((f) => {
                  const raw = values[f.key];
                  if (f.kind === "checkbox") {
                    return (
                      <label key={f.key} className="flex items-center gap-3 text-sm font-medium">
                        <Checkbox
                          checked={!!raw}
                          onCheckedChange={(v) => setValue(f.key, !!v)}
                          id={f.key}
                        />
                        {f.label}
                      </label>
                    );
                  }
                  if (f.kind === "topics") {
                    const list = ["Times tables 2–10", "Addition", "Subtraction", "Division", "Fractions"];
                    const picked = Array.isArray(raw) ? (raw as string[]) : [];
                    return (
                      <Field key={f.key} label={f.label} hint={f.helper}>
                        <div className="flex flex-wrap gap-2">
                          {list.map((t) => (
                            <Chip
                              key={t}
                              onClick={() =>
                                setValue(
                                  f.key,
                                  picked.includes(t) ? picked.filter((x) => x !== t) : [...picked, t],
                                )
                              }
                              className={picked.includes(t) ? "border-primary text-primary" : ""}
                            >
                              {t}
                            </Chip>
                          ))}
                        </div>
                      </Field>
                    );
                  }
                  if (f.kind === "select") {
                    return (
                      <Field key={f.key} label={f.label}>
                        <Select
                          options={f.options ?? []}
                          value={String(raw ?? "")}
                          onValueChange={(v) => setValue(f.key, v)}
                        />
                      </Field>
                    );
                  }
                  if (f.kind === "number") {
                    const [min, max] = f.rangeLabel ?? [1, 100];
                    return (
                      <Field key={f.key} label={`${f.label} (${min}–${max})`} error={errors[f.key]} htmlFor={f.key}>
                        <Input
                          id={f.key}
                          type="number"
                          min={min}
                          max={max}
                          value={String(raw ?? "")}
                          onChange={(e) => setValue(f.key, Number(e.target.value))}
                          aria-invalid={!!errors[f.key]}
                        />
                      </Field>
                    );
                  }
                  if (f.kind === "stylePicker") {
                    const presets = STYLE_PRESETS[def.type] ?? STYLE_PRESETS["kids-story"]!;
                    return (
                      <Field key={f.key} label={f.label}>
                        <div className="flex flex-wrap gap-2">
                          {presets.map((s) => (
                            <Chip
                              key={s}
                              onClick={() => setValue(f.key, s)}
                              className={raw === s ? "border-primary text-primary" : ""}
                            >
                              {s}
                            </Chip>
                          ))}
                        </div>
                      </Field>
                    );
                  }
                  if (f.kind === "textarea") {
                    const len = String(raw ?? "").length;
                    return (
                      <Field
                        key={f.key}
                        label={f.label}
                        error={errors[f.key]}
                        htmlFor={f.key}
                        enhanceAIArea={f.enhanceAI}
                        counter={f.max ? `${len}/${f.max} characters` : undefined}
                      >
                        <Textarea
                          id={f.key}
                          placeholder={f.placeholder}
                          value={String(raw ?? "")}
                          onChange={(e) => setValue(f.key, e.target.value)}
                          aria-invalid={!!errors[f.key]}
                        />
                      </Field>
                    );
                  }
                  const len = String(raw ?? "").length;
                  return (
                    <Field
                      key={f.key}
                      label={f.label}
                      error={errors[f.key]}
                      htmlFor={f.key}
                      enhanceAIArea={f.enhanceAI}
                      counter={
                        f.max ? `${len} / ${f.max} ${f.counterNote ?? "characters"}` : undefined
                      }
                    >
                      <Input
                        id={f.key}
                        placeholder={f.placeholder}
                        value={String(raw ?? "")}
                        onChange={(e) => setValue(f.key, e.target.value)}
                        aria-invalid={!!errors[f.key]}
                      />
                    </Field>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  loading={submitting}
                  disabled={insufficient}
                  onClick={submit}
                >
                  {def.cta}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
