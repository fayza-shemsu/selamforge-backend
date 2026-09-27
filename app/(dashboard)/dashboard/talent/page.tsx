import { PhaseTwoModule } from "@/components/PhaseTwoModule";

export default function TalentPage() {
  return (
    <PhaseTwoModule
      title="Talent Acquisition"
      description="Phase 2 will add job postings, candidate pipeline, interviews, and hiring approvals."
      metrics={[
        { label: "Open roles", value: "8" },
        { label: "Candidates", value: "42" },
        { label: "Interviews", value: "11" }
      ]}
      sections={[
        {
          heading: "Hiring pipeline",
          items: [
            { title: "Senior Product Designer", detail: "2 interview rounds scheduled this week.", badge: "Active" },
            { title: "HR Operations Analyst", detail: "Portfolio review received from 3 candidates.", badge: "Review" },
            { title: "Finance Partner", detail: "Offer approved and awaiting legal sign-off.", badge: "Offer" }
          ]
        },
        {
          heading: "Manager actions",
          items: [
            { title: "Approval queue", detail: "5 hiring approvals need manager sign-off before Friday.", badge: "High" },
            { title: "Offer readiness", detail: "2 candidates are ready for final offer issuance.", badge: "Ready" },
            { title: "Interview sync", detail: "Recruiters requested interview calibration for 3 roles.", badge: "Planned" }
          ]
        }
      ]}
    />
  );
}
