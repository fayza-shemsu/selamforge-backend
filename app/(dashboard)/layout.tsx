import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  UserRound
} from "lucide-react";
import { clearToken } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/org-units", label: "Org Structure", icon: Network }
];

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 md:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-600 text-white">
            <Building2 aria-hidden="true" size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-clay">SelamForge</p>
            <p className="text-xs text-slate-500">HR workspace</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
              >
                <Icon aria-hidden="true" size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
          <button
            type="button"
            className="rounded-md border border-slate-200 p-2 text-slate-700 md:hidden"
            aria-label="Open navigation"
          >
            <Menu aria-hidden="true" size={20} />
          </button>
          <div className="hidden text-sm font-medium text-slate-600 md:block">
            Foundation workspace
          </div>
          <form action={clearToken}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              title="Sign out"
            >
              <UserRound aria-hidden="true" size={16} />
              <span className="hidden sm:inline">Selam</span>
              <LogOut aria-hidden="true" size={16} />
            </button>
          </form>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
