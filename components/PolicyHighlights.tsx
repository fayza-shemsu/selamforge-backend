export function PolicyHighlights() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Policy highlights</h2>
      <div className="mt-4 space-y-3">
        <div className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-ink">Attendance policy</p>
          <p className="mt-1 text-sm text-slate-600">Weekly attendance review is maintained for all employees.</p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-ink">Compensation review</p>
          <p className="mt-1 text-sm text-slate-600">Salary records are tracked centrally for transparency.</p>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-ink">Nationality and compliance</p>
          <p className="mt-1 text-sm text-slate-600">Ethiopian national status remains visible in employee profiles.</p>
        </div>
      </div>
    </section>
  );
}
