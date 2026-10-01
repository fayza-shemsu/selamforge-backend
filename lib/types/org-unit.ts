export type OrgUnit = {
  id: string;
  name: string;
  unit_type: string;
  parent_unit_id: string | null;
};

export type OrgUnitNode = {
  id: string;
  name: string;
  unit_type: string;
  children: OrgUnitNode[];
};
