import { OrgUnitTree } from "@/components/OrgUnitTree";
import { mockOrgUnitTree } from "@/lib/mock/org-units";

export default function OrgUnitsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-ink">Org Structure</h1>
      <p className="mt-1 text-sm text-slate-600">
        Mock tree using the agreed Day 5 response shape.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <OrgUnitTree node={mockOrgUnitTree} />
      </div>
    </div>
  );
}
