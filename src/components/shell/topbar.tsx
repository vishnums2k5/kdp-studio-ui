"use client";

import Link from "next/link";
import { Menu, Moon, Plus, Sun, Wallet, Zap } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/dialog";
import { useTheme } from "@/lib/theme";
import { useApp } from "@/mocks/store";
import { SidebarBody } from "./sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { useState } from "react";

/**
 * Top bar. The reference's exact credits-pill anatomy is blurred in every
 * official video (UNOBSERVED) — a placeholder pill with an explanatory
 * tooltip is used until the user's captures arrive (rule 5).
 */
export function Topbar({ title }: { title?: string }) {
  const { theme, setTheme } = useTheme();
  const credits = useApp((s) => s.user.credits);
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-[var(--z-bar)] flex h-[72px] items-center gap-3 border-b border-line bg-surface/95 px-4 backdrop-blur md:px-6">
        <button
          className="grid size-9 place-items-center rounded-md text-ink-2 hover:bg-surface-3 md:hidden"
          onClick={() => setMobileNav(true)}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>

        {title && (
          <h1 className="truncate text-lg font-bold text-ink">{title}</h1>
        )}

        <div className="ml-auto flex items-center gap-2.5">
          <Tooltip
            content="Placeholder — the reference's exact credits display is UNOBSERVED (blurred in all official videos). Built as credits-count pill."
          >
            <button
              className="flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:bg-surface-3"
              aria-label={`${credits} credits remaining`}
            >
              <Wallet className="size-4 text-primary" aria-hidden />
              {credits} credits
            </button>
          </Tooltip>
          <Link
            href="/account/credits"
            className="flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:bg-surface-3"
          >
            <Plus className="size-4 text-primary" aria-hidden />
            Buy Credit Packs
          </Link>
          <Link
            href="/account/billing"
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover"
          >
            <Zap className="size-4" aria-hidden />
            Upgrade
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="grid size-9 place-items-center rounded-md text-ink-2 hover:bg-surface-3 transition-colors"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>
        </div>
      </header>

      <Drawer open={mobileNav} onOpenChange={setMobileNav}>
        <DrawerContent side="left">
          <DrawerTitle className="sr-only">Navigation</DrawerTitle>
          <SidebarBody onNavigate={() => setMobileNav(false)} />
        </DrawerContent>
      </Drawer>
    </>
  );
}

