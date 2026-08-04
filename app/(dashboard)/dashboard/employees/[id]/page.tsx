import { notFound } from "next/navigation";
import { EmployeeForm } from "@/components/EmployeeForm";
import { ReportsChain } from "@/components/ReportsChain";
import {
  getMockEmployee,
  getMockReportsChain,
  getOrgUnitName
} from "@/lib/mock/employees";

type EmployeeDetailPageProps = {
  params: {
    id: string;
  };
};

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const employee = getMockEmployee(params.id);

  if (!employee) {
    notFound();
  }

  const reportsChain = getMockReportsChain(employee.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {employee.first_name} {employee.last_name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{employee.email}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-xs uppercase text-slate-500">Org unit</p>
          <p className="mt-1 font-medium text-ink">
            {getOrgUnitName(employee.org_unit_id)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-xs uppercase text-slate-500">Hire date</p>
          <p className="mt-1 font-medium text-ink">{employee.hire_date}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-xs uppercase text-slate-500">Status</p>
          <p className="mt-1 font-medium capitalize text-ink">{employee.status}</p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Reports To</h2>
        <div className="mt-3">
          <ReportsChain chain={reportsChain} />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Edit employee</h2>
        <div className="mt-4">
          <EmployeeForm
            defaultValues={{
              first_name: employee.first_name,
              last_name: employee.last_name,
              email: employee.email,
              hire_date: employee.hire_date,
              base_salary_etb: employee.base_salary_etb,
              org_unit_id: employee.org_unit_id,
              is_ethiopian_national: employee.is_ethiopian_national
            }}
          />
        </div>
      </section>
    </div>
  );
}
