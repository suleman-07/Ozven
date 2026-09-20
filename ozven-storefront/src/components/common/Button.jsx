import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-gold text-dark hover:bg-gold-light focus-visible:ring-gold',
  secondary:
    'bg-transparent text-gold border border-gold-hairline hover:bg-gold/10 focus-visible:ring-gold',
  dark: 'bg-dark text-base hover:bg-dark-alt focus-visible:ring-charcoal',
  ghost: 'bg-transparent text-charcoal hover:text-gold focus-visible:ring-gold',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm tracking-wide',
  lg: 'px-8 py-3.5 text-base tracking-wide',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded font-medium transition duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
