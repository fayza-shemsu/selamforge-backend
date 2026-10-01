"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut } from "lucide-react";
import { clockIn, clockOut, listAttendance, listEmployees } from "@/lib/backend-api";

export function ClockInOutPanel() {
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const employeesQuery = useQuery({
    queryKey: ["employees", "attendance-select"],
    queryFn: () => listEmployees({ page: 1, page_size: 100 })
  });
  const attendanceQuery = useQuery({
    queryKey: ["attendance", employeeId],
    queryFn: () => listAttendance({ employee_id: employeeId, page: 1, page_size: 100 }),
    enabled: Boolean(employeeId)
  });
  const openLog = attendanceQuery.data?.items.find((item) => item.clock_out_at === null);

  async function requestClockOut() {
    if (!employeeId) return;
    setMessage(null);
    try {
      await clockOut(employeeId);
      setMessage("Clock-out recorded.");
      await queryClient.invalidateQueries({ queryKey: ["attendance"] });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Attendance could not be recorded.");
    }
  }

  function requestClockIn() {
    setMessage(null);
    if (!navigator.geolocation) {
      setMessage("Location is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!employeeId) return;
        try {
          await clockIn({
            employee_id: employeeId,
            geofence_lat: position.coords.latitude,
            geofence_lng: position.coords.longitude
          });
          setMessage("Clock-in recorded with your location.");
          await queryClient.invalidateQueries({ queryKey: ["attendance"] });
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Attendance could not be recorded.");
        }
      },
      () => {
        setMessage("Location permission is required for clock-in.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Today</h2>
          <label className="mt-2 block max-w-sm">
            <span className="sr-only">Employee</span>
            <select
              className="field"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
            >
              <option value="">Choose employee</option>
              {(employeesQuery.data?.items ?? []).map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-1 text-sm text-slate-600" aria-live="polite">
            {openLog
              ? `Clocked in since ${new Date(openLog.clock_in_at).toLocaleTimeString()}`
              : "Not clocked in"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openLog ? requestClockOut : requestClockIn}
            disabled={!employeeId || employeesQuery.isLoading || attendanceQuery.isFetching}
            className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {openLog ? (
              <LogOut aria-hidden="true" size={16} />
            ) : (
              <LogIn aria-hidden="true" size={16} />
            )}
            {openLog ? "Clock out" : "Clock in"}
          </button>
        </div>
      </div>
      {message ? (
          <p role="status" className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {message}
        </p>
      ) : null}
    </section>
  );
}
