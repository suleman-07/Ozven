import { ChevronDown } from 'lucide-react'

export default function ProductFilters({
  categories = [],
  categoryId = '',
  subcategoryId = '',
  onChange,
  collapsible = false,
  open = true,
  onToggle,
}) {
  const selectedCategory = categories.find((category) => category.id === categoryId)
  const subcategories = selectedCategory?.subcategories || []

  const update = (patch) => {
    onChange?.({
      categoryId,
      subcategoryId,
      ...patch,
    })
  }

  const body = (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/50">Category</p>
        <ul className="mt-3 space-y-2">
          <li>
            <button
              type="button"
              onClick={() => update({ categoryId: '', subcategoryId: '' })}
              className={[
                'w-full text-left text-sm transition',
                !categoryId ? 'text-gold' : 'text-charcoal/70 hover:text-gold',
              ].join(' ')}
            >
              All categories
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => update({ categoryId: category.id, subcategoryId: '' })}
                className={[
                  'w-full text-left text-sm transition',
                  categoryId === category.id ? 'text-gold' : 'text-charcoal/70 hover:text-gold',
                ].join(' ')}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/50">Subcategory</p>
        {!categoryId ? (
          <p className="mt-3 text-sm text-charcoal/45">Select a category first</p>
        ) : (
          <ul className="mt-3 space-y-2">
            <li>
              <button
                type="button"
                onClick={() => update({ subcategoryId: '' })}
                className={[
                  'w-full text-left text-sm transition',
                  !subcategoryId ? 'text-gold' : 'text-charcoal/70 hover:text-gold',
                ].join(' ')}
              >
                All subcategories
              </button>
            </li>
            {subcategories.map((sub) => (
              <li key={sub.id}>
                <button
                  type="button"
                  onClick={() => update({ subcategoryId: sub.id })}
                  className={[
                    'w-full text-left text-sm transition',
                    subcategoryId === sub.id ? 'text-gold' : 'text-charcoal/70 hover:text-gold',
                  ].join(' ')}
                >
                  {sub.name}
                </button>
              </li>
            ))}
            {!subcategories.length ? (
              <li className="text-sm text-charcoal/45">No subcategories</li>
            ) : null}
          </ul>
        )}
      </div>
    </div>
  )

  if (!collapsible) {
    return (
      <aside className="border border-gold-hairline/25 bg-base p-5">
        <p className="font-display text-xl text-charcoal">Filters</p>
        <div className="mt-6">{body}</div>
      </aside>
    )
  }

  return (
    <div className="border border-gold-hairline/25 bg-base">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-display text-lg text-charcoal">Filters</span>
        <ChevronDown className={`h-4 w-4 text-gold transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="border-t border-gold-hairline/20 px-5 py-5">{body}</div> : null}
    </div>
  )
}
