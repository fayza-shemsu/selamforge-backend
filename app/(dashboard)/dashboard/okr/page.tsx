import { PhaseTwoModule } from "@/components/PhaseTwoModule";

export default function OkrPage() {
  return (
    <PhaseTwoModule
      title="OKR"
      description="Objectives, key results, ownership, and review cycles across the business."
      metrics={[
        { label: "Active OKRs", value: "18" },
        { label: "On track", value: "12" },
        { label: "Needs review", value: "6" }
      ]}
      sections={[
        {
          heading: "Quarterly goals",
          items: [
            { title: "Employee experience", detail: "Reduce onboarding drop-off by 20% before quarter close.", badge: "On track" },
            { title: "Org efficiency", detail: "Improve manager review cycle throughput by 15%.", badge: "Watch" },
            { title: "Data quality", detail: "Complete HR metrics cleanup across all departments.", badge: "At risk" }
          ]
        },
        {
          heading: "Review cadence",
          items: [
            { title: "Weekly check-ins", detail: "7 teams have submitted updates for this week.", badge: "Live" },
            { title: "Monthly approval", detail: "3 leadership teams are awaiting executive review.", badge: "Pending" },
            { title: "Quarter close", detail: "Final review sessions are scheduled for next Tuesday.", badge: "Planned" }
          ]
        }
      ]}
    />
  );
}
