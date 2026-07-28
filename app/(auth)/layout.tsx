export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#f5f7ff,transparent_30%),linear-gradient(135deg,#f7f8fb_0%,#eef6f2_100%)] px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-clay">
            SelamForge
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">
            Ethiopian HR operations
          </h1>
        </div>
        {children}
      </section>
    </main>
  );
}
