"use client";

import { useQuery } from "@tanstack/react-query";
import { listAllEmployees } from "@/lib/backend-api";

export function PeopleInsights() {
  const employeesQuery = useQuery({
    queryKey: ["employees", "report-summary"],
    queryFn: () => listAllEmployees(true)
  });
  const employees = employeesQuery.data ?? [];
  const activeCount = employees.filter((employee) => employee.status === "active").length;
  const inactiveCount = employees.filter((employee) => employee.status === "inactive").length;
  const averageSalary = Math.round(
    employees.length
      ? employees.reduce((sum, employee) => sum + employee.base_salary_etb, 0) / employees.length
      : 0
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">People insights</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-500">Active staff</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{employeesQuery.isLoading ? "..." : activeCount}</p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-500">Inactive staff</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{employeesQuery.isLoading ? "..." : inactiveCount}</p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-500">Avg. salary</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{employeesQuery.isLoading ? "..." : `${averageSalary.toLocaleString()} ETB`}</p>
        </div>
      </div>
      {employeesQuery.isError ? <p role="alert" className="mt-3 text-sm text-red-700">{employeesQuery.error.message}</p> : null}
    </section>
  );
}
