export default function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-hairline/30 border-t-gold" />
      <p className="text-sm tracking-wide text-charcoal/70">{label}</p>
    </div>
  )
}
