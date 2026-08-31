"use client";

import { useState } from "react";
import { LocateFixed, LogIn, LogOut } from "lucide-react";

type ClockState = {
  clockedIn: boolean;
  since: string | null;
};

export function ClockInOutPanel() {
  const [clockState, setClockState] = useState<ClockState>({
    clockedIn: true,
    since: "08:12"
  });
  const [message, setMessage] = useState<string | null>(null);

  function requestLocation(nextClockedIn: boolean) {
    setMessage(null);

    if (!navigator.geolocation) {
      setMessage("Location is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setClockState({
          clockedIn: nextClockedIn,
          since: nextClockedIn
            ? new Intl.DateTimeFormat("en", {
                hour: "2-digit",
                minute: "2-digit"
              }).format(new Date())
            : null
        });
        setMessage(
          nextClockedIn
            ? "Clock-in captured with your current location."
            : "Clock-out captured and sent for attendance calculation."
        );
      },
      () => {
        setMessage("Location permission is required for clock-in and clock-out.");
      }
    );
  }

  function simulateGeofenceViolation() {
    setMessage("You are outside the allowed clock-in radius.");
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Today</h2>
          <p className="mt-1 text-sm text-slate-600">
            {clockState.clockedIn
              ? `Clocked in since ${clockState.since}`
              : "Not clocked in"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => requestLocation(!clockState.clockedIn)}
            className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {clockState.clockedIn ? (
              <LogOut aria-hidden="true" size={16} />
            ) : (
              <LogIn aria-hidden="true" size={16} />
            )}
            {clockState.clockedIn ? "Clock out" : "Clock in"}
          </button>
          <button
            type="button"
            onClick={simulateGeofenceViolation}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <LocateFixed aria-hidden="true" size={16} />
            Test radius
          </button>
        </div>
      </div>
      {message ? (
        <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {message}
        </p>
      ) : null}
    </section>
  );
}
