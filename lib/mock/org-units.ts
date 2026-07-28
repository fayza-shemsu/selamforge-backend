import type { OrgUnitNode } from "@/lib/types/org-unit";

export const mockOrgUnitTree: OrgUnitNode = {
  id: "root-operations",
  name: "SelamForge Operations",
  unit_type: "company",
  children: [
    {
      id: "people",
      name: "People & Culture",
      unit_type: "department",
      children: [
        {
          id: "recruiting",
          name: "Talent Acquisition",
          unit_type: "team",
          children: []
        },
        {
          id: "learning",
          name: "Learning & Growth",
          unit_type: "team",
          children: []
        }
      ]
    },
    {
      id: "finance",
      name: "Payroll & Compensation",
      unit_type: "department",
      children: [
        {
          id: "attendance",
          name: "Time & Attendance",
          unit_type: "team",
          children: []
        }
      ]
    }
  ]
};

export const flatOrgUnits: Array<Omit<OrgUnitNode, "children">> = [
  { id: "root-operations", name: "SelamForge Operations", unit_type: "company" },
  { id: "people", name: "People & Culture", unit_type: "department" },
  { id: "recruiting", name: "Talent Acquisition", unit_type: "team" },
  { id: "learning", name: "Learning & Growth", unit_type: "team" },
  { id: "finance", name: "Payroll & Compensation", unit_type: "department" },
  { id: "attendance", name: "Time & Attendance", unit_type: "team" }
];
