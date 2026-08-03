export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className = '',
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'
  const titleColor = light ? 'text-base' : 'text-charcoal'
  const descColor = light ? 'text-base/70' : 'text-charcoal/70'

  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
      ) : null}
      <h2 className={`font-display text-3xl leading-tight sm:text-4xl ${titleColor}`}>{title}</h2>
      {description ? <p className={`mt-4 text-base leading-relaxed ${descColor}`}>{description}</p> : null}
    </div>
  )
}
