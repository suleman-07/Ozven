import { Search } from 'lucide-react'

function SearchInput({ value, placeholder, onChange }) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default SearchInput
