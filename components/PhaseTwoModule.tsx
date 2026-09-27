type Metric = {
  label: string;
  value: string;
};

type SectionItem = {
  title: string;
  detail: string;
  badge?: string;
};

export function PhaseTwoModule({
  title,
  description,
  metrics,
  sections
}: {
  title: string;
  description: string;
  metrics: Metric[];
  sections: Array<{
    heading: string;
    items: SectionItem[];
  }>;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-base text-slate-600">{description}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <section key={section.heading} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
            <div className="mt-4 space-y-3">
              {section.items.map((item) => (
                <div key={item.title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    {item.badge ? (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
