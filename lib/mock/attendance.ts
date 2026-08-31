export type AttendanceLog = {
  id: string;
  employee_id: string;
  employee_name: string;
  org_unit_name: string;
  clock_in_at: string;
  clock_out_at: string | null;
  hours_worked: number | null;
  geofence_status: "inside" | "outside" | "not_checked";
};

export const mockAttendanceLogs: AttendanceLog[] = [
  {
    id: "att-001",
    employee_id: "emp-001",
    employee_name: "Selam Feyisa",
    org_unit_name: "People & Culture",
    clock_in_at: "2026-08-31T08:12:00",
    clock_out_at: null,
    hours_worked: null,
    geofence_status: "inside"
  },
  {
    id: "att-002",
    employee_id: "emp-002",
    employee_name: "Mekdes Alemu",
    org_unit_name: "Talent Acquisition",
    clock_in_at: "2026-08-30T08:04:00",
    clock_out_at: "2026-08-30T17:11:00",
    hours_worked: 9.1,
    geofence_status: "inside"
  },
  {
    id: "att-003",
    employee_id: "emp-003",
    employee_name: "Dawit Bekele",
    org_unit_name: "Learning & Growth",
    clock_in_at: "2026-08-30T08:30:00",
    clock_out_at: "2026-08-30T16:45:00",
    hours_worked: 8.25,
    geofence_status: "outside"
  }
];
