import { cn } from '../../utils/cn'

export function TableCard({ children }) {
  return <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">{children}</div>
}

export function TableToolbar({ children }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
      {children}
    </div>
  )
}

export function TableContainer({ children }) {
  return <div className="overflow-x-auto">{children}</div>
}

export function DataTable({ children }) {
  return <table className="min-w-full divide-y divide-slate-200">{children}</table>
}

export function TableHead({ children, align = 'left' }) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500',
        align === 'right' ? 'text-right' : 'text-left',
      )}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className }) {
  return <td className={cn('whitespace-nowrap px-4 py-4 text-sm text-slate-600', className)}>{children}</td>
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
}

export function TableSkeleton({ columns, rows = 5, imageColumn = false }) {
  return Array.from({ length: rows }).map((_, rowIndex) => (
    <tr key={rowIndex}>
      {Array.from({ length: columns }).map((__, cellIndex) => (
        <td key={cellIndex} className="px-4 py-4">
          <div className={cn('animate-pulse rounded bg-slate-100', imageColumn && cellIndex === 0 ? 'size-14' : 'h-4')} />
        </td>
      ))}
    </tr>
  ))
}

export function EmptyTableState({ colSpan, icon: Icon, title, description }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-14 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Icon size={24} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </td>
    </tr>
  )
}
