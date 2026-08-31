"use client";

import { useMemo, useState } from "react";
import { mockAttendanceLogs } from "@/lib/mock/attendance";

export function AttendanceHistoryTable() {
  const [employee, setEmployee] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const logs = useMemo(
    () =>
      mockAttendanceLogs.filter((log) => {
        const day = log.clock_in_at.slice(0, 10);
        const matchesEmployee =
          !employee || log.employee_name.toLowerCase().includes(employee.toLowerCase());
        const afterStart = !fromDate || day >= fromDate;
        const beforeEnd = !toDate || day <= toDate;

        return matchesEmployee && afterStart && beforeEnd;
      }),
    [employee, fromDate, toDate]
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={employee}
          onChange={(event) => setEmployee(event.target.value)}
          className="field"
          placeholder="Filter employee"
        />
        <input
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          className="field"
          type="date"
        />
        <input
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="field"
          type="date"
        />
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
              <th className="px-3 py-2">Geofence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {logs.map((log) => (
              <tr key={log.id} className="bg-white">
                <td className="px-3 py-2">{log.employee_name}</td>
                <td className="px-3 py-2">{log.org_unit_name}</td>
                <td className="px-3 py-2">{log.clock_in_at.replace("T", " ")}</td>
                <td className="px-3 py-2">
                  {log.clock_out_at?.replace("T", " ") ?? "Open"}
                </td>
                <td className="px-3 py-2">{log.hours_worked ?? "-"}</td>
                <td className="px-3 py-2 capitalize">{log.geofence_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
