export function ModuleStub({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-medium text-slate-700">Module placeholder</p>
        <p className="mt-2 text-sm text-slate-600">
          Navigation is present now so the dashboard feels like the full product
          while backend contracts are completed in later phases.
        </p>
      </section>
    </div>
  );
}
