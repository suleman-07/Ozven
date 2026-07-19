import { cn } from '../../utils/cn'

const variants = {
  default: 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950',
  danger: 'border-red-100 text-red-600 hover:bg-red-50',
}

function IconButton({ label, icon: Icon, variant = 'default', className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn('rounded-lg border p-2 transition', variants[variant], className)}
      {...props}
    >
      <Icon size={17} aria-hidden="true" />
    </button>
  )
}

export default IconButton
