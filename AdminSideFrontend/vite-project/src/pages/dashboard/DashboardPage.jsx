import { Activity, Clock, PackageOpen } from 'lucide-react'
import PageTitle from '../../components/common/PageTitle'
import StatCard from '../../components/ui/StatCard'
import { quickActions } from '../../constants/navigation'

const recentActivity = [
  'Quote request received for rigid box packaging',
  'Product artwork review marked as pending',
  'Material catalog prepared for API integration',
]

function DashboardPage() {
  return (
    <section>
      <PageTitle
        title="Dashboard"
        description="A clean administrative overview scaffold using static data. API integration can be connected later without changing the route and layout architecture."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            helper="Static preview metric"
            icon={item.icon}
            accent={item.accent}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Activity size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-950">Operations Snapshot</h2>
              <p className="text-sm text-slate-500">Static dashboard setup preview</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {['Catalog', 'Quotes', 'Production'].map((label, index) => (
              <div key={label} className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-bold text-slate-950">{82 - index * 11}%</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Clock size={20} aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold text-slate-950">Recent Activity</h2>
          </div>

          <ul className="mt-5 space-y-4">
            {recentActivity.map((activity) => (
              <li key={activity} className="flex gap-3 text-sm text-slate-600">
                <PackageOpen size={18} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default DashboardPage
