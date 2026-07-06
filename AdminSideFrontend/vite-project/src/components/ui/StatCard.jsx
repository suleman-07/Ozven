function StatCard({ label, value, helper, icon: Icon, accent = 'bg-brand-600' }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
        </div>
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg text-white ${accent}`}>
          <Icon size={21} aria-hidden="true" />
        </span>
      </div>
      {helper ? <p className="mt-4 text-sm text-slate-500">{helper}</p> : null}
    </article>
  )
}

export default StatCard
