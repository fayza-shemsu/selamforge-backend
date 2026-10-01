export type EmployeeStatus = "active" | "inactive" | "terminated";

export type Employee = {
  id: string;
  org_unit_id: string | null;
  manager_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  hire_date: string;
  base_salary_etb: number;
  is_ethiopian_national: boolean;
  status: EmployeeStatus;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};
