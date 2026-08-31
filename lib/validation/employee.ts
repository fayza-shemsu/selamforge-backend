import { z } from "zod";

export const employeeSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(80, "First name is too long."),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(80, "Last name is too long."),
  email: z.string().email("Enter a valid email address."),
  hire_date: z
    .string()
    .min(1, "Hire date is required.")
    .refine((value) => new Date(value) <= new Date(), {
      message: "Hire date cannot be in the future."
    }),
  base_salary_etb: z.coerce
    .number()
    .positive("Base salary must be a positive number."),
  org_unit_id: z.string().min(1, "Choose an org unit."),
  is_ethiopian_national: z.boolean()
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
