"use client";

import { useState } from "react";
import { Plus, Pencil, ShieldCheck } from "lucide-react";
import { OrgUnitModal } from "@/components/OrgUnitModal";
import { OrgUnitStats } from "@/components/OrgUnitStats";
import { OrgUnitTree } from "@/components/OrgUnitTree";
import { flatOrgUnits, mockOrgUnitTree } from "@/lib/mock/org-units";
import type { OrgUnitFormValues } from "@/lib/validation/org-unit";

export function OrgUnitsWorkspace() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OrgUnitFormValues | undefined>();
  const [lastSaved, setLastSaved] = useState<OrgUnitFormValues | null>(null);

  function openCreate() {
    setEditingUnit(undefined);
    setModalOpen(true);
  }

  function openEditRoot() {
    setEditingUnit({
      id: "root-operations",
      name: "SelamForge Operations",
      unit_type: "company",
      parent_unit_id: null
    });
    setModalOpen(true);
  }

  function save(values: OrgUnitFormValues) {
    setLastSaved(values);
    setModalOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Org Structure</h1>
          <p className="mt-1 text-sm text-slate-600">
            Mock tree using the agreed Day 5 response shape.
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

      <OrgUnitStats />

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <OrgUnitTree node={mockOrgUnitTree} />
      </div>

      {lastSaved ? (
        <div className="flex items-center gap-2 rounded-md border border-leaf/20 bg-leaf/10 px-4 py-3 text-sm text-leaf">
          <ShieldCheck aria-hidden="true" size={16} />
          Saved locally: {lastSaved.name}. This will call Fayza&apos;s org-unit
          endpoint once it is available.
        </div>
      ) : null}

      <OrgUnitModal
        open={modalOpen}
        initialValues={editingUnit}
        onClose={() => setModalOpen(false)}
        onSave={save}
      />
    </div>
  );
}
