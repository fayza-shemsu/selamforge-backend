import { OrgUnitTree } from "@/components/OrgUnitTree";
import { mockOrgUnitTree } from "@/lib/mock/org-units";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Phase 1 foundation shell with auth wiring and org structure preview.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Org structure preview</h2>
        <div className="mt-4">
          <OrgUnitTree node={mockOrgUnitTree} />
        </div>
      </section>
    </div>
  );
}
