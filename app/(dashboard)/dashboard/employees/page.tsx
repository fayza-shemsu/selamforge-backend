"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Briefcase } from "lucide-react";
import { EmployeeStatusBadge } from "@/components/EmployeeStatusBadge";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import {
  fetchMockEmployees,
  getOrgUnitName
} from "@/lib/mock/employees";
import { flatOrgUnits } from "@/lib/mock/org-units";

const PAGE_SIZE = 3;

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [orgUnitId, setOrgUnitId] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({ search, org_unit_id: orgUnitId, page, page_size: PAGE_SIZE }),
    [orgUnitId, page, search]
  );

  const employeesQuery = usePaginatedQuery({
    queryKey: ["employees", queryParams],
    queryFn: () => fetchMockEmployees(queryParams)
  });

  const data = employeesQuery.data;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateOrgUnit(value: string) {
    setOrgUnitId(value);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Employees</h1>
          <p className="mt-1 text-sm text-slate-600">
            Built against the shared pagination contract:
            {" {items, total, page, page_size}"}.
          </p>
        </div>
        <Link
          href="/dashboard/employees/new"
          className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Add employee
        </Link>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
          <label className="relative block">
            <span className="sr-only">Search employees</span>
            <Search
              aria-hidden="true"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              className="field pl-10"
              placeholder="Search by name or email"
            />
          </label>

          <label>
            <span className="sr-only">Filter by org unit</span>
            <select
              value={orgUnitId}
              onChange={(event) => updateOrgUnit(event.target.value)}
              className="field"
            >
              <option value="">All org units</option>
              {flatOrgUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
          <table className="hidden w-full border-collapse text-left text-sm md:table">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Org unit</th>
                <th className="px-4 py-3">Hire date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.items.map((employee) => (
                <tr key={employee.id} className="bg-white">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/employees/${employee.id}`}
                      className="font-medium text-brand-700"
                    >
                      {employee.first_name} {employee.last_name}
                    </Link>
                    <p className="text-xs text-slate-500">{employee.email}</p>
                  </td>
                  <td className="px-4 py-3">{getOrgUnitName(employee.org_unit_id)}</td>
                  <td className="px-4 py-3">{employee.hire_date}</td>
                  <td className="px-4 py-3">
                    <EmployeeStatusBadge status={employee.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="divide-y divide-slate-200 md:hidden">
            {data?.items.map((employee) => (
              <Link
                key={employee.id}
                href={`/dashboard/employees/${employee.id}`}
                className="block bg-white p-4"
              >
                <p className="font-medium text-brand-700">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="text-sm text-slate-600">{employee.email}</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <Briefcase aria-hidden="true" size={14} />
                  {getOrgUnitName(employee.org_unit_id)} · {employee.status}
                </p>
              </Link>
            ))}
          </div>

          {employeesQuery.isLoading ? (
            <div className="p-6 text-center text-sm text-slate-500">
              Loading employees...
            </div>
          ) : null}

          {data && data.items.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No employees match those filters. Try a broader keyword or reset the org unit filter.
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <p className="text-slate-600">
            {data ? `${data.total} total employees` : "Loading total"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-200 p-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft aria-hidden="true" size={16} />
            </button>
            <span className="min-w-20 text-center text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="rounded-md border border-slate-200 p-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight aria-hidden="true" size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
