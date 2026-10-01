import type { OrgUnit } from "@/lib/types/org-unit";

export function OrgUnitStats({ units }: { units: OrgUnit[] }) {
  const topLevel = units.filter((unit) => unit.parent_unit_id === null).length;

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Total org units</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{units.length}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Top-level departments</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{topLevel}</p>
      </div>
    </section>
  );
}
