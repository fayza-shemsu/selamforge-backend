"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { flatOrgUnits } from "@/lib/mock/org-units";
import {
  employeeSchema,
  type EmployeeFormValues
} from "@/lib/validation/employee";

type EmployeeFormProps = {
  defaultValues?: Partial<EmployeeFormValues>;
  onSubmit?: (values: EmployeeFormValues) => Promise<void> | void;
};

export function EmployeeForm({ defaultValues, onSubmit }: EmployeeFormProps) {
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      hire_date: "",
      base_salary_etb: 0,
      org_unit_id: "",
      is_ethiopian_national: true,
      ...defaultValues
    }
  });

  async function submit(values: EmployeeFormValues) {
    setBackendErrors({});

    try {
      await onSubmit?.(values);
    } catch {
      setBackendErrors({
        email: "This email may already exist. Backend field errors will appear here."
      });
    }
  }

  function fieldError(field: keyof EmployeeFormValues) {
    return errors[field]?.message ?? backendErrors[field];
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="label" htmlFor="first_name">
            First name
          </label>
          <input id="first_name" className="field" {...register("first_name")} />
          {fieldError("first_name") ? (
            <p className="error-text">{fieldError("first_name")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="label" htmlFor="last_name">
            Last name
          </label>
          <input id="last_name" className="field" {...register("last_name")} />
          {fieldError("last_name") ? (
            <p className="error-text">{fieldError("last_name")}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" type="email" className="field" {...register("email")} />
        {fieldError("email") ? <p className="error-text">{fieldError("email")}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="label" htmlFor="hire_date">
            Hire date
          </label>
          <input
            id="hire_date"
            type="date"
            className="field"
            {...register("hire_date")}
          />
          {fieldError("hire_date") ? (
            <p className="error-text">{fieldError("hire_date")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="label" htmlFor="base_salary_etb">
            Base salary ETB
          </label>
          <input
            id="base_salary_etb"
            type="number"
            min="0"
            step="100"
            className="field"
            {...register("base_salary_etb")}
          />
          {fieldError("base_salary_etb") ? (
            <p className="error-text">{fieldError("base_salary_etb")}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="label" htmlFor="org_unit_id">
          Org unit
        </label>
        <select id="org_unit_id" className="field" {...register("org_unit_id")}>
          <option value="">Choose org unit</option>
          {flatOrgUnits.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>
        {fieldError("org_unit_id") ? (
          <p className="error-text">{fieldError("org_unit_id")}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300"
          {...register("is_ethiopian_national")}
        />
        Ethiopian national
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <Save aria-hidden="true" size={16} />
        {isSubmitting ? "Saving..." : "Save employee"}
      </button>
    </form>
  );
}
