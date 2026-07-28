import type { Employee, PaginatedResponse } from "@/lib/types/employee";
import { flatOrgUnits } from "@/lib/mock/org-units";

export const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    org_unit_id: "people",
    first_name: "Selam",
    last_name: "Feyisa",
    email: "selam.feyisa@selamforge.test",
    hire_date: "2024-09-02",
    base_salary_etb: 42000,
    is_ethiopian_national: true,
    status: "active"
  },
  {
    id: "emp-002",
    org_unit_id: "recruiting",
    first_name: "Mekdes",
    last_name: "Alemu",
    email: "mekdes.alemu@selamforge.test",
    hire_date: "2023-04-17",
    base_salary_etb: 38000,
    is_ethiopian_national: true,
    status: "active"
  },
  {
    id: "emp-003",
    org_unit_id: "learning",
    first_name: "Dawit",
    last_name: "Bekele",
    email: "dawit.bekele@selamforge.test",
    hire_date: "2022-11-14",
    base_salary_etb: 46500,
    is_ethiopian_national: true,
    status: "active"
  },
  {
    id: "emp-004",
    org_unit_id: "finance",
    first_name: "Hana",
    last_name: "Tesfaye",
    email: "hana.tesfaye@selamforge.test",
    hire_date: "2021-02-08",
    base_salary_etb: 52000,
    is_ethiopian_national: true,
    status: "active"
  },
  {
    id: "emp-005",
    org_unit_id: "attendance",
    first_name: "Yonatan",
    last_name: "Kassa",
    email: "yonatan.kassa@selamforge.test",
    hire_date: "2020-07-21",
    base_salary_etb: 49000,
    is_ethiopian_national: true,
    status: "inactive"
  }
];

export function getOrgUnitName(orgUnitId: string) {
  return flatOrgUnits.find((unit) => unit.id === orgUnitId)?.name ?? "Unknown";
}

export async function fetchMockEmployees(params: {
  search?: string;
  org_unit_id?: string;
  page: number;
  page_size: number;
}): Promise<PaginatedResponse<Employee>> {
  const search = params.search?.trim().toLowerCase() ?? "";
  const filtered = mockEmployees.filter((employee) => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const matchesSearch =
      !search ||
      fullName.includes(search) ||
      employee.email.toLowerCase().includes(search);
    const matchesOrgUnit =
      !params.org_unit_id || employee.org_unit_id === params.org_unit_id;

    return matchesSearch && matchesOrgUnit;
  });

  const start = (params.page - 1) * params.page_size;

  return {
    items: filtered.slice(start, start + params.page_size),
    total: filtered.length,
    page: params.page,
    page_size: params.page_size
  };
}
