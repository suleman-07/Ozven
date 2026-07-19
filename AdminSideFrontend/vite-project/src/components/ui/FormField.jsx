function FormField({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
    </label>
  )
}

export default FormField
