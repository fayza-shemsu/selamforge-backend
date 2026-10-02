"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CalendarClock,
  ChevronRight,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Network,
  Search,
  Settings,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  UserSearch,
  UsersRound,
  X
} from "lucide-react";
import BrandMark from "@/components/BrandMark";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/org-units", label: "Org Structure", icon: Network },
  { href: "/dashboard/employees", label: "Employees", icon: UsersRound },
  { href: "/dashboard/talent", label: "Talent Acquisition", icon: UserSearch },
  { href: "/dashboard/okr", label: "OKR", icon: Target },
  { href: "/dashboard/cfr", label: "CFR", icon: MessageSquareText },
  { href: "/dashboard/learning", label: "Learning & Growth", icon: GraduationCap },
  { href: "/dashboard/payroll", label: "Payroll", icon: DollarSign },
  { href: "/dashboard/attendance", label: "Time & Attendance", icon: CalendarClock },
  { href: "/dashboard/compensation", label: "Compensation", icon: Trophy },
  { href: "/dashboard/copilot", label: "AI Copilot", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

type DashboardShellProps = {
  children: React.ReactNode;
  role: string;
  signOutAction: () => Promise<void>;
};

function SidebarContents({
  pathname,
  onNavigate,
  mobile = false
}: {
  pathname: string;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  return (
    <>
      <Link
        href="/dashboard"
        className="flex shrink-0 items-center gap-3 px-5 py-5"
        onClick={onNavigate}
      >
        <BrandMark />
        <span>
          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            SELAMFORGE
          </span>
          <span className="mt-0.5 block text-sm font-semibold text-slate-900">
            HR workspace
          </span>
        </span>
      </Link>

      <p className="shrink-0 px-5 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        Workspace
      </p>

      <nav
        aria-label="Workspace modules"
        className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 pb-5"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`group relative flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-medium ${
                active
                  ? "text-teal-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={mobile ? "mobile-active-nav" : "active-nav"}
                  className="absolute inset-0 rounded-xl bg-teal-50 ring-1 ring-inset ring-teal-100"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative flex min-w-0 items-center gap-3">
                <Icon
                  aria-hidden="true"
                  size={18}
                  className={
                    active
                      ? "text-teal-700"
                      : "text-slate-400 group-hover:text-slate-600"
                  }
                />
                <span className="truncate">{item.label}</span>
              </span>
              {active && (
                <ChevronRight
                  aria-hidden="true"
                  size={16}
                  className="relative shrink-0 text-teal-700"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        12 workspace modules
      </div>
    </>
  );
}

export default function DashboardShell({
  children,
  role,
  signOutAction
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_rgba(99,102,241,0.12),transparent_42%),linear-gradient(135deg,#f1f5f9_0%,#eef2ff_54%,#f5f3ff_100%)] text-slate-900 antialiased">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/80 bg-white/75 shadow-[8px_0_30px_rgba(30,41,59,0.04)] backdrop-blur-xl md:flex">
        <SidebarContents pathname={pathname} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.button
              aria-label="Close navigation"
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              type="button"
            />
            <motion.aside
              className="absolute inset-y-0 left-0 flex w-[min(18rem,86vw)] flex-col border-r border-white/80 bg-white shadow-2xl"
              initial={{ x: -28, opacity: 0.7 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -28, opacity: 0.7 }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <div className="flex shrink-0 justify-end px-4 pt-3">
                <button
                  aria-label="Close navigation"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  onClick={() => setMobileOpen(false)}
                  type="button"
                >
                  <X aria-hidden="true" size={19} />
                </button>
              </div>
              <SidebarContents
                mobile
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="md:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/70 px-4 backdrop-blur-xl md:px-6">
          <div className="flex h-16 items-center justify-between gap-4 md:h-20">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-label="Open navigation"
                className="rounded-xl border border-slate-200/80 bg-white/80 p-2 text-slate-700 shadow-sm transition hover:bg-white md:hidden"
                onClick={() => setMobileOpen(true)}
                type="button"
              >
                <Menu aria-hidden="true" size={18} />
              </button>
              <div className="min-w-0">
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
                  Workspace
                </p>
                <p className="truncate text-sm font-medium text-slate-700">
                  Phase 1 workforce workspace
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <label className="hidden items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-sm text-slate-500 shadow-sm lg:flex">
                <Search aria-hidden="true" size={15} />
                <input
                  aria-label="Search dashboard"
                  className="w-32 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 xl:w-40"
                  placeholder="Search"
                />
                <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                  ⌘K
                </span>
              </label>

              <button
                aria-label="Notifications"
                className="relative rounded-xl border border-slate-200/80 bg-white/80 p-2.5 text-slate-600 shadow-sm hover:text-slate-900"
                type="button"
              >
                <Bell aria-hidden="true" size={17} />
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-semibold text-white">
                  3
                </span>
              </button>

              <form action={signOutAction}>
                <button
                  className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-2 py-1.5 text-sm font-medium text-slate-700 shadow-sm sm:px-3 sm:py-2"
                  title="Sign out"
                  type="submit"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-white">
                    <UserRound aria-hidden="true" size={14} />
                  </span>
                  <span className="hidden capitalize sm:inline">{role}</span>
                  <LogOut
                    aria-hidden="true"
                    className="text-slate-400"
                    size={15}
                  />
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}