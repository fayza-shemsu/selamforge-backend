import { PhaseTwoModule } from "@/components/PhaseTwoModule";

export default function LearningPage() {
  return (
    <PhaseTwoModule
      title="Learning & Growth"
      description="Assigned learning, skill development, and manager-led growth planning."
      metrics={[
        { label: "Courses active", value: "24" },
        { label: "In progress", value: "34" },
        { label: "Completed", value: "96" }
      ]}
      sections={[
        {
          heading: "Learning plan",
          items: [
            { title: "Leadership essentials", detail: "14 employees are enrolled across manager tracks.", badge: "Live" },
            { title: "Compliance refresh", detail: "Annual policy training remains due for 6 staff members.", badge: "Due" },
            { title: "Mentoring program", detail: "4 pairs matched for quarterly coaching support.", badge: "New" }
          ]
        },
        {
          heading: "Skill progress",
          items: [
            { title: "Digital literacy", detail: "Team completion rate is 82% this month.", badge: "Strong" },
            { title: "People management", detail: "New manager learning path has 9 active learners.", badge: "Active" },
            { title: "Succession planning", detail: "Development tracks are being reviewed by HRBP teams.", badge: "Review" }
          ]
        }
      ]}
    />
  );
}
