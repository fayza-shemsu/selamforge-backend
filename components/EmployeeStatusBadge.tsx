type EmployeeStatusBadgeProps = {
  status: string;
};

export function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  const normalized = status.toLowerCase();
  const tone =
    normalized === "active"
      ? "bg-leaf/10 text-leaf"
      : normalized === "inactive"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${tone}`}>
      {status}
    </span>
  );
}
