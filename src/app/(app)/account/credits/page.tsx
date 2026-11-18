"use client";

import Link from "next/link";
import { Info, Plus, Wallet, Zap } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import {
  Badge,
  Button,
  Card,
  Progress,
  Table,
  Td,
  Th,
  useToast,
} from "@/components/ui";
import { useApp } from "@/mocks/store";

const PACKS = [
  { credits: 60, price: "$19.99", note: "Starter pack" },
  { credits: 180, price: "$49.99", note: "Standard pack" },
  { credits: 500, price: "$119.99", note: "Big pack" },
];

export default function CreditsPage() {
  const user = useApp((s) => s.user);
  const ledger = useApp((s) => s.ledger);
  const grant = useApp((s) => s.grant);
  const { toast } = useToast();

  return (
    <>
      <Topbar title="Buy Credit Packs" />
      <div className="mx-auto max-w-4xl px-6 py-8">
        <nav aria-label="Account sections" className="mb-6 flex flex-wrap gap-2">
          {[
            { href: "/account", label: "Profile" },
            { href: "/account/credits", label: "Credits", current: true },
            { href: "/account/billing", label: "Credits & Billing" },
            { href: "/account/tasks", label: "Tasks & downloads" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.current ? "page" : undefined}
              className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                l.current ? "bg-primary text-on-primary" : "bg-surface text-ink-2 hover:bg-surface-3 border border-line"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Wallet className="size-4.5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold">Balance</h2>
            <span className="ml-auto text-3xl font-bold">{user.credits}</span>
          </div>
          <Progress value={Math.min(100, (user.credits / 180) * 100)} className="mt-3" label="Cycle usage" />
          <p className="mt-2 flex items-start gap-2 text-sm text-ink-2">
            <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
            Kids book pages cost 1 credit each, coloring pages 1 per 3 pages, a chapter
            regeneration 2. Every AI picture action is 1 credit per new picture. Manual
            edits are always free.
          </p>
        </Card>

        <h2 className="mb-3 mt-8 text-lg font-bold">Credit packs</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {PACKS.map((p) => (
            <Card key={p.credits} className="p-5 text-center">
              <p className="text-3xl font-bold">{p.credits}</p>
              <p className="text-sm text-ink-2">credits</p>
              <p className="mt-1 text-xs text-ink-3">{p.note}</p>
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  grant(p.credits, `Credit pack purchase (${p.price})`);
                  toast({
                    kind: "success",
                    title: `${p.credits} credits added`,
                    description: `Mock checkout — ${p.price} not charged.`,
                  });
                }}
              >
                <Plus className="size-4" aria-hidden /> Buy for {p.price}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between rounded-lg border border-primary/20 bg-primary-soft p-4">
          <div>
            <p className="text-sm font-semibold">Or upgrade your plan</p>
            <p className="mt-0.5 text-sm text-ink-2">
              Plans include yearly credits at a lower per-credit rate.
            </p>
          </div>
          <Link href="/account/billing">
            <Button>
              <Zap className="size-4" aria-hidden /> Compare plans
            </Button>
          </Link>
        </div>

        <h2 className="mb-3 mt-8 text-lg font-bold">Recent activity</h2>
        <Card className="overflow-hidden">
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Change</Th>
                <Th>Reason</Th>
                <Th className="text-right">Balance</Th>
              </tr>
            </thead>
            <tbody>
              {ledger.slice(0, 8).map((l) => (
                <tr key={l.id}>
                  <Td className="whitespace-nowrap text-ink-3">{new Date(l.at).toLocaleString()}</Td>
                  <Td className={`font-medium ${l.delta < 0 ? "text-danger" : "text-success"}`}>
                    {l.delta > 0 ? `+${l.delta}` : l.delta || "—"}
                  </Td>
                  <Td className="text-ink-2">{l.reason}</Td>
                  <Td className="text-right font-medium">{l.balanceAfter}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <div className="mt-4">
          <Badge tone="info">Payments are mocked in Phases 1–9</Badge>
        </div>
      </div>
    </>
  );
}
