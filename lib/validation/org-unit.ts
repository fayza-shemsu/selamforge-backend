import { z } from "zod";

export const orgUnitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  unit_type: z.string().min(1, "Unit type is required."),
  parent_unit_id: z.string().nullable()
});

export type OrgUnitFormValues = z.infer<typeof orgUnitSchema>;
