export type OrgUnitNode = {
  id: string;
  name: string;
  unit_type: string;
  children: OrgUnitNode[];
};
