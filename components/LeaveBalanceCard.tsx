"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeaveBalance } from "@/lib/backend-api";

export function LeaveBalanceCard({ employeeId }: { employeeId: string }) {
  const balanceQuery = useQuery({
    queryKey: ["leave-balance", employeeId],
    queryFn: () => getLeaveBalance(employeeId)
  });

  if (balanceQuery.isLoading) {
    return <p className="text-sm text-slate-500">Loading leave balance...</p>;
  }

  if (balanceQuery.isError) {
    return (
      <p role="status" className="text-sm text-slate-500">
        Leave balance is not available: {balanceQuery.error.message}
      </p>
    );
  }

  const balance = balanceQuery.data;
  if (!balance) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Leave Balance</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-brand-50 p-3">
          <p className="text-xs uppercase text-brand-700">Accrued</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{balance.accrued_days}</p>
        </div>
        <div className="rounded-md bg-slate-100 p-3">
          <p className="text-xs uppercase text-slate-500">Used</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{balance.used_days}</p>
        </div>
        <div className="rounded-md bg-leaf/10 p-3">
          <p className="text-xs uppercase text-leaf">Remaining</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {balance.remaining_days}
          </p>
        </div>
      </div>
    </section>
  );
}
