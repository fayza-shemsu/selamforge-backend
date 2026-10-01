"use client";

import { useQuery } from "@tanstack/react-query";
import { listAllEmployees } from "@/lib/backend-api";

export function EmployeeSummaryCards() {
  const employeesQuery = useQuery({
    queryKey: ["employees", "report-summary"],
    queryFn: () => listAllEmployees(true)
  });
  const employees = employeesQuery.data ?? [];
  const activeCount = employees.filter((employee) => employee.status === "active").length;
  const inactiveCount = employees.filter((employee) => employee.status === "inactive").length;
  const ethiopianCount = employees.filter((employee) => employee.is_ethiopian_national).length;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Active staff</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{employeesQuery.isLoading ? "..." : activeCount}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Inactive staff</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{employeesQuery.isLoading ? "..." : inactiveCount}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Ethiopian nationals</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{employeesQuery.isLoading ? "..." : ethiopianCount}</p>
      </div>
      {employeesQuery.isError ? <p role="alert" className="md:col-span-3 text-sm text-red-700">{employeesQuery.error.message}</p> : null}
    </section>
  );
}
