import { EmployeeForm } from "@/components/EmployeeForm";

export default function NewEmployeePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Add employee</h1>
        <p className="mt-1 text-sm text-slate-600">
          Form fields match Fayza&apos;s Day 6 Employee model exactly.
        </p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <EmployeeForm />
      </section>
    </div>
  );
}
