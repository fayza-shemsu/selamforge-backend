import { PhaseTwoModule } from "@/components/PhaseTwoModule";

export default function CfrPage() {
  return (
    <PhaseTwoModule
      title="CFR"
      description="Conversation, feedback, and recognition workflows for team performance management."
      metrics={[
        { label: "Feedback sent", value: "31" },
        { label: "Recognition", value: "17" },
        { label: "Pending review", value: "4" }
      ]}
      sections={[
        {
          heading: "Recognition highlights",
          items: [
            { title: "Team milestone", detail: "Operations team recognized for a successful quarterly roll-out.", badge: "Recognized" },
            { title: "Manager appreciation", detail: "10 peer shout-outs were added this week.", badge: "New" },
            { title: "Growth review", detail: "3 coaching feedback loops were scheduled for this month.", badge: "Active" }
          ]
        },
        {
          heading: "Feedback actions",
          items: [
            { title: "1:1 follow-ups", detail: "5 managers are following up on action items from check-ins.", badge: "Due" },
            { title: "Pulse survey", detail: "Engagement pulse is open and collecting responses.", badge: "Live" },
            { title: "Performance note", detail: "Two career development notes need approval from HR.", badge: "Pending" }
          ]
        }
      ]}
    />
  );
}
