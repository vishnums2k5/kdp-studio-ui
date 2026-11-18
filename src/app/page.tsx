"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, FileText, Lightbulb, PencilLine, Shapes, Sparkles } from "lucide-react";
import { BookGlyph } from "@/components/shell/sidebar";
import { Button, Card } from "@/components/ui";
import { coverArt } from "@/mocks/art";

/** Phase 10 — ORIGINAL marketing landing (opt-in approved in the overnight
 * plan). All copy is original; price points mirror the reference's public
 * factual plan data with original presentation. */
const FEATURES = [
  { icon: FileText, title: "Non-fiction books", desc: "Outline-first guides and how-tos, written chapter by chapter, formatted for print." },
  { icon: Lightbulb, title: "Coloring books", desc: "Themed line-art collections in 12+ styles, with a credit estimate before you generate." },
  { icon: BookOpen, title: "Kids storybooks", desc: "Illustrated stories with a consistent main character on every page." },
  { icon: Sparkles, title: "AI image editing", desc: "Change one picture at a time, compare side by side, keep only what you like." },
  { icon: Shapes, title: "Puzzle generators", desc: "Word search, trivia, sudoku and math workbooks — algorithm-made and instant." },
  { icon: PencilLine, title: "KDP checks built in", desc: "Trim, bleed, margins, page counts and spine math flagged before you export." },
];

const STEPS = [
  { n: 1, title: "Describe your book", desc: "Pick a generator, fill in the form, and see the credit cost before you commit." },
  { n: 2, title: "Watch it build", desc: "The Studio opens right away and pages arrive one at a time — review as it goes." },
  { n: 3, title: "Polish and export", desc: "Drag, edit and AI-fix any page, run the KDP check, download a print-ready PDF." },
];

const PLANS = [
  { name: "Basic", price: "$20", per: "/mo", note: "billed annually", credits: "720 credits a year", perks: ["Puzzle generators", "Coloring books", "Cover creator", "Email support"] },
  { name: "Standard", price: "$33.33", per: "/mo", note: "billed annually", credits: "1,800 credits a year", perks: ["Everything in Basic", "Non-fiction generator", "Kids story generator", "AI image editing"] },
  { name: "Premium", price: "$66.67", per: "/mo", note: "billed annually", credits: "4,800 credits a year", perks: ["Everything in Standard", "Early access features", "Advanced analytics", "Bulk export options"] },
  { name: "Unlimited", price: "$133.33", per: "/mo", note: "billed annually", credits: "Unlimited credits", perks: ["Everything in Premium", "No usage caps", "Priority support", "Feature requests"] },
];

const FAQ = [
  {
    q: "What kinds of books can I make?",
    a: "Non-fiction guides, kids storybooks, coloring books, color-by-number, word search, word fit, trivia, sudoku, math workbooks and prompted journals — plus standalone covers and images.",
  },
  {
    q: "How do credits work?",
    a: "Creating books, covers and AI picture actions spend credits; the cost is always shown before you start. Manual edits, reordering and algorithmic puzzles are free, and failed AI actions refund automatically.",
  },
  {
    q: "Are the files ready for print platforms?",
    a: "Exports are print-ready PDFs sized to your trim and bleed, and the built-in check flags the usual KDP blockers before you download. Final submission review is always yours.",
  },
  {
    q: "Do I own what I create?",
    a: "Yes — everything you make in KDP Studio is yours to publish, sell and distribute.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* header */}
      <header className="sticky top-0 z-[var(--z-bar)] border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="KDP Studio home">
            <BookGlyph size={24} />
            <span className="text-lg font-bold text-primary">KDP Studio</span>
          </Link>
          <nav aria-label="Marketing" className="ml-4 hidden gap-5 text-sm font-medium text-ink-2 md:flex">
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </nav>
          <div className="ml-auto flex items-center gap-2.5">
            <Link href="/dashboard" className="text-sm font-medium text-ink-2 hover:text-ink">
              Open the app
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              AI-assisted book creation for KDP publishers
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              From idea to print-ready book in an afternoon.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink-2">
              Generate complete books with consistent art, edit every page in a real
              print-aware editor, and export PDFs that pass KDP&apos;s rules — all in
              your browser.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/dashboard">
                <Button size="lg">
                  Create your first book <ArrowRight className="size-4" aria-hidden />
                </Button>
              </Link>
              <a href="#how">
                <Button size="lg" variant="secondary">See how it works</Button>
              </a>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-3">
              <CheckCircle2 className="size-4 text-success" aria-hidden />
              Full commercial rights · works in any modern browser
            </p>
          </div>
          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
            {["Cozy Rooms to Color", "Oceans Explained", "Times Tables Lab", "The Lantern Fox"].map((t, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={t}
                src={coverArt(t, i + 1, i === 2)}
                alt={`Sample cover — ${t}`}
                className={`w-full rounded-lg border border-line shadow-md ${i % 2 ? "translate-y-6" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="bg-surface-2 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold">Everything a small press needs</h2>
          <p className="mt-2 max-w-xl text-ink-2">
            One workspace for the whole pipeline — no more stitching together five tools
            and a spreadsheet of print rules.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} className="p-5">
                <span className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary">
                  <f.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-ink-2">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold">Three steps, no babysitting</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <Card key={s.n} className="p-6">
                <span className="grid size-9 place-items-center rounded-full bg-primary text-lg font-bold text-on-primary">
                  {s.n}
                </span>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-2">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="bg-surface-2 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold">Plans that scale with your credits</h2>
          <p className="mt-2 text-ink-2">Upgrade, downgrade or cancel anytime.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => (
              <Card key={p.name} className={`flex flex-col p-5 ${p.name === "Standard" ? "border-primary/40 ring-1 ring-primary/20" : ""}`}>
                {p.name === "Standard" && (
                  <span className="mb-2 self-start rounded-pill bg-primary px-2.5 py-0.5 text-xs font-semibold text-on-primary">
                    Most popular
                  </span>
                )}
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-2 text-3xl font-bold">
                  {p.price}
                  <span className="text-base font-medium text-ink-3">{p.per}</span>
                </p>
                <p className="text-xs text-ink-3">{p.note} · {p.credits}</p>
                <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className="mt-5">
                  <Button variant={p.name === "Standard" ? "primary" : "secondary"} className="w-full">
                    Get started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-ink-3">
            Mock billing in this build — no payment is processed.
          </p>
        </div>
      </section>

      {/* faq */}
      <section id="faq" className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold">Common questions</h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-lg border border-line bg-surface p-5 open:shadow-sm">
                <summary className="cursor-pointer list-none font-semibold marker:content-none">
                  <span className="flex items-center justify-between">
                    {f.q}
                    <span className="text-ink-3 transition-transform group-open:rotate-45" aria-hidden>＋</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* cta + footer */}
      <section className="bg-primary py-16 text-on-primary">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to publish your first bestseller?</h2>
          <p className="mx-auto mt-2 max-w-xl text-on-primary/85">
            Open the app and start with a template, a blank book, or a full AI draft.
          </p>
          <Link href="/dashboard" className="mt-6 inline-block">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Open KDP Studio <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Link>
        </div>
      </section>
      <footer className="border-t border-line bg-surface py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-ink-3">
          <p>© 2026 KDP Studio — a UI rebuild study. Original content throughout.</p>
          <nav aria-label="Footer" className="flex gap-4">
            <Link href="/dashboard" className="hover:text-ink">App</Link>
            <Link href="/library" className="hover:text-ink">Templates</Link>
            <Link href="/account/credits" className="hover:text-ink">Credits</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
