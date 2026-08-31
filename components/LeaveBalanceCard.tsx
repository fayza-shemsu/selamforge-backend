export function LeaveBalanceCard() {
  const balance = {
    accrued: 11.5,
    used: 3,
    remaining: 8.5
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Leave Balance</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-brand-50 p-3">
          <p className="text-xs uppercase text-brand-700">Accrued</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{balance.accrued}</p>
        </div>
        <div className="rounded-md bg-slate-100 p-3">
          <p className="text-xs uppercase text-slate-500">Used</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{balance.used}</p>
        </div>
        <div className="rounded-md bg-leaf/10 p-3">
          <p className="text-xs uppercase text-leaf">Remaining</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {balance.remaining}
          </p>
        </div>
      </div>
    </section>
  );
}
