import { EmployeeCsvImport } from "@/components/EmployeeCsvImport";

export default function EmployeeImportPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Employee CSV Import</h1>
        <p className="mt-1 text-sm text-slate-600">
          Preview, validate, then submit employee rows.
        </p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <EmployeeCsvImport />
      </section>
    </div>
  );
}
