import { PhaseTwoModule } from "@/components/PhaseTwoModule";

export default function CompensationPage() {
  return (
    <PhaseTwoModule
      title="Compensation & Incentives"
      description="Salary bands, incentives, pension inputs, and compensation changes across the company."
      metrics={[
        { label: "Current payroll", value: "ETB 4.8M" },
        { label: "Incentive pool", value: "ETB 620K" },
        { label: "Pending approvals", value: "12" }
      ]}
      sections={[
        {
          heading: "Compensation health",
          items: [
            {
              title: "Band review",
              detail: "Three salary bands are being reviewed to align with market movement and internal equity.",
              badge: "Active"
            },
            {
              title: "Bonus cycle",
              detail: "Quarterly performance bonus recommendations are ready for leadership review.",
              badge: "Due"
            },
            {
              title: "Pension inputs",
              detail: "Monthly pension and provident contributions are being reconciled for all employees.",
              badge: "Review"
            }
          ]
        },
        {
          heading: "Manager actions",
          items: [
            {
              title: "Adjustment queue",
              detail: "5 compensation changes need manager sign-off before the next payroll cut-off.",
              badge: "High"
            },
            {
              title: "Recognition payouts",
              detail: "Team recognition and milestone awards are being prepared for distribution.",
              badge: "Planned"
            },
            {
              title: "Policy check",
              detail: "Compensation policy compliance for new hires is currently under HR review.",
              badge: "Ready"
            }
          ]
        }
      ]}
    />
  );
}
