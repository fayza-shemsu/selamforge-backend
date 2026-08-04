"use client";

import Link from "next/link";
import { BriefcaseBusiness, Network, UsersRound } from "lucide-react";

const actions = [
  {
    href: "/dashboard/employees/new",
    title: "Add employee",
    description: "Create a new employee record",
    icon: UsersRound
  },
  {
    href: "/dashboard/org-units",
    title: "Manage org units",
    description: "Create or update structure",
    icon: Network
  },
  {
    href: "/dashboard/reports",
    title: "Review reports",
    description: "Open workforce summaries",
    icon: BriefcaseBusiness
  }
];

export function QuickActions() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Quick actions</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-md border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50"
            >
              <div className="flex items-center gap-2 text-brand-700">
                <Icon aria-hidden="true" size={18} />
                <span className="font-medium">{action.title}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
