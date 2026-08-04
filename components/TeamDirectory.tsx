import { mockEmployees } from "@/lib/mock/employees";
import { getOrgUnitName } from "@/lib/mock/employees";

export function TeamDirectory() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Team directory</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {mockEmployees.map((employee) => (
          <div key={employee.id} className="rounded-md border border-slate-200 p-3">
            <p className="font-medium text-ink">
              {employee.first_name} {employee.last_name}
            </p>
            <p className="mt-1 text-sm text-slate-600">{employee.email}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
              {getOrgUnitName(employee.org_unit_id)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
