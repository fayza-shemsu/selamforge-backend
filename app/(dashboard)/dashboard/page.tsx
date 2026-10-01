"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { OrgUnitTree } from "@/components/OrgUnitTree";
import { QuickActions } from "@/components/QuickActions";
import { TeamDirectory } from "@/components/TeamDirectory";
import { getOrgUnitTree, listAllEmployees } from "@/lib/backend-api";

export default function DashboardPage() {
  const employeesQuery = useQuery({
    queryKey: ["employees", "dashboard"],
    queryFn: () => listAllEmployees(true)
  });
  const unitsQuery = useQuery({ queryKey: ["org-units", "tree"], queryFn: getOrgUnitTree });
  const employees = employeesQuery.data ?? [];
  const activeCount = employees.filter((employee) => employee.status === "active").length;
  const inactiveCount = employees.filter((employee) => employee.status === "inactive").length;
  const recentEmployees = [...employees]
    .sort((left, right) => right.hire_date.localeCompare(left.hire_date))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">HR dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          A fuller overview of workforce activity, structure, and staffing health.
        </p>
      </div>

      <QuickActions />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Active employees</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{employeesQuery.isLoading ? "..." : activeCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Inactive employees</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{employeesQuery.isLoading ? "..." : inactiveCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Org units</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{unitsQuery.isLoading ? "..." : unitsQuery.data?.length ?? 0}</p>
        </div>
      </section>

      {employeesQuery.isError ? <p role="alert" className="text-sm text-red-700">{employeesQuery.error.message}</p> : null}
      {unitsQuery.isError ? <p role="alert" className="text-sm text-red-700">{unitsQuery.error.message}</p> : null}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Org structure preview</h2>
          <div className="mt-4">
            {unitsQuery.data?.map((node) => <OrgUnitTree key={node.id} node={node} />)}
            {unitsQuery.data?.length === 0 ? <p className="text-sm text-slate-500">No org units created yet.</p> : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Recent hires</h2>
            <div className="mt-4 space-y-3">
              {recentEmployees.map((employee) => (
                <Link href={`/dashboard/employees/${employee.id}`} key={employee.id} className="block rounded-md border border-slate-200 p-3">
                  <p className="font-medium text-ink">
                    {employee.first_name} {employee.last_name}
                  </p>
                  <p className="text-sm text-slate-600">{employee.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Hired {employee.hire_date}
                  </p>
                </Link>
              ))}
              {employeesQuery.data?.length === 0 ? <p className="text-sm text-slate-500">No employees yet.</p> : null}
            </div>
          </div>
        </div>
      </section>

      <TeamDirectory />
    </div>
  );
}
