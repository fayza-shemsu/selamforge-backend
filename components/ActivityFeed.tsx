const activities = [
  { title: "New employee added", detail: "Selam Feyisa created a new employee record" },
  { title: "Org structure updated", detail: "The people department hierarchy was reviewed" },
  { title: "Employee report opened", detail: "Weekend staffing summary was checked" }
];

export function ActivityFeed() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">Recent activity</h2>
      <div className="mt-4 space-y-3">
        {activities.map((activity) => (
          <div key={activity.title} className="rounded-md border border-slate-200 p-3">
            <p className="font-medium text-ink">{activity.title}</p>
            <p className="mt-1 text-sm text-slate-600">{activity.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
