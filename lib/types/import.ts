export type ImportError = {
  row: number;
  field: string;
  message: string;
};

export type ImportResult = {
  created: number;
  errors: ImportError[];
};

export type EmployeeImportRow = {
  first_name?: string;
  last_name?: string;
  email?: string;
  hire_date?: string;
  base_salary_etb?: string;
  org_unit_id?: string;
  is_ethiopian_national?: string;
};
