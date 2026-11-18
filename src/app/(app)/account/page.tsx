"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Palette, Save, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  Select,
  Switch,
  useToast,
} from "@/components/ui";
import { useApp } from "@/mocks/store";
import { useTheme } from "@/lib/theme";

/** Account settings (Phase 9). Layout UNOBSERVED (help text confirms
 * sidebar access + tabs incl. Credits & Billing) — placeholder in observed
 * design language. */
export default function AccountPage() {
  const user = useApp((s) => s.user);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [lang, setLang] = useState("en");
  const [prefs, setPrefs] = useState({ autoExportReminder: true, weeklyDigest: false });

  return (
    <>
      <Topbar title="Account settings" />
      <div className="mx-auto max-w-4xl px-6 py-8">
        <nav aria-label="Account sections" className="mb-6 flex flex-wrap gap-2">
          {[
            { href: "/account", label: "Profile", current: true },
            { href: "/account/credits", label: "Credits" },
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <ShieldCheck className="size-4.5 text-primary" aria-hidden /> Profile
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Display name" htmlFor="name">
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Email" htmlFor="email" hint="Changing email re-verifies your account.">
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Language" htmlFor="lang">
                <Select
                  id="lang"
                  value={lang}
                  onValueChange={setLang}
                  options={[
                    { value: "en", label: "English" },
                    { value: "de", label: "Deutsch" },
                    { value: "es", label: "Español" },
                  ]}
                />
              </Field>
              <Button
                className="self-start"
                onClick={() => {
                  useApp.setState({ user: { ...useApp.getState().user, name, email } });
                  toast({ kind: "success", title: "Profile saved" });
                }}
              >
                <Save className="size-4" aria-hidden /> Save changes
              </Button>
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Palette className="size-4.5 text-primary" aria-hidden /> Preferences
              </h2>
              <div className="mt-4 flex flex-col gap-3.5">
                <label className="flex items-center justify-between text-sm font-medium">
                  Theme
                  <Select
                    className="w-32"
                    ariaLabel="Theme"
                    value={theme}
                    onValueChange={(v) => setTheme(v as "light" | "dark")}
                    options={[
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                    ]}
                  />
                </label>
                <label className="flex items-center justify-between text-sm font-medium">
                  Export reminder before closing
                  <Switch
                    checked={prefs.autoExportReminder}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, autoExportReminder: v }))}
                    aria-label="Export reminder"
                  />
                </label>
                <label className="flex items-center justify-between text-sm font-medium">
                  Weekly digest email
                  <Switch
                    checked={prefs.weeklyDigest}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, weeklyDigest: v }))}
                    aria-label="Weekly digest"
                  />
                </label>
              </div>
              <p className="mt-3 text-xs text-ink-3">
                Dark theme is an ASSUMPTION — the reference shows light only.
              </p>
            </Card>

            <Card className="p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <KeyRound className="size-4.5 text-primary" aria-hidden /> Security
              </h2>
              <p className="mt-2 text-sm text-ink-2">
                Password and sign-in management arrive with real authentication
                (Phase 12).
              </p>
              <Button variant="secondary" className="mt-3" disabled>
                Change password — Phase 12 (auth)
              </Button>
              <div className="mt-4">
                <Badge tone="info">Signed in as {user.email}</Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
