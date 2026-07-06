import { ClipboardCheck } from 'lucide-react'
import PageTitle from './PageTitle'

function ModulePlaceholder({ title }) {
  return (
    <section>
      <PageTitle
        title={title}
        description="This module route is prepared for the future admin workflow. CRUD screens and API integration will be added later."
      />

      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <ClipboardCheck size={24} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-slate-950">Module scaffold ready</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Navigation, layout, breadcrumbs, and protected routing are already wired for this section.
        </p>
      </div>
    </section>
  )
}

export default ModulePlaceholder
