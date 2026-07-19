import { useCallback, useEffect, useState } from 'react'
import { Edit3, FolderTree, Plus, Tags, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import PageTitle from '../../components/common/PageTitle'
import Button from '../../components/ui/Button'
import DeleteConfirmationModal from '../../components/ui/DeleteConfirmationModal'
import FormField from '../../components/ui/FormField'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import SearchInput from '../../components/ui/SearchInput'
import { inputClassName } from '../../components/ui/formStyles'
import {
  createResource,
  deleteResource,
  getErrorMessage,
  listResource,
  PAGE_SIZE,
  updateResource,
} from '../../services/adminApi'

const emptyPagination = { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 }

function CategoryPage() {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(emptyPagination)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [categoryModal, setCategoryModal] = useState(null)
  const [subcategoryModal, setSubcategoryModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadCategories = useCallback(async (page = currentPage, search = searchTerm) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await listResource('/categories', {
        page,
        limit: PAGE_SIZE,
        search,
      })

      setCategories(result.items)
      setPagination(result.pagination)
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'Unable to load categories.')
      setCategories([])
      setPagination({ ...emptyPagination, page })
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCategories(currentPage, searchTerm)
    }, 200)

    return () => clearTimeout(timer)
  }, [currentPage, loadCategories, searchTerm])

  const saveCategory = async (payload) => {
    setIsSubmitting(true)

    try {
      if (categoryModal?.category) {
        await updateResource('/categories', categoryModal.category.id, payload)
        toast.success('Category updated successfully.')
      } else {
        await createResource('/categories', payload)
        toast.success('Category created successfully.')
      }

      setCategoryModal(null)
      setCurrentPage(1)
      await loadCategories(1, searchTerm)
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, 'Unable to save category.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveSubcategory = async (name) => {
    const { category, subcategory } = subcategoryModal
    setIsSubmitting(true)

    try {
      const endpoint = `/categories/${category.id}/subcategories`

      if (subcategory) {
        await updateResource(endpoint, subcategory.id, { name })
        toast.success('Subcategory updated successfully.')
      } else {
        await createResource(endpoint, { name })
        toast.success('Subcategory added successfully.')
      }

      setSubcategoryModal(null)
      await loadCategories(currentPage, searchTerm)
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, 'Unable to save subcategory.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteItem = async () => {
    if (!deleteTarget) {
      return
    }

    setIsSubmitting(true)

    try {
      if (deleteTarget.type === 'subcategory') {
        await deleteResource(
          `/categories/${deleteTarget.category.id}/subcategories`,
          deleteTarget.subcategory.id,
        )
        toast.success('Subcategory deleted successfully.')
      } else {
        await deleteResource('/categories', deleteTarget.category.id)
        toast.success('Category deleted successfully.')
      }

      setDeleteTarget(null)
      await loadCategories(currentPage, searchTerm)
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, `Unable to delete ${deleteTarget.type}.`))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <PageTitle
        title="Categories"
        description="Organize categories and all associated subcategories from one place."
        action={
          <Button onClick={() => setCategoryModal({ category: null })}>
            <Plus size={18} aria-hidden="true" />
            Add Category
          </Button>
        }
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <SearchInput
              value={searchTerm}
              placeholder="Search categories or subcategories"
              onChange={(value) => {
                setSearchTerm(value)
                setCurrentPage(1)
              }}
            />
          </div>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{pagination.total}</span> categories
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <CategorySkeleton />
          ) : error ? (
            <div className="px-5 py-14 text-center">
              <p className="font-semibold text-slate-900">Unable to load categories</p>
              <p className="mt-1 text-sm text-slate-500">{error}</p>
              <Button variant="secondary" className="mt-4" onClick={() => void loadCategories()}>
                Try again
              </Button>
            </div>
          ) : categories.length ? (
            categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onAddSubcategory={() => setSubcategoryModal({ category, subcategory: null })}
                onEditCategory={() => setCategoryModal({ category })}
                onEditSubcategory={(subcategory) => setSubcategoryModal({ category, subcategory })}
                onDeleteCategory={() => setDeleteTarget({ type: 'category', category })}
                onDeleteSubcategory={(subcategory) =>
                  setDeleteTarget({ type: 'subcategory', category, subcategory })
                }
              />
            ))
          ) : (
            <div className="px-5 py-16 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <FolderTree size={24} aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-semibold text-slate-950">No categories found</h2>
              <p className="mt-1 text-sm text-slate-500">
                Add a category and organize its subcategories.
              </p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={Math.min(currentPage, pagination.totalPages)}
          totalPages={pagination.totalPages}
          isLoading={isLoading}
          onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() => setCurrentPage((page) => Math.min(pagination.totalPages, page + 1))}
        />
      </div>

      {categoryModal ? (
        <CategoryFormModal
          category={categoryModal.category}
          isSubmitting={isSubmitting}
          onClose={() => setCategoryModal(null)}
          onSubmit={saveCategory}
        />
      ) : null}

      {subcategoryModal ? (
        <SubcategoryFormModal
          subcategory={subcategoryModal.subcategory}
          isSubmitting={isSubmitting}
          onClose={() => setSubcategoryModal(null)}
          onSubmit={saveSubcategory}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmationModal
          title={`Delete ${deleteTarget.type === 'category' ? 'Category' : 'Subcategory'}`}
          itemName={
            deleteTarget.type === 'category'
              ? deleteTarget.category.name
              : deleteTarget.subcategory.name
          }
          noun={deleteTarget.type === 'category' ? 'category' : 'subcategory'}
          isSubmitting={isSubmitting}
          onClose={() => setDeleteTarget(null)}
          onDelete={deleteItem}
        />
      ) : null}
    </section>
  )
}

function CategoryRow({
  category,
  onAddSubcategory,
  onEditCategory,
  onEditSubcategory,
  onDeleteCategory,
  onDeleteSubcategory,
}) {
  const subcategories = category.subcategories || []

  return (
    <article className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FolderTree size={21} aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-slate-950">{category.name}</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {subcategories.length} {subcategories.length === 1 ? 'subcategory' : 'subcategories'}
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {category._count?.products || 0} products
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {subcategories.length ? (
                subcategories.map((subcategory) => (
                  <span
                    key={subcategory.id}
                    className="group inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-2.5 pr-1 text-sm text-slate-700"
                  >
                    {subcategory.name}
                    <button
                      type="button"
                      className="rounded p-1 text-slate-400 hover:bg-white hover:text-brand-600"
                      aria-label={`Edit ${subcategory.name}`}
                      onClick={() => onEditSubcategory(subcategory)}
                    >
                      <Edit3 size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 text-slate-400 hover:bg-white hover:text-red-600"
                      aria-label={`Delete ${subcategory.name}`}
                      onClick={() => onDeleteSubcategory(subcategory)}
                    >
                      <X size={13} aria-hidden="true" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400">No subcategories yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="secondary" className="h-9 px-3" onClick={onAddSubcategory}>
            <Plus size={16} aria-hidden="true" />
            Subcategory
          </Button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600"
            aria-label={`Edit ${category.name}`}
            onClick={onEditCategory}
          >
            <Edit3 size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
            aria-label={`Delete ${category.name}`}
            onClick={onDeleteCategory}
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

function CategoryFormModal({ category, isSubmitting, onClose, onSubmit }) {
  const [name, setName] = useState(category?.name || '')
  const [subcategories, setSubcategories] = useState(
    category?.subcategories?.length
      ? category.subcategories.map((subcategory) => ({ ...subcategory, rowId: subcategory.id }))
      : [{ id: null, name: '', rowId: crypto.randomUUID() }],
  )
  const [formError, setFormError] = useState('')

  const submitForm = (event) => {
    event.preventDefault()
    const normalizedName = name.trim()
    const normalizedSubcategories = subcategories
      .map((subcategory) => ({
        ...(subcategory.id ? { id: subcategory.id } : {}),
        name: subcategory.name.trim(),
      }))
      .filter((subcategory) => subcategory.name)

    if (normalizedName.length < 2) {
      setFormError('Category name must be at least 2 characters.')
      return
    }

    const uniqueNames = new Set(
      normalizedSubcategories.map((subcategory) => subcategory.name.toLocaleLowerCase()),
    )

    if (uniqueNames.size !== normalizedSubcategories.length) {
      setFormError('Subcategory names must be unique within the category.')
      return
    }

    setFormError('')
    void onSubmit({ name: normalizedName, subcategories: normalizedSubcategories })
  }

  return (
    <Modal
      title={category ? 'Edit Category' : 'Add Category'}
      onClose={onClose}
      size="wide"
    >
      <form className="space-y-5" onSubmit={submitForm}>
        {formError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </p>
        ) : null}

        <FormField label="Category Name">
          <input
            value={name}
            className={inputClassName}
            placeholder="Boxes by Style"
            required
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>

        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Subcategories</p>
              <p className="mt-1 text-sm text-slate-500">
                Add as many child items as this category needs.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3"
              onClick={() =>
                setSubcategories((current) => [
                  ...current,
                  { id: null, name: '', rowId: crypto.randomUUID() },
                ])
              }
            >
              <Plus size={16} aria-hidden="true" />
              Add Row
            </Button>
          </div>

          <div className="mt-3 space-y-2">
            {subcategories.map((subcategory, index) => (
              <div key={subcategory.rowId} className="flex items-center gap-2">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Tags size={17} aria-hidden="true" />
                </span>
                <input
                  value={subcategory.name}
                  className={inputClassName}
                  placeholder={`Subcategory ${index + 1}`}
                  onChange={(event) =>
                    setSubcategories((current) =>
                      current.map((item) =>
                        item.rowId === subcategory.rowId
                          ? { ...item, name: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="rounded-lg border border-red-100 p-2.5 text-red-600 hover:bg-red-50"
                  aria-label={`Remove subcategory row ${index + 1}`}
                  onClick={() =>
                    setSubcategories((current) =>
                      current.filter((item) => item.rowId !== subcategory.rowId),
                    )
                  }
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : category ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function SubcategoryFormModal({ subcategory, isSubmitting, onClose, onSubmit }) {
  const [name, setName] = useState(subcategory?.name || '')

  const submitForm = (event) => {
    event.preventDefault()

    if (name.trim().length < 2) {
      toast.error('Subcategory name must be at least 2 characters.')
      return
    }

    void onSubmit(name.trim())
  }

  return (
    <Modal title={subcategory ? 'Edit Subcategory' : 'Add Subcategory'} onClose={onClose}>
      <form className="space-y-5" onSubmit={submitForm}>
        <FormField label="Subcategory Name">
          <input
            value={name}
            className={inputClassName}
            placeholder="Apparel Boxes"
            required
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Subcategory'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function CategorySkeleton() {
  return Array.from({ length: 4 }).map((_, index) => (
    <div key={index} className="animate-pulse p-5">
      <div className="flex gap-3">
        <div className="size-11 rounded-xl bg-slate-100" />
        <div className="flex-1">
          <div className="h-4 w-44 rounded bg-slate-100" />
          <div className="mt-3 flex gap-2">
            <div className="h-7 w-28 rounded-lg bg-slate-100" />
            <div className="h-7 w-32 rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  ))
}

export default CategoryPage
