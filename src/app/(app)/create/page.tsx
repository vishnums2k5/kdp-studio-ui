"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, FileText, LayoutTemplate, Lightbulb, PencilLine, Brain, Grid3x3, Shapes, Sparkles } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Card } from "@/components/ui";
import { GENERATORS } from "@/mocks/generators";

/** Create hub — observed flow entry (F9 text): generate with AI / start
 * blank / use a template. Layout of the hub itself UNOBSERVED → placeholder
 * in the observed design language. */
export default function CreatePage() {
  const generators = Object.values(GENERATORS);
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    "kids-story": BookOpen,
    "non-fiction": FileText,
    coloring: Lightbulb,
    "word-search": Grid3x3,
    trivia: Brain,
    sudoku: Shapes,
    math: PencilLine,
    journal: LayoutTemplate,
    blank: FileText,
    "color-by-number": Sparkles,
  };
  const aiFlows = generators.filter((g) => g.baseCredits > 0);
  const freeFlows = generators.filter((g) => g.baseCredits === 0);

  return (
    <>
      <Topbar title="Create book" />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: "/create/kids-story", title: "Generate with AI", desc: "Storybooks, guides, puzzles — the AI drafts, you finish.", icon: Sparkles, primary: true },
            { href: "/create/blank", title: "Start blank", desc: "Empty pages, your layout. Free.", icon: FileText, primary: false },
            { href: "/library", title: "Use a template", desc: "Journals, planners and logs — free, no credits.", icon: LayoutTemplate, primary: false },
          ].map((c) => (
            <Link key={c.href} href={c.href}>
              <Card
                interactive
                className={`flex items-start gap-3 p-5 ${c.primary ? "border-primary/30 bg-primary-soft" : ""}`}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-md ${c.primary ? "bg-primary text-on-primary" : "bg-primary-soft text-primary"}`}>
                  <c.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="mt-0.5 text-sm text-ink-2">{c.desc}</p>
                </div>
                <ArrowRight className="ml-auto mt-1 size-4 text-ink-3" aria-hidden />
              </Card>
            </Link>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-lg font-bold">AI generators</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aiFlows.map((g) => {
            const Icon = icons[g.type] ?? Sparkles;
            return (
              <Link key={g.type} href={`/create/${g.type}`}>
                <Card interactive className="flex items-center gap-3 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{g.label}</p>
                    <p className="truncate text-xs text-ink-2">{g.cost}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <h2 className="mb-3 mt-8 text-lg font-bold">Free & algorithmic</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {freeFlows.map((g) => {
            const Icon = icons[g.type] ?? FileText;
            return (
              <Link key={g.type} href={`/create/${g.type}`}>
                <Card interactive className="flex items-center gap-3 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-success-soft text-success">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{g.label}</p>
                    <p className="truncate text-xs text-ink-2">{g.tagline}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
