import { mockEmployees } from "@/lib/mock/employees";

export function EmployeeSummaryCards() {
  const activeCount = mockEmployees.filter((employee) => employee.status === "active").length;
  const inactiveCount = mockEmployees.filter((employee) => employee.status === "inactive").length;
  const ethiopianCount = mockEmployees.filter((employee) => employee.is_ethiopian_national).length;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Active staff</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{activeCount}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Inactive staff</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{inactiveCount}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Ethiopian nationals</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{ethiopianCount}</p>
      </div>
    </section>
  );
}
