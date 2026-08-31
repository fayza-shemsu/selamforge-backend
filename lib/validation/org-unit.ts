import { z } from "zod";

export const orgUnitSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name is too long."),
  unit_type: z
    .string()
    .trim()
    .min(1, "Unit type is required.")
    .max(60, "Unit type is too long."),
  parent_unit_id: z.string().nullable()
});

export type OrgUnitFormValues = z.infer<typeof orgUnitSchema>;
