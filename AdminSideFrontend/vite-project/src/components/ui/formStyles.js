import { cn } from '../../utils/cn'

export const inputClassName =
  'h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100'

export function getInputClassName(error) {
  return cn(
    'h-11 w-full rounded-lg border px-3 text-sm outline-none transition focus:ring-4',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100',
  )
}
