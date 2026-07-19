import { useEffect, useId } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

function Modal({ title, children, onClose, size = 'default' }) {
  const titleId = useId()

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 py-6 sm:items-center">
      <button type="button" aria-label="Close modal" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative max-h-[92vh] w-full overflow-y-auto rounded-lg bg-white shadow-2xl shadow-slate-950/20',
          size === 'wide' ? 'max-w-5xl' : size === 'large' ? 'max-w-2xl' : 'max-w-lg',
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold text-slate-950">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
