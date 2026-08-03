export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`rounded-sm border border-gold-hairline/30 bg-base px-6 py-8 text-center ${className}`}
      role="alert"
    >
      <p className="font-display text-xl text-charcoal">{title}</p>
      <p className="mt-2 text-sm text-charcoal/70">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 text-sm font-medium text-gold transition hover:text-gold-light"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
