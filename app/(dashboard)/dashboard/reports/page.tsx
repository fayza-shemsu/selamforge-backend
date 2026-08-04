import { EmployeeSummaryCards } from "@/components/EmployeeSummaryCards";
import { EmptyState } from "@/components/EmptyState";
import { PeopleInsights } from "@/components/PeopleInsights";
import { PeopleOperationsPanel } from "@/components/PeopleOperationsPanel";
import { PhaseTwoOperations } from "@/components/PhaseTwoOperations";
import { mockEmployees } from "@/lib/mock/employees";

export default function ReportsPage() {
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
      <PhaseTwoOperations />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Employee summary</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {mockEmployees.length > 0 ? (
            mockEmployees.map((employee) => (
              <div key={employee.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-medium text-ink">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="mt-1 text-sm text-slate-600">{employee.email}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                  {employee.status}
                </p>
              </div>
            ))
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
