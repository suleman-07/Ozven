import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

function Pagination({ currentPage, totalPages, isLoading, onPrevious, onNext }) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="h-9 px-3"
          disabled={currentPage === 1 || isLoading}
          onClick={onPrevious}
        >
          <ChevronLeft size={17} aria-hidden="true" />
          Previous
        </Button>
        <Button
          variant="secondary"
          className="h-9 px-3"
          disabled={currentPage === totalPages || isLoading}
          onClick={onNext}
        >
          Next
          <ChevronRight size={17} aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
