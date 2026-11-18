"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  FileText,
  Lightbulb,
  Wallet,
  Brain,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge, Card, Progress, Skeleton } from "@/components/ui";
import { useApp } from "@/mocks/store";
import { coverFor } from "@/mocks/data";
import { BOOK_TYPE_LABEL } from "@/mocks/types";

/** Screen spec: docs/screens/dashboard.md — layout UNOBSERVED in the
 * reference (dashboard route never appears in official videos); built in the
 * observed design language as a labeled placeholder. */
export default function DashboardPage() {
  const books = useApp((s) => s.books);
  const user = useApp((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [errored] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const recent = books.filter((b) => !b.archived).slice(0, 4);
  const monthlyAllowance = 180;

  return (
    <>
      <Topbar title="Overview" />
      <div className="mx-auto max-w-6xl px-6 py-8">
        {errored ? (
          <Card className="border-danger bg-danger-soft p-6">
            <p className="font-semibold text-danger">Couldn&apos;t load your overview.</p>
            <p className="mt-1 text-sm text-ink-2">Retry in a moment.</p>
          </Card>
        ) : (
          <>
            <section aria-labelledby="welcome" className="mb-8">
              <p className="text-sm text-ink-2">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h2 id="welcome" className="mt-1 text-2xl font-bold">
                Welcome back, {user.name.split(" ")[0]}
              </h2>
            </section>

            <section aria-label="Quick actions" className="mb-8">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { href: "/create/kids-story", label: "Kids story", icon: BookMarked, desc: "An illustrated storybook" },
                  { href: "/create/coloring", label: "Coloring book", icon: Lightbulb, desc: "Line art pages to color" },
                  { href: "/create/non-fiction", label: "Non-fiction", icon: FileText, desc: "Outline-first guides" },
                  { href: "/create/trivia", label: "Trivia", icon: Brain, desc: "Fact-checked rounds" },
                ].map((a) => (
                  <Link key={a.href} href={a.href}>
                    <Card interactive className="flex items-center gap-3 p-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
                        <a.icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{a.label}</p>
                        <p className="truncate text-xs text-ink-2">{a.desc}</p>
                      </div>
                      <ArrowRight className="ml-auto size-4 text-ink-3" aria-hidden />
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              <section aria-labelledby="recent" className="lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <h3 id="recent" className="text-lg font-bold">
                    Continue working on
                  </h3>
                  <Link href="/books" className="text-sm font-medium text-primary hover:underline">
                    My Books
                  </Link>
                </div>
                {loading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-44" />
                    ))}
                  </div>
                ) : recent.length === 0 ? (
                  <Card className="grid place-items-center border-dashed p-10 text-center">
                    <p className="font-semibold">No books yet</p>
                    <p className="mt-1 text-sm text-ink-2">
                      Create your first book — most take a couple of minutes.
                    </p>
                    <Link
                      href="/create"
                      className="mt-4 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-on-primary"
                    >
                      Create book
                    </Link>
                  </Card>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {recent.map((b) => (
                      <Link key={b.id} href={`/studio/${b.id}`}>
                        <Card interactive className="flex gap-4 p-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={coverFor(b)}
                            alt=""
                            className="h-28 w-22 shrink-0 rounded-md border border-line object-cover"
                          />
                          <div className="flex min-w-0 flex-col">
                            <p className="truncate text-sm font-semibold">{b.title}</p>
                            <p className="text-xs text-ink-3">
                              {BOOK_TYPE_LABEL[b.type]} · {b.pages.length} pages
                            </p>
                            <div className="mt-auto flex items-center gap-2">
                              {b.status === "generating" ? (
                                <Badge tone="warning">Generating…</Badge>
                              ) : (
                                <Badge tone="success">Ready</Badge>
                              )}
                              <Badge tone="neutral">{b.trim.w}×{b.trim.h} in</Badge>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <section aria-labelledby="credits-widget" className="flex flex-col gap-6">
                <Card className="p-5">
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4.5 text-primary" aria-hidden />
                    <h3 id="credits-widget" className="text-sm font-semibold">
                      Credits
                    </h3>
                  </div>
                  <p className="mt-3 text-3xl font-bold">{user.credits}</p>
                  <Progress
                    value={Math.min(100, (user.credits / monthlyAllowance) * 100)}
                    className="mt-2"
                    label="Monthly allowance used"
                  />
                  <p className="mt-2 text-xs text-ink-3">
                    {user.plan} plan · {monthlyAllowance} credits this cycle
                  </p>
                  <Link
                    href="/account/credits"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Buy Credit Packs <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </Card>

                <Card className="p-5">
                  <h3 className="text-sm font-semibold">Getting started</h3>
                  <ol className="mt-3 flex flex-col gap-2.5 text-sm">
                    {[
                      { done: books.length > 0, label: "Create your first book" },
                      { done: books.some((b) => b.status === "ready"), label: "Open the Studio and review pages" },
                      { done: false, label: "Export a print-ready PDF" },
                    ].map((step) => (
                      <li key={step.label} className="flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                            step.done
                              ? "bg-success text-white"
                              : "border border-line-strong text-ink-3"
                          }`}
                        >
                          {step.done ? "✓" : ""}
                        </span>
                        <span className={step.done ? "text-ink-3 line-through" : "text-ink"}>
                          {step.label}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Card>

                <Card className="bg-primary-soft border-primary/20 p-5">
                  <p className="text-sm font-semibold text-primary">Tip</p>
                  <p className="mt-1 text-sm text-ink-2">
                    Open a book and run the KDP check before you export — it flags page
                    count, margins and trim problems in one panel.
                  </p>
                </Card>
              </section>
            </div>
          </>
        )}
      </div>
    </>
  );
}
