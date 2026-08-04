export function PhaseTwoOperations() {
  const stages = [
    { name: "Screening", count: 8, tone: "bg-brand-50 text-brand-700" },
    { name: "Interview", count: 4, tone: "bg-sky-50 text-sky-700" },
    { name: "Offer", count: 2, tone: "bg-amber-50 text-amber-700" },
    { name: "Onboarding", count: 3, tone: "bg-leaf/10 text-leaf" }
  ];

  const priorities = [
    {
      title: "Manager approvals",
      detail: "Two manager sign-offs are due before the next payroll run.",
      accent: "High"
    },
    {
      title: "Probation reviews",
      detail: "Three probationary employees require end-of-month follow-up.",
      accent: "Medium"
    },
    {
      title: "Training calendar",
      detail: "Leadership sessions are scheduled for next Thursday and Friday.",
      accent: "Planned"
    }
  ];

  const compliance = [
    "Employee files reviewed for the new quarter",
    "Attendance exceptions flagged for HR follow-up",
    "Compensation change requests pending approval"
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Phase 2 operations center</h2>
          <p className="mt-1 text-sm text-slate-600">
            A more complete view of staffing flow, approvals, and compliance readiness.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          Ready for backend sync
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Hiring pipeline
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {stages.map((stage) => (
              <div key={stage.name} className="rounded-md border border-slate-200 p-3">
                <p className="text-sm font-medium text-ink">{stage.name}</p>
                <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stage.tone}`}>
                  {stage.count} open
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border border-slate-200 p-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Upcoming priorities
            </h3>
            <div className="mt-3 space-y-3">
              {priorities.map((item) => (
                <div key={item.title} className="rounded-md bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-ink">{item.title}</p>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {item.accent}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 p-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Compliance watchlist
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {compliance.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
