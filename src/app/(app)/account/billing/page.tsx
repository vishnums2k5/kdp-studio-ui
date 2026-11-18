"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Receipt, Wallet } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  Progress,
  Table,
  Td,
  Th,
  useToast,
} from "@/components/ui";
import { useApp } from "@/mocks/store";

const PLANS = [
  { name: "Basic", price: "$20/mo", credits: "720 credits / year" },
  { name: "Standard", price: "$33.33/mo", credits: "1,800 credits / year" },
  { name: "Premium", price: "$66.67/mo", credits: "4,800 credits / year" },
  { name: "Unlimited", price: "$133.33/mo", credits: "Unlimited credits" },
];

/** Credits & Billing tab (observed S5: lives at /billing inside Account
 * Settings; has Cancel Subscription). Payments mocked. */
export default function BillingPage() {
  const user = useApp((s) => s.user);
  const ledger = useApp((s) => s.ledger);
  const { toast } = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  return (
    <>
      <Topbar title="Credits & Billing" />
      <div className="mx-auto max-w-4xl px-6 py-8">
        <nav aria-label="Account sections" className="mb-6 flex flex-wrap gap-2">
          {[
            { href: "/account", label: "Profile" },
            { href: "/account/credits", label: "Credits" },
            { href: "/account/billing", label: "Credits & Billing", current: true },
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
            <CreditCard className="size-4.5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold">Your plan</h2>
            <Badge tone="primary" className="ml-1">{user.plan}</Badge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PLANS.map((p) => {
              const current = p.name === user.plan;
              return (
                <div
                  key={p.name}
                  className={`rounded-lg border p-4 ${current ? "border-primary bg-primary-soft/40" : "border-line"}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{p.name}</p>
                    {current && <Badge tone="primary">Current</Badge>}
                  </div>
                  <p className="mt-1 text-2xl font-bold">{p.price}</p>
                  <p className="text-xs text-ink-2">{p.credits}</p>
                  {!current && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-3"
                      loading={upgrading === p.name}
                      onClick={async () => {
                        setUpgrading(p.name);
                        await new Promise((r) => setTimeout(r, 900));
                        useApp.setState({ user: { ...user, plan: p.name as typeof user.plan } });
                        toast({
                          kind: "success",
                          title: `Switched to ${p.name}`,
                          description: "Mock billing — no payment was taken.",
                        });
                        setUpgrading(null);
                      }}
                    >
                      Switch to {p.name}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-md bg-surface-2 p-3.5">
            <p className="text-sm text-ink-2">
              Cancel anytime — your plan stays active until the end of the billing period.
            </p>
            <Button variant="danger-ghost" onClick={() => setCancelOpen(true)}>
              Cancel Subscription
            </Button>
          </div>
          <p className="mt-2 text-xs text-ink-3">Secure checkout powered by Stripe (mock).</p>
        </Card>

        <Card className="mt-6 p-5">
          <div className="flex items-center gap-2">
            <Wallet className="size-4.5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold">Credits balance</h2>
            <span className="ml-auto text-2xl font-bold">{user.credits}</span>
          </div>
          <Progress value={Math.min(100, (user.credits / 180) * 100)} className="mt-3" label="Cycle usage" />
          <p className="mt-2 text-xs text-ink-3">
            Creating books/covers, AI pages and chapter regeneration cost credits — the
            amount is always shown before you start. Failed AI actions refund automatically.
          </p>
        </Card>

        <Card className="mt-6 p-5">
          <div className="flex items-center gap-2">
            <Receipt className="size-4.5 text-primary" aria-hidden />
            <h2 className="text-lg font-bold">Billing history</h2>
          </div>
          <Table className="mt-3">
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Change</Th>
                <Th>Reason</Th>
                <Th className="text-right">Balance</Th>
              </tr>
            </thead>
            <tbody>
              {ledger.slice(0, 10).map((l) => (
                <tr key={l.id}>
                  <Td className="whitespace-nowrap text-ink-3">{new Date(l.at).toLocaleDateString()}</Td>
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
      </div>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="w-[min(92vw,440px)]">
          <div className="p-6">
            <DialogTitle>Cancel subscription?</DialogTitle>
            <p className="mt-2 text-sm text-ink-2">
              Your {user.plan} plan stays active until the end of the billing period, then
              your credits stop renewing. No questions asked.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <DialogClose asChild><Button variant="ghost">Keep my plan</Button></DialogClose>
              <Button
                variant="danger"
                onClick={() => {
                  setCancelOpen(false);
                  toast({
                    kind: "info",
                    title: "Subscription cancelled (mock)",
                    description: `Active until the end of the ${user.plan} billing period.`,
                  });
                }}
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
