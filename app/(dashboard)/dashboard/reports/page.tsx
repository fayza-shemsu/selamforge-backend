"use client";

import { EmployeeSummaryCards } from "@/components/EmployeeSummaryCards";
import { EmptyState } from "@/components/EmptyState";
import { PeopleInsights } from "@/components/PeopleInsights";
import { PeopleOperationsPanel } from "@/components/PeopleOperationsPanel";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { listAllEmployees } from "@/lib/backend-api";

export default function ReportsPage() {
  const employeesQuery = useQuery({
    queryKey: ["employees", "report-summary"],
    queryFn: () => listAllEmployees(true)
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          A lightweight reporting view for the employee roster and structure.
        </p>
      </div>

      <EmployeeSummaryCards />
      <PeopleInsights />
      <PeopleOperationsPanel />
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Employee summary</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {employeesQuery.data?.length ? (
            employeesQuery.data.map((employee) => (
              <Link href={`/dashboard/employees/${employee.id}`} key={employee.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-medium text-ink">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="mt-1 text-sm text-slate-600">{employee.email}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                  {employee.status}
                </p>
              </Link>
            ))
          ) : employeesQuery.isLoading ? (
            <p className="text-sm text-slate-500">Loading employee report...</p>
          ) : employeesQuery.isError ? (
            <p role="alert" className="text-sm text-red-700">{employeesQuery.error.message}</p>
          ) : (
            <EmptyState
              title="No employee records yet"
              description="Create one from the employee section to see it here."
            />
          )}
        </div>
      </section>
    </div>
  );
}
