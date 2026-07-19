import { cn } from '../../utils/cn'

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  Draft: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  Inactive: 'bg-slate-100 text-slate-600 ring-slate-500/10',
}

function Badge({ children, className, tone }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
        tone ? statusStyles[tone] : 'bg-slate-100 text-slate-600 ring-slate-500/10',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
