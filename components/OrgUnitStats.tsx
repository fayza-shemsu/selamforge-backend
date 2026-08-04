import { mockOrgUnitTree } from "@/lib/mock/org-units";

type OrgUnitTreeLike = {
  children: OrgUnitTreeLike[];
};

function countUnits(node: OrgUnitTreeLike): number {
  return 1 + node.children.reduce((total, child) => total + countUnits(child), 0);
}

export function OrgUnitStats() {
  const totalUnits = countUnits(mockOrgUnitTree);
  const topLevel = mockOrgUnitTree.children.length;

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Total org units</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{totalUnits}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Top-level departments</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{topLevel}</p>
      </div>
    </section>
  );
}
