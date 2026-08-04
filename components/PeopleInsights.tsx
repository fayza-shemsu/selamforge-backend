import { mockEmployees } from "@/lib/mock/employees";

export function PeopleInsights() {
  const activeCount = mockEmployees.filter((employee) => employee.status === "active").length;
  const inactiveCount = mockEmployees.filter((employee) => employee.status === "inactive").length;
  const averageSalary = Math.round(
    mockEmployees.reduce((sum, employee) => sum + employee.base_salary_etb, 0) / mockEmployees.length
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">People insights</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-500">Active staff</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{activeCount}</p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-500">Inactive staff</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{inactiveCount}</p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-500">Avg. salary</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{averageSalary.toLocaleString()} ETB</p>
        </div>
      </div>
    </section>
  );
}
