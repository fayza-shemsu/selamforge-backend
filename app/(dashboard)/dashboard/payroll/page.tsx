import { PhaseTwoModule } from "@/components/PhaseTwoModule";

export default function PayrollPage() {
  return (
    <PhaseTwoModule
      title="Payroll"
      description="Payroll preview, approvals, and compensation checks for current cycles."
      metrics={[
        { label: "Due this cycle", value: "163" },
        { label: "Approved", value: "98" },
        { label: "Pending", value: "21" }
      ]}
      sections={[
        {
          heading: "Payroll status",
          items: [
            { title: "Monthly run", detail: "Run is scheduled for next Friday with standard approval flow.", badge: "Planned" },
            { title: "Balance checks", detail: "Leave and overtime balances are being reconciled for 12 employees.", badge: "Review" },
            { title: "Off-cycle adjustments", detail: "3 bonus and reimbursement changes require manager approval.", badge: "Action" }
          ]
        },
        {
          heading: "Approvals",
          items: [
            { title: "Department sign-off", detail: "Finance and HR sign-off is complete for 74% of the batch.", badge: "In progress" },
            { title: "Exception queue", detail: "6 payroll exceptions need manual review before final export.", badge: "High" },
            { title: "Payslip prep", detail: "Payslips are being prepared for distribution after final approval.", badge: "Ready" }
          ]
        }
      ]}
    />
  );
}
