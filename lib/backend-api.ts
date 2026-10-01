import type { Employee, PaginatedResponse } from "@/lib/types/employee";
import type { OrgUnit } from "@/lib/types/org-unit";
import type { OrgUnitNode } from "@/lib/types/org-unit";
import type { ImportResult } from "@/lib/types/import";

type EmployeeWrite = {
  first_name: string;
  last_name: string;
  email: string;
  hire_date: string;
  base_salary_etb: number;
  org_unit_id: string | null;
  manager_id?: string | null;
  is_ethiopian_national: boolean;
};

export type AttendanceLog = {
  id: string;
  employee_id: string;
  clock_in_at: string;
  clock_out_at: string | null;
  geofence_lat: number | null;
  geofence_lng: number | null;
};

export type LeaveBalance = {
  employee_id: string;
  accrued_days: number;
  used_days: number;
  remaining_days: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/backend/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers
    }
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.location.assign("/login?expired=1");
    }
    const detail = payload?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join("; ")
      : typeof detail === "string"
        ? detail
        : "The backend request failed.";
    throw new Error(message);
  }

  return payload as T;
}

function queryString(values: Record<string, string | number | boolean | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}

export function listEmployees(params: {
  search?: string;
  org_unit_id?: string;
  include_inactive?: boolean;
  page?: number;
  page_size?: number;
}) {
  const query = queryString(params);
  return request<PaginatedResponse<Employee>>(`employees${query}`);
}

export async function listAllEmployees(includeInactive = false) {
  const firstPage = await listEmployees({
    include_inactive: includeInactive,
    page: 1,
    page_size: 100
  });
  const employees = [...firstPage.items];
  const pageCount = Math.ceil(firstPage.total / firstPage.page_size);

  for (let page = 2; page <= pageCount; page += 1) {
    const nextPage = await listEmployees({
      include_inactive: includeInactive,
      page,
      page_size: 100
    });
    employees.push(...nextPage.items);
  }

  return employees;
}

export function getEmployee(employeeId: string) {
  return request<Employee>(`employees/${employeeId}`);
}

export function createEmployee(values: EmployeeWrite) {
  return request<Employee>("employees", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function updateEmployee(employeeId: string, values: EmployeeWrite) {
  return request<Employee>(`employees/${employeeId}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function getReportsChain(employeeId: string) {
  return request<{ employee_id: string; chain: Employee[] }>(
    `employees/${employeeId}/reports-chain`
  );
}

export function getLeaveBalance(employeeId: string) {
  return request<LeaveBalance>(`employees/${employeeId}/leave-balance`);
}

export function importEmployees(file: File) {
  const body = new FormData();
  body.set("file", file);
  return request<ImportResult>("employees/import", {
    method: "POST",
    body
  });
}

export function listOrgUnits() {
  return request<OrgUnit[]>("org-units");
}

export function getOrgUnitTree() {
  return request<OrgUnitNode[]>("org-units/tree");
}

export function createOrgUnit(values: {
  name: string;
  unit_type: string;
  parent_unit_id: string | null;
}) {
  return request<OrgUnit>("org-units", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function updateOrgUnit(
  unitId: string,
  values: { name: string; unit_type: string; parent_unit_id: string | null }
) {
  return request<OrgUnit>(`org-units/${unitId}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function listAttendance(params: {
  employee_id?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
}) {
  return request<PaginatedResponse<AttendanceLog>>(
    `attendance${queryString(params)}`
  );
}

export function clockIn(values: {
  employee_id: string;
  geofence_lat: number | null;
  geofence_lng: number | null;
}) {
  return request<AttendanceLog>("attendance/clock-in", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function clockOut(employeeId: string) {
  return request<AttendanceLog>("attendance/clock-out", {
    method: "POST",
    body: JSON.stringify({ employee_id: employeeId })
  });
}