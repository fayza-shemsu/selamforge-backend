"use client";

import { useQuery } from "@tanstack/react-query";
import { listAllEmployees } from "@/lib/backend-api";

export function PeopleOperationsPanel() {
  const employeesQuery = useQuery({
    queryKey: ["employees", "report-summary"],
    queryFn: () => listAllEmployees(true)
  });
  const employees = employeesQuery.data ?? [];
  const activeCount = employees.filter((employee) => employee.status === "active").length;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">People operations</h2>
      <div className="mt-4 space-y-3">
        <div className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-ink">Employment records</p>
          <p className="mt-1 text-sm text-slate-600">
            {employeesQuery.isLoading ? "Loading employee records..." : `${employees.length} employee records are available.`}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-ink">Lifecycle status</p>
          <p className="mt-1 text-sm text-slate-600">
            {employeesQuery.isLoading ? "Loading status..." : `${activeCount} active employees in this organization.`}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-ink">Next review</p>
          <p className="mt-1 text-sm text-slate-600">Employment data is tenant-scoped to your organization.</p>
        </div>
      </div>
    </section>
  );
}
