"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { listAllEmployees, listOrgUnits } from "@/lib/backend-api";

export function TeamDirectory() {
  const employeesQuery = useQuery({
    queryKey: ["employees", "team-directory"],
    queryFn: () => listAllEmployees()
  });
  const unitsQuery = useQuery({ queryKey: ["org-units"], queryFn: listOrgUnits });
  const units = new Map((unitsQuery.data ?? []).map((unit) => [unit.id, unit.name]));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Team directory</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {(employeesQuery.data ?? []).map((employee) => (
          <Link key={employee.id} href={`/dashboard/employees/${employee.id}`} className="rounded-md border border-slate-200 p-3">
            <p className="font-medium text-ink">
              {employee.first_name} {employee.last_name}
            </p>
            <p className="mt-1 text-sm text-slate-600">{employee.email}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
              {employee.org_unit_id ? units.get(employee.org_unit_id) ?? "Unknown unit" : "Unassigned"}
            </p>
          </Link>
        ))}
        {employeesQuery.isLoading ? <p className="text-sm text-slate-500">Loading directory...</p> : null}
        {employeesQuery.isError ? <p role="alert" className="text-sm text-red-700">{employeesQuery.error.message}</p> : null}
        {employeesQuery.data?.length === 0 ? <p className="text-sm text-slate-500">No employees found.</p> : null}
      </div>
    </section>
  );
}
