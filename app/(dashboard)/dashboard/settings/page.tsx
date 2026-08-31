export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Organization Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Admin-only profile and branding controls.
        </p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <form className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="label" htmlFor="org-name">
                Organization name
              </label>
              <input id="org-name" className="field" defaultValue="SelamForge" />
            </div>
            <div className="space-y-2">
              <label className="label" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                className="field"
                defaultValue="Addis Ababa, Ethiopia"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="logo">
              Logo
            </label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              className="field file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700"
            />
          </div>
          <button
            type="button"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Save settings
          </button>
        </form>
      </section>
    </div>
  );
}
