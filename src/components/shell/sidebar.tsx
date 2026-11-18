"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Brain,
  ChevronDown,
  Compass,
  FileText,
  GraduationCap,
  Grid3x3,
  Home,
  Image as ImageIcon,
  Lightbulb,
  Plus,
  Shapes,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/primitives";
import { useApp } from "@/mocks/store";
import { Avatar } from "@/components/ui/primitives";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";

const dashboardLinks = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/books", label: "My Books", icon: BookMarked },
  { href: "/images", label: "My Images", icon: ImageIcon },
];

const generatorLinks = [
  { href: "/create/kids-story", label: "Kids Books", icon: BookOpen },
  { href: "/create/non-fiction", label: "Non-Fiction", icon: FileText },
  { href: "/create/coloring", label: "Coloring Books", icon: Lightbulb },
  { href: "/create/word-search", label: "Word Search", icon: Grid3x3 },
  { href: "/create/trivia", label: "Trivia", icon: Brain },
  { href: "/create/sudoku", label: "Sudoku", icon: Shapes },
];

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn("flex items-center gap-2.5 px-1", className)}
      aria-label="KDP Studio home"
    >
      <BookGlyph />
      <span className="text-lg font-bold tracking-tight text-primary">
        KDP Studio
      </span>
    </Link>
  );
}

export function BookGlyph({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M14 5.5C11 3.8 7 3.6 4.5 4.6c-.6.2-1 .8-1 1.4v14.6c0 .9.9 1.5 1.8 1.2 2.2-.7 5.5-.4 8.7 1.7V5.5Z"
        fill="#5646D6"
      />
      <path
        d="M14 5.5c3-1.7 7-1.9 9.5-.9.6.2 1 .8 1 1.4v14.6c0 .9-.9 1.5-1.8 1.2-2.2-.7-5.5-.4-8.7 1.7V5.5Z"
        fill="#8C83F0"
      />
      <path d="M14 5.5v18" stroke="#2A2358" strokeWidth="1.6" />
    </svg>
  );
}

function NavSection({
  label,
  links,
  collapsed,
  activePath,
  collapsible = true,
}: {
  label: string;
  links: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  collapsed?: boolean;
  activePath: string;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-1">
      <button
        onClick={() => collapsible && setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary",
          collapsible && "hover:bg-surface-3",
        )}
      >
        {label}
        {collapsible && (
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-[var(--d-fast)]",
              !open && "-rotate-90",
            )}
            aria-hidden
          />
        )}
      </button>
      {open && (
        <nav aria-label={label} className="mt-0.5 flex flex-col gap-0.5">
          {links.map((l) => {
            const active =
              activePath === l.href ||
              (l.href !== "/dashboard" && activePath.startsWith(l.href));
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-[var(--d-fast)]",
                  active
                    ? "bg-primary text-on-primary"
                    : "text-ink-2 hover:bg-surface-3 hover:text-ink",
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useApp((s) => s.user);
  return (
    <div className="flex h-full flex-col">
      <div className="px-3 pt-5">
        <Logo />
      </div>
      <div className="px-3 pt-5">
        <Link
          href="/create"
          onClick={onNavigate}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover"
        >
          <Plus className="size-4.5" aria-hidden />
          Create book
        </Link>
      </div>
      <div className="mt-3 flex-1 overflow-y-auto px-2 pb-4">
        <NavSection
          label="Dashboard"
          links={dashboardLinks}
          activePath={pathname}
        />
        <NavSection
          label="Book generators"
          links={generatorLinks}
          activePath={pathname}
        />
        <NavSection
          label="Learn"
          collapsible={false}
          links={[
            { href: "/library", label: "Guides & templates", icon: GraduationCap },
            { href: "/research", label: "Niche research", icon: Compass },
            { href: "/account/billing", label: "Manage plan", icon: BarChart3 },
          ]}
          activePath={pathname}
        />
        <div className="mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-2">
          <GraduationCap className="size-4.5 shrink-0" />
          KDP Course
          <Badge tone="success" className="ml-auto">Free</Badge>
        </div>
      </div>
      <div className="border-t border-line px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-md p-1.5 text-left hover:bg-surface-3 transition-colors">
              <Avatar name={user.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                <p className="truncate text-xs text-ink-3">{user.plan} plan</p>
              </div>
              <ChevronDown className="size-4 text-ink-3" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/account">Account settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/credits">Credits</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/billing">Credits &amp; billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              Sign out — Phase 12 (auth)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside
      className="fixed inset-y-0 left-0 z-[var(--z-rail)] hidden w-[var(--shell-sidebar-w)] border-r border-line bg-surface md:block"
      aria-label="Primary"
    >
      <SidebarBody />
    </aside>
  );
}
