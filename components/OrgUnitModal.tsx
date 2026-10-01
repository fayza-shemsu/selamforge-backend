"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import type { OrgUnit } from "@/lib/types/org-unit";
import {
  orgUnitSchema,
  type OrgUnitFormValues
} from "@/lib/validation/org-unit";

type OrgUnitModalProps = {
  open: boolean;
  initialValues?: OrgUnitFormValues;
  units: OrgUnit[];
  onClose: () => void;
  onSave: (values: OrgUnitFormValues) => void;
};

export function OrgUnitModal({
  open,
  initialValues,
  units,
  onClose,
  onSave
}: OrgUnitModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<OrgUnitFormValues>({
    resolver: zodResolver(orgUnitSchema),
    values: initialValues ?? {
      name: "",
      unit_type: "",
      parent_unit_id: null
    }
  });

  const parentOptions = useMemo(
    () => units.filter((unit) => unit.id !== initialValues?.id),
    [initialValues?.id, units]
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="org-unit-modal-title"
    >
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="org-unit-modal-title" className="text-lg font-semibold text-ink">
              {initialValues?.id ? "Edit org unit" : "Create org unit"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSave)} noValidate>
          <div className="space-y-2">
            <label className="label" htmlFor="org-unit-name">
              Name
            </label>
            <input
              id="org-unit-name"
              className="field"
              {...register("name")}
            />
            {errors.name ? <p className="error-text">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="label" htmlFor="unit_type">
              Unit type
            </label>
            <input
              id="unit_type"
              className="field"
              placeholder="department, team, branch"
              {...register("unit_type")}
            />
            {errors.unit_type ? (
              <p className="error-text">{errors.unit_type.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="label" htmlFor="parent_unit_id">
              Parent unit
            </label>
            <select
              id="parent_unit_id"
              className="field"
              {...register("parent_unit_id", {
                setValueAs: (value) => value || null
              })}
            >
              <option value="">No parent</option>
              {parentOptions.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            {errors.parent_unit_id ? (
              <p className="error-text">{errors.parent_unit_id.message}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
