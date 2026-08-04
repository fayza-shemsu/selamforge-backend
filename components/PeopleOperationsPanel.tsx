import { mockEmployees } from "@/lib/mock/employees";

export function PeopleOperationsPanel() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">People operations</h2>
      <div className="mt-4 space-y-3">
        <div className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-ink">Employment records</p>
          <p className="mt-1 text-sm text-slate-600">{mockEmployees.length} employee records are currently visible.</p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-ink">Lifecycle status</p>
          <p className="mt-1 text-sm text-slate-600">Staff tracking covers active, inactive, and review states.</p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-ink">Next review</p>
          <p className="mt-1 text-sm text-slate-600">Quarterly HR review scheduled for next week.</p>
        </div>
      </div>
    </section>
  );
}
