"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAttendance, listEmployees, listOrgUnits } from "@/lib/backend-api";

export function AttendanceHistoryTable() {
  const [employee, setEmployee] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const attendanceQuery = useQuery({
    queryKey: ["attendance", { fromDate, toDate }],
    queryFn: () => listAttendance({
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      page: 1,
      page_size: 100
    })
  });
  const employeesQuery = useQuery({
    queryKey: ["employees", "attendance-labels"],
    queryFn: () => listEmployees({ page: 1, page_size: 100 })
  });
  const unitsQuery = useQuery({ queryKey: ["org-units"], queryFn: listOrgUnits });
  const employees = new Map((employeesQuery.data?.items ?? []).map((item) => [item.id, item]));
  const units = new Map((unitsQuery.data ?? []).map((item) => [item.id, item.name]));
  const search = employee.trim().toLocaleLowerCase();
  const logs = (attendanceQuery.data?.items ?? []).filter((log) => {
    const record = employees.get(log.employee_id);
    const fullName = record ? `${record.first_name} ${record.last_name}`.toLocaleLowerCase() : "";
    return !search || fullName.includes(search) || record?.email.toLocaleLowerCase().includes(search);
  });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-3 md:grid-cols-3">
          <label>
            <span className="sr-only">Filter by employee name or email</span>
            <input
          value={employee}
          onChange={(event) => setEmployee(event.target.value)}
          className="field"
          placeholder="Filter employee"
            />
          </label>
        <label>
          <span className="sr-only">From date</span>
          <input
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          className="field"
          type="date"
          />
        </label>
        <label>
          <span className="sr-only">To date</span>
          <input
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="field"
          type="date"
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Org unit</th>
              <th className="px-3 py-2">Clock in</th>
              <th className="px-3 py-2">Clock out</th>
              <th className="px-3 py-2">Hours</th>
              <th className="px-3 py-2">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {logs.map((log) => {
              const record = employees.get(log.employee_id);
              const duration = log.clock_out_at
                ? (new Date(log.clock_out_at).getTime() - new Date(log.clock_in_at).getTime()) / 3600000
                : null;
              return (
              <tr key={log.id} className="bg-white">
                <td className="px-3 py-2">{record ? `${record.first_name} ${record.last_name}` : "Unknown employee"}</td>
                <td className="px-3 py-2">
                  {record?.org_unit_id ? units.get(record.org_unit_id) ?? "Unknown unit" : "Unassigned"}
                </td>
                <td className="px-3 py-2">{log.clock_in_at.replace("T", " ")}</td>
                <td className="px-3 py-2">
                  {log.clock_out_at?.replace("T", " ") ?? "Open"}
                </td>
                <td className="px-3 py-2">{duration === null ? "-" : duration.toFixed(2)}</td>
                <td className="px-3 py-2">
                  {log.geofence_lat !== null && log.geofence_lng !== null ? "Captured" : "Not captured"}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {attendanceQuery.isLoading ? <p className="mt-3 text-sm text-slate-500">Loading attendance...</p> : null}
      {attendanceQuery.isError ? <p role="alert" className="mt-3 text-sm text-red-700">{attendanceQuery.error.message}</p> : null}
      {attendanceQuery.data && logs.length === 0 ? <p className="mt-3 text-sm text-slate-500">No attendance records match these filters.</p> : null}
    </section>
  );
}
