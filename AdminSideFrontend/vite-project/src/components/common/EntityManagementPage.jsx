import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Edit3, Plus, Trash2 } from 'lucide-react'
import PageTitle from './PageTitle'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal'
import {
  DataTable,
  EmptyTableState,
  TableBody,
  TableCard,
  TableCell,
  TableContainer,
  TableHead,
  TableSkeleton,
  TableToolbar,
} from '../ui/DataTable'
import FormField from '../ui/FormField'
import { inputClassName } from '../ui/formStyles'
import IconButton from '../ui/IconButton'
import Modal from '../ui/Modal'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import { createResource, deleteResource, getErrorMessage, listResource, PAGE_SIZE, updateResource } from '../../services/adminApi'
import { formatDate, slugify } from '../../utils/formatters'

const pageSize = PAGE_SIZE
const statusOptions = ['Active', 'Draft', 'Inactive']

function normalizeItem(item) {
  return {
    ...item,
    id: item.id,
    name: item.name || 'Untitled',
    slug: item.slug || slugify(item.name || ''),
    products: item.products ?? 0,
    status: item.status || 'Active',
    updatedAt: formatDate(item.updatedAt || item.createdAt),
  }
}

function EntityManagementPage({
  addEnabled = true,
  apiEndpoint,
  description,
  emptyDescription,
  emptyTitle,
  entityNoun,
  formNameLabel,
  icon: Icon,
  idPrefix,
  initialItems,
  responseKey,
  searchPlaceholder,
  title,
}) {
  const useApi = Boolean(apiEndpoint)
  const [items, setItems] = useState((initialItems || []).map(normalizeItem))
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(useApi)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [error, setError] = useState(null)
  const [formError, setFormError] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, total: 0, totalPages: 1 })

  useEffect(() => {
    if (!useApi) {
      const timer = setTimeout(() => setIsLoading(false), 600)
      return () => clearTimeout(timer)
    }

    return undefined
  }, [useApi])

  const loadItems = useCallback(async (page = currentPage, query = searchTerm) => {
    if (!useApi || !apiEndpoint) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await listResource(apiEndpoint, {
        page,
        limit: pageSize,
        search: query,
        responseKey,
      })
      const normalizedItems = result.items.map(normalizeItem)

      setItems(normalizedItems)
      setPagination(result.pagination)
    } catch (err) {
      const message = getErrorMessage(err, `Unable to load ${title.toLowerCase()} right now.`)

      setItems([])
      setPagination({ page, limit: pageSize, total: 0, totalPages: 1 })
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [apiEndpoint, currentPage, responseKey, searchTerm, title, useApi])

  useEffect(() => {
    if (!useApi) {
      return
    }

    const timer = setTimeout(() => {
      void loadItems(currentPage, searchTerm)
    }, 0)

    return () => clearTimeout(timer)
  }, [currentPage, loadItems, searchTerm, useApi])

  const totalPages = useApi ? pagination.totalPages : Math.max(1, Math.ceil(items.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedItems = useApi ? items : items.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize)

  const handleSubmit = async (event, item) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const slug = String(formData.get('slug') || '').trim()

    if (!name || !slug) {
      setFormError('Name and slug are required.')
      return
    }

    setFormError('')

    if (!useApi || !apiEndpoint) {
      const nextItem = {
        ...item,
        name,
        slug,
        status: String(formData.get('status') || 'Active'),
        products: Number(formData.get('products') || 0),
        updatedAt: 'Jul 07, 2026',
      }

      if (item) {
        setItems((current) => current.map((currentItem) => (currentItem.id === nextItem.id ? nextItem : currentItem)))
        setEditingItem(null)
        toast.success(`${entityNoun} updated successfully.`)
        return
      }

      setItems((current) => [
        {
          ...nextItem,
          id: Math.max(...current.map((currentItem) => currentItem.id), 0) + 1,
        },
        ...current,
      ])
      setCurrentPage(1)
      setIsAddModalOpen(false)
      toast.success(`${entityNoun} added successfully.`)
      return
    }

    setIsSubmitting(true)

    try {
      if (item) {
        await updateResource(apiEndpoint, item.id, { name })
        toast.success(`${entityNoun} updated successfully.`)
      } else {
        await createResource(apiEndpoint, { name })
        toast.success(`${entityNoun} added successfully.`)
      }

      setIsAddModalOpen(false)
      setEditingItem(null)
      setCurrentPage(1)
      await loadItems(1, searchTerm)
    } catch (err) {
      const message = getErrorMessage(err, `Unable to save ${entityNoun.toLowerCase()} right now.`)
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem || !useApi || !apiEndpoint) {
      setItems((current) => current.filter((item) => item.id !== deletingItem?.id))
      setDeletingItem(null)
      toast.success(`${entityNoun} deleted successfully.`)
      return
    }

    try {
      await deleteResource(apiEndpoint, deletingItem.id)
      setDeletingItem(null)
      await loadItems(currentPage, searchTerm)
      toast.success(`${entityNoun} deleted successfully.`)
    } catch (err) {
      const message = getErrorMessage(err, `Unable to delete ${entityNoun.toLowerCase()} right now.`)
      setError(message)
      toast.error(message)
    }
  }

  const handleModalClose = () => {
    setIsAddModalOpen(false)
    setEditingItem(null)
    setFormError('')
  }

  return (
    <section>
      <PageTitle
        title={title}
        description={description}
        action={
          <Button onClick={addEnabled ? () => setIsAddModalOpen(true) : undefined}>
            <Plus size={18} aria-hidden="true" />
            Add {entityNoun}
          </Button>
        }
      />

      <TableCard>
        <TableToolbar>
          <div className="w-full lg:max-w-sm">
            <SearchInput
              value={searchTerm}
              placeholder={searchPlaceholder}
              onChange={(value) => {
                setSearchTerm(value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{paginatedItems.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{useApi ? pagination.total : items.length}</span>{' '}
            {title.toLowerCase()}
          </div>
        </TableToolbar>

        <TableContainer>
          <DataTable>
            <thead className="bg-slate-50">
              <tr>
                <TableHead>{entityNoun}</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead align="right">Actions</TableHead>
              </tr>
            </thead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={6} />
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-900">Unable to load {title.toLowerCase()}</p>
                      <p className="text-sm text-slate-500">{error}</p>
                      <Button variant="secondary" className="mt-2 h-9 px-3" onClick={() => loadItems(currentPage, searchTerm)}>
                        Try again
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : paginatedItems.length ? (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            ID: {idPrefix}-{item.id.toString().padStart(3, '0')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <TableCell>{item.slug}</TableCell>
                    <TableCell>{item.products}</TableCell>
                    <TableCell>
                      <Badge tone={item.status}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.updatedAt}</TableCell>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <IconButton label={`Edit ${item.name}`} icon={Edit3} onClick={() => setEditingItem(item)} />
                        <IconButton
                          label={`Delete ${item.name}`}
                          icon={Trash2}
                          variant="danger"
                          onClick={() => setDeletingItem(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyTableState colSpan={6} icon={Icon} title={emptyTitle} description={emptyDescription} />
              )}
            </TableBody>
          </DataTable>
        </TableContainer>

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        />
      </TableCard>

      {isAddModalOpen ? (
        <EntityFormModal
          title={`Add ${entityNoun}`}
          submitLabel={`Add ${entityNoun}`}
          formNameLabel={formNameLabel}
          formError={formError}
          isSubmitting={isSubmitting}
          onClose={handleModalClose}
          onSubmit={(event) => handleSubmit(event)}
        />
      ) : null}

      {editingItem ? (
        <EntityFormModal
          title={`Edit ${entityNoun}`}
          submitLabel="Save Changes"
          formNameLabel={formNameLabel}
          formError={formError}
          isSubmitting={isSubmitting}
          item={editingItem}
          onClose={handleModalClose}
          onSubmit={(event) => handleSubmit(event, editingItem)}
        />
      ) : null}

      {deletingItem ? (
        <DeleteConfirmationModal
          title={`Delete ${entityNoun}`}
          itemName={deletingItem.name}
          noun={entityNoun}
          onClose={() => setDeletingItem(null)}
          onDelete={handleDelete}
        />
      ) : null}

    </section>
  )
}

function EntityFormModal({ title, submitLabel, formNameLabel, formError, isSubmitting, item, onClose, onSubmit }) {
  return (
    <Modal title={title} onClose={onClose}>
      <form className="space-y-4" onSubmit={onSubmit}>
        {formError ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p> : null}

        <FormField label={formNameLabel}>
          <input name="name" defaultValue={item?.name || ''} className={inputClassName} required />
        </FormField>

        <FormField label="Slug">
          <input name="slug" defaultValue={item?.slug || ''} className={inputClassName} required />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Products">
            <input
              name="products"
              type="number"
              min="0"
              defaultValue={item?.products ?? 0}
              className={inputClassName}
              required
            />
          </FormField>

          <FormField label="Status">
            <select name="status" defaultValue={item?.status || 'Active'} className={inputClassName}>
              {statusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EntityManagementPage
