import { ActivityFeed } from "@/components/ActivityFeed";
import { OrgUnitTree } from "@/components/OrgUnitTree";
import { PhaseTwoOperations } from "@/components/PhaseTwoOperations";
import { PolicyHighlights } from "@/components/PolicyHighlights";
import { QuickActions } from "@/components/QuickActions";
import { TeamDirectory } from "@/components/TeamDirectory";
import { mockOrgUnitTree } from "@/lib/mock/org-units";
import { mockEmployees } from "@/lib/mock/employees";

export default function DashboardPage() {
  const activeCount = mockEmployees.filter((employee) => employee.status === "active").length;
  const inactiveCount = mockEmployees.filter((employee) => employee.status === "inactive").length;
  const recentEmployees = mockEmployees.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">HR dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          A fuller overview of workforce activity, structure, and staffing health.
        </p>
      </div>

      <QuickActions />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Active employees</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Inactive employees</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{inactiveCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Org units</p>
          <p className="mt-2 text-3xl font-semibold text-ink">6</p>
        </div>
      </section>

      <PhaseTwoOperations />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Org structure preview</h2>
          <div className="mt-4">
            <OrgUnitTree node={mockOrgUnitTree} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Recently added employees</h2>
            <div className="mt-4 space-y-3">
              {recentEmployees.map((employee) => (
                <div key={employee.id} className="rounded-md border border-slate-200 p-3">
                  <p className="font-medium text-ink">
                    {employee.first_name} {employee.last_name}
                  </p>
                  <p className="text-sm text-slate-600">{employee.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    {employee.org_unit_id}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <ActivityFeed />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <TeamDirectory />
        <PolicyHighlights />
      </div>
    </div>
  );
}
