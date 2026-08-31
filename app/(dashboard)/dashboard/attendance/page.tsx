import { AttendanceHistoryTable } from "@/components/AttendanceHistoryTable";
import { ClockInOutPanel } from "@/components/ClockInOutPanel";

export default function AttendancePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Time & Attendance</h1>
        <p className="mt-1 text-sm text-slate-600">
          Clock-in, geofence status, and attendance history.
        </p>
      </div>
      <ClockInOutPanel />
      <AttendanceHistoryTable />
    </div>
  );
}
