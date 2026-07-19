import { Trash2 } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'

function DeleteConfirmationModal({ title, itemName, noun, onClose, onDelete }) {
  return (
    <Modal title={title} onClose={onClose}>
      <div>
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <Trash2 size={22} aria-hidden="true" />
          </span>
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-950">{itemName}</span>? This is a
            dummy action and only updates local state.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={onDelete}
          >
            Delete {noun}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
