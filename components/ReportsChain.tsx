import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Employee } from "@/lib/types/employee";

export function ReportsChain({ chain }: { chain: Employee[] }) {
  if (chain.length === 0) {
    return <p className="text-sm text-slate-500">No reporting chain assigned.</p>;
  }

  return (
    <nav aria-label="Reports to chain" className="flex flex-wrap items-center gap-2">
      {chain.map((employee, index) => (
        <span key={employee.id} className="flex items-center gap-2">
          <Link
            href={`/dashboard/employees/${employee.id}`}
            className="rounded-md bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700"
          >
            {employee.first_name} {employee.last_name}
          </Link>
          {index < chain.length - 1 ? (
            <ChevronRight aria-hidden="true" size={16} className="text-slate-400" />
          ) : null}
        </span>
      ))}
    </nav>
  );
}
