"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, ShieldCheck } from "lucide-react";
import { OrgUnitModal } from "@/components/OrgUnitModal";
import { OrgUnitStats } from "@/components/OrgUnitStats";
import { OrgUnitTree } from "@/components/OrgUnitTree";
import {
  createOrgUnit,
  getOrgUnitTree,
  listOrgUnits,
  updateOrgUnit
} from "@/lib/backend-api";
import type { OrgUnitFormValues } from "@/lib/validation/org-unit";

export function OrgUnitsWorkspace() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OrgUnitFormValues | undefined>();
  const [lastSaved, setLastSaved] = useState<OrgUnitFormValues | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const unitsQuery = useQuery({
    queryKey: ["org-units"],
    queryFn: async () => {
      const [units, tree] = await Promise.all([listOrgUnits(), getOrgUnitTree()]);
      return { units, tree };
    }
  });

  function openCreate() {
    setEditingUnit(undefined);
    setModalOpen(true);
  }

  function openEditRoot() {
    const root = unitsQuery.data?.units.find((unit) => unit.parent_unit_id === null);
    if (!root) {
      setSaveError("Create a root org unit before editing it.");
      return;
    }
    setEditingUnit({
      id: root.id,
      name: root.name,
      unit_type: root.unit_type,
      parent_unit_id: root.parent_unit_id
    });
    setModalOpen(true);
  }

  async function save(values: OrgUnitFormValues) {
    setSaveError(null);
    try {
      const payload = {
        name: values.name,
        unit_type: values.unit_type,
        parent_unit_id: values.parent_unit_id || null
      };
      if (values.id) {
        await updateOrgUnit(values.id, payload);
      } else {
        await createOrgUnit(payload);
      }
      await queryClient.invalidateQueries({ queryKey: ["org-units"] });
      setLastSaved(values);
      setModalOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save org unit.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Org Structure</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your organization&apos;s reporting structure.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openEditRoot}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <Pencil aria-hidden="true" size={16} />
            Edit root
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus aria-hidden="true" size={16} />
            Add unit
          </button>
        </div>
      </div>

      {unitsQuery.data ? <OrgUnitStats units={unitsQuery.data.units} /> : null}

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        {unitsQuery.isLoading ? (
          <p className="text-sm text-slate-500">Loading org units...</p>
        ) : unitsQuery.isError ? (
          <p role="alert" className="text-sm text-red-700">{unitsQuery.error.message}</p>
        ) : unitsQuery.data?.tree.length ? (
          <div className="space-y-3">
            {unitsQuery.data.tree.map((node) => <OrgUnitTree key={node.id} node={node} />)}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No org units have been created yet.</p>
        )}
      </div>

      {saveError ? <p role="alert" className="text-sm text-red-700">{saveError}</p> : null}
      {lastSaved ? (
        <div className="flex items-center gap-2 rounded-md border border-leaf/20 bg-leaf/10 px-4 py-3 text-sm text-leaf">
          <ShieldCheck aria-hidden="true" size={16} />
          Saved to the organization: {lastSaved.name}.
        </div>
      ) : null}

      <OrgUnitModal
        open={modalOpen}
        initialValues={editingUnit}
        units={unitsQuery.data?.units ?? []}
        onClose={() => setModalOpen(false)}
        onSave={save}
      />
    </div>
  );
}
