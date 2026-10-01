"use client";

import { useQuery } from "@tanstack/react-query";
import { EmployeeForm } from "@/components/EmployeeForm";
import { LeaveBalanceCard } from "@/components/LeaveBalanceCard";
import { ReportsChain } from "@/components/ReportsChain";
import { Briefcase, CalendarDays, Mail, ShieldCheck } from "lucide-react";
import { getEmployee, getOrgUnitTree, getReportsChain } from "@/lib/backend-api";
import type { OrgUnitNode } from "@/lib/types/org-unit";

type EmployeeDetailPageProps = {
  params: {
    id: string;
  };
};

function findUnit(node: OrgUnitNode, unitId: string): OrgUnitNode | null {
  if (node.id === unitId) return node;
  for (const child of node.children) {
    const match = findUnit(child, unitId);
    if (match) return match;
  }
  return null;
}

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const employeeQuery = useQuery({
    queryKey: ["employees", params.id],
    queryFn: () => getEmployee(params.id)
  });
  const orgUnitsQuery = useQuery({
    queryKey: ["org-units", "tree"],
    queryFn: getOrgUnitTree
  });
  const reportsQuery = useQuery({
    queryKey: ["employees", params.id, "reports-chain"],
    queryFn: () => getReportsChain(params.id),
    enabled: Boolean(employeeQuery.data)
  });
  const employee = employeeQuery.data;

  if (employeeQuery.isLoading) {
    return <p className="text-sm text-slate-500">Loading employee...</p>;
  }

  if (employeeQuery.isError || !employee) {
    return (
      <p role="alert" className="text-sm text-red-700">
        {employeeQuery.error?.message ?? "Employee not found."}
      </p>
    );
  }

  function findUnitName(unitId: string | null): string {
    if (!unitId) return "Unassigned";
    for (const root of orgUnitsQuery.data ?? []) {
      const match = findUnit(root, unitId);
      if (match) return match.name;
    }
    return "Unknown unit";
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {employee.first_name} {employee.last_name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{employee.email}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500">
            <Briefcase aria-hidden="true" size={16} />
            <p className="text-xs uppercase">Org unit</p>
          </div>
          <p className="mt-2 font-medium text-ink">
            {findUnitName(employee.org_unit_id)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500">
            <CalendarDays aria-hidden="true" size={16} />
            <p className="text-xs uppercase">Hire date</p>
          </div>
          <p className="mt-2 font-medium text-ink">{employee.hire_date}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck aria-hidden="true" size={16} />
            <p className="text-xs uppercase">Status</p>
          </div>
          <p className="mt-2 font-medium capitalize text-ink">{employee.status}</p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Contact details</h2>
        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Mail aria-hidden="true" size={16} />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase aria-hidden="true" size={16} />
            <span>Base salary: {employee.base_salary_etb.toLocaleString()} ETB</span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">People profile snapshot</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Employment status</p>
            <p className="mt-2 font-medium capitalize text-ink">{employee.status}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Nationality</p>
            <p className="mt-2 font-medium text-ink">
              {employee.is_ethiopian_national ? "Ethiopian" : "Other"}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Salary band</p>
            <p className="mt-2 font-medium text-ink">
              {employee.base_salary_etb >= 50000 ? "Senior" : "Standard"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Reports To</h2>
        <div className="mt-3">
          {reportsQuery.isError ? (
            <p role="status" className="text-sm text-slate-500">{reportsQuery.error.message}</p>
          ) : (
            <ReportsChain chain={reportsQuery.data?.chain ?? []} />
          )}
        </div>
      </section>

      <LeaveBalanceCard employeeId={employee.id} />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Edit employee</h2>
        <div className="mt-4">
          <EmployeeForm
            key={employee.id}
            employeeId={employee.id}
            defaultValues={{
              first_name: employee.first_name,
              last_name: employee.last_name,
              email: employee.email,
              hire_date: employee.hire_date,
              base_salary_etb: employee.base_salary_etb,
              org_unit_id: employee.org_unit_id ?? "",
              is_ethiopian_national: employee.is_ethiopian_national
            }}
          />
        </div>
      </section>
    </div>
  );
}
