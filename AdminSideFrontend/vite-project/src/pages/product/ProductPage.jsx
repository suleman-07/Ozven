import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  ImagePlus,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageTitle from '../../components/common/PageTitle'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import {
  buildProductFormData,
  createResource,
  deleteResource,
  getErrorMessage,
  getLookupResources,
  getResource,
  listResource,
  PAGE_SIZE,
  updateResource,
} from '../../services/adminApi'
import { cn } from '../../utils/cn'

const pageSize = PAGE_SIZE
const statusOptions = ['Active', 'Inactive']

function ProductPage() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [subcategoryFilter, setSubcategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, total: 0, totalPages: 1 })
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const lookups = await getLookupResources()
        setCategories(lookups.categories)
        setSubcategories(lookups.subcategories)
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load lookup data right now.'))
      }
    }

    void loadLookups()
  }, [])

  const loadProducts = useCallback(
    async (
      page = currentPage,
      query = searchTerm,
      categoryValue = categoryFilter,
      subcategoryValue = subcategoryFilter,
      statusValue = statusFilter,
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await listResource('/products', {
          page,
          limit: pageSize,
          search: query,
          params: {
            categoryId: categoryValue === 'All' ? '' : categoryValue,
            subcategoryId: subcategoryValue === 'All' ? '' : subcategoryValue,
            status: mapStatusFilterToBackend(statusValue),
          },
        })

        setProducts(result.items.map(normalizeProduct))
        setPagination(result.pagination)
      } catch (err) {
        setProducts([])
        setPagination({ page, limit: pageSize, total: 0, totalPages: 1 })
        setError(getErrorMessage(err, 'Unable to load products right now.'))
      } finally {
        setIsLoading(false)
      }
    },
    [categoryFilter, currentPage, searchTerm, statusFilter, subcategoryFilter],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProducts(currentPage, searchTerm, categoryFilter, subcategoryFilter, statusFilter)
    }, 0)

    return () => clearTimeout(timer)
  }, [categoryFilter, currentPage, loadProducts, searchTerm, statusFilter, subcategoryFilter])

  const subcategoryFilterOptions = useMemo(() => {
    const filtered =
      categoryFilter === 'All'
        ? subcategories
        : subcategories.filter((item) => item.categoryId === categoryFilter)

    return [
      { value: 'All', label: 'All Subcategories' },
      ...filtered.map((item) => ({ value: item.id, label: item.name })),
    ]
  }, [categoryFilter, subcategories])

  const totalPages = Math.max(1, pagination.totalPages)
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const handleSave = async (product, productId = null) => {
    const validationMessage = validateProductPayload(product)

    if (validationMessage) {
      toast.error(validationMessage)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const payload = buildProductFormData(buildProductPayload(product))

      if (productId) {
        await updateResource('/products', productId, payload)
        toast.success('Product updated successfully.')
        setEditingProduct(null)
        await loadProducts(currentPage, searchTerm, categoryFilter, subcategoryFilter, statusFilter)
      } else {
        await createResource('/products', payload)
        toast.success('Product added successfully.')
        setIsAddModalOpen(false)
        setCurrentPage(1)
        await loadProducts(1, searchTerm, categoryFilter, subcategoryFilter, statusFilter)
      }
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to save product right now.')
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      await deleteResource('/products', deletingProduct.id)
      setDeletingProduct(null)
      await loadProducts(currentPage, searchTerm, categoryFilter, subcategoryFilter, statusFilter)
      toast.success('Product deleted successfully.')
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to delete product right now.')
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async (product) => {
    try {
      const payload = await getResource('/products', product.id, 'product')
      setEditingProduct(normalizeProduct(payload))
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to load product details right now.')
      setError(message)
      toast.error(message)
    }
  }

  const handleStatusToggle = async (product) => {
    const nextStatus = product.status === 'Active' ? 'Inactive' : 'Active'
    setIsSubmitting(true)

    try {
      await updateResource(
        '/products',
        product.id,
        buildProductFormData(buildProductPayload({ ...product, status: nextStatus })),
      )
      await loadProducts(currentPage, searchTerm, categoryFilter, subcategoryFilter, statusFilter)
      toast.success('Status updated successfully.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update product status right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <PageTitle
        title="Products"
        description="Manage packaging products with subcategory assignment and multiple Cloudinary images."
        action={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} aria-hidden="true" />
            Add Product
          </Button>
        }
      />

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <SearchInput
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value)
                setCurrentPage(1)
              }}
            />
            <FilterSelect
              label="Category"
              value={categoryFilter}
              options={[
                { value: 'All', label: 'All Categories' },
                ...categories.map((option) => ({ value: option.id, label: option.name })),
              ]}
              onChange={(value) => {
                setCategoryFilter(value)
                setSubcategoryFilter('All')
                setCurrentPage(1)
              }}
            />
            <FilterSelect
              label="Subcategory"
              value={subcategoryFilter}
              options={subcategoryFilterOptions}
              onChange={(value) => {
                setSubcategoryFilter(value)
                setCurrentPage(1)
              }}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              onChange={(value) => {
                setStatusFilter(value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2">
              <SlidersHorizontal size={16} aria-hidden="true" />
              <span>
                Showing <span className="font-semibold text-slate-900">{products.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{pagination.total}</span> products
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">Actions</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <TableSkeleton />
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-4 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-950">Unable to load products</p>
                    <p className="mt-1 text-sm text-slate-500">{error}</p>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={() =>
                        void loadProducts(
                          currentPage,
                          searchTerm,
                          categoryFilter,
                          subcategoryFilter,
                          statusFilter,
                        )
                      }
                    >
                      Try again
                    </Button>
                  </td>
                </tr>
              ) : products.length ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-4">
                      {product.featuredImage ? (
                        <img
                          src={product.featuredImage}
                          alt=""
                          className="size-14 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <span className="flex size-14 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <Package size={20} aria-hidden="true" />
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.categoryName}</p>
                      </div>
                    </td>
                    <TableCell>{product.subcategoryName}</TableCell>
                    <td className="whitespace-nowrap px-4 py-4">
                      <StatusToggle status={product.status} onToggle={() => void handleStatusToggle(product)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${product.name}`}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                          onClick={() => void handleEditProduct(product)}
                        >
                          <Edit3 size={17} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${product.name}`}
                          className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                          onClick={() => setDeletingProduct(product)}
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState />
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-900">{safeCurrentPage}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="h-9 px-3"
              disabled={safeCurrentPage === 1 || isLoading}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={17} aria-hidden="true" />
              Previous
            </Button>
            <Button
              variant="secondary"
              className="h-9 px-3"
              disabled={safeCurrentPage === totalPages || isLoading}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            >
              Next
              <ChevronRight size={17} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {isAddModalOpen ? (
        <ProductModal
          title="Add Product"
          submitLabel="Add Product"
          categories={categories}
          subcategories={subcategories}
          isSubmitting={isSubmitting}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(product) => void handleSave(product)}
        />
      ) : null}

      {editingProduct ? (
        <ProductModal
          title="Edit Product"
          submitLabel="Save Changes"
          product={editingProduct}
          categories={categories}
          subcategories={subcategories}
          isSubmitting={isSubmitting}
          onClose={() => setEditingProduct(null)}
          onSubmit={(product) => void handleSave(product, editingProduct.id)}
        />
      ) : null}

      {deletingProduct ? (
        <DeleteProductModal
          product={deletingProduct}
          isSubmitting={isSubmitting}
          onClose={() => setDeletingProduct(null)}
          onDelete={handleDeleteProduct}
        />
      ) : null}
    </section>
  )
}

function ProductModal({ title, submitLabel, product, categories, subcategories, isSubmitting, onClose, onSubmit }) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [status, setStatus] = useState(product?.status || 'Active')
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || '')
  const [subcategoryId, setSubcategoryId] = useState(product?.subcategoryId || '')
  const [imageItems, setImageItems] = useState(
    (product?.images || []).map((image) => ({
      id: image.id || null,
      preview: image.imageUrl || image,
      file: null,
    })),
  )
  const [removedImageIds, setRemovedImageIds] = useState([])

  const availableSubcategories = useMemo(
    () => subcategories.filter((item) => item.categoryId === categoryId),
    [categoryId, subcategories],
  )

  const resolvedSubcategoryId = availableSubcategories.some((item) => item.id === subcategoryId)
    ? subcategoryId
    : availableSubcategories[0]?.id || ''

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files || [])

    setImageItems((current) => [
      ...current,
      ...files.map((file) => ({
        id: null,
        preview: URL.createObjectURL(file),
        file,
      })),
    ])
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({
      name,
      description,
      status,
      subcategoryId: resolvedSubcategoryId,
      imageFiles: imageItems.filter((item) => item.file instanceof File).map((item) => item.file),
      removeImageIds: removedImageIds,
    })
  }

  return (
    <Modal title={title} onClose={onClose} size="wide">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <ImagePlus size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">Product Images</p>
                <p className="mt-1 text-sm text-slate-500">
                  Upload one or more images. Files are stored on Cloudinary.
                </p>
              </div>
            </div>

            <label
              htmlFor="product-images"
              className="mt-4 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
            >
              Choose images
            </label>
            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleImagesChange}
            />

            <div className="mt-4 grid grid-cols-3 gap-2">
              {imageItems.length ? (
                imageItems.map((image, index) => (
                  <div key={`${image.preview}-${index}`} className="relative">
                    <img
                      src={image.preview}
                      alt=""
                      className="aspect-square w-full rounded-lg border border-slate-200 object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Remove image"
                      className="absolute right-1 top-1 rounded-md bg-white/90 p-1 text-slate-600 shadow-sm hover:text-red-600"
                      onClick={() => {
                        setImageItems((current) => current.filter((_, imageIndex) => imageIndex !== index))
                        if (image.id) {
                          setRemovedImageIds((current) => [...current, image.id])
                        }
                      }}
                    >
                      <X size={13} aria-hidden="true" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
                  No images selected
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <FormField label="Product Name">
              <input
                value={name}
                className={inputClassName}
                placeholder="Custom Mailer Box"
                required
                onChange={(event) => setName(event.target.value)}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                value={description}
                rows={4}
                className={`${inputClassName} h-auto py-3`}
                placeholder="Describe materials, print options, and ideal use cases."
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category">
                <select
                  value={categoryId}
                  className={inputClassName}
                  onChange={(event) => {
                    const nextCategoryId = event.target.value
                    setCategoryId(nextCategoryId)
                    const nextSubcategories = subcategories.filter(
                      (item) => item.categoryId === nextCategoryId,
                    )
                    setSubcategoryId(nextSubcategories[0]?.id || '')
                  }}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Subcategory">
                <select
                  value={resolvedSubcategoryId}
                  className={inputClassName}
                  required
                  onChange={(event) => setSubcategoryId(event.target.value)}
                >
                  {availableSubcategories.length ? (
                    availableSubcategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No subcategories available</option>
                  )}
                </select>
              </FormField>
            </div>

            <FormField label="Status">
              <select
                value={status}
                className={inputClassName}
                onChange={(event) => setStatus(event.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
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

function SearchInput({ value, onChange }) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        placeholder="Search products or descriptions"
        className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function TableHead({ children, align = 'left' }) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500',
        align === 'right' ? 'text-right' : 'text-left',
      )}
    >
      {children}
    </th>
  )
}

function TableCell({ children }) {
  return <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{children}</td>
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

function StatusToggle({ status, onToggle }) {
  const isActive = status === 'Active'

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition',
        isActive
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
          : 'bg-slate-100 text-slate-600 ring-slate-500/10',
      )}
      onClick={onToggle}
    >
      <span className={cn('size-2 rounded-full', isActive ? 'bg-emerald-500' : 'bg-slate-400')} />
      {status}
    </button>
  )
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={index}>
      {Array.from({ length: 5 }).map((__, cellIndex) => (
        <td key={cellIndex} className="px-4 py-4">
          <div className={cn('animate-pulse rounded bg-slate-100', cellIndex === 0 ? 'size-14' : 'h-4')} />
        </td>
      ))}
    </tr>
  ))
}

function EmptyState() {
  return (
    <tr>
      <td colSpan="5" className="px-4 py-14 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Package size={24} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-950">No products found</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add a packaging product under a subcategory to get started.
        </p>
      </td>
    </tr>
  )
}

function DeleteProductModal({ product, isSubmitting, onClose, onDelete }) {
  return (
    <Modal title="Delete Product" onClose={onClose}>
      <div>
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <Trash2 size={22} aria-hidden="true" />
          </span>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-950">{product.name}</span>?
            This will also remove its Cloudinary images.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function normalizeProduct(product) {
  return {
    ...product,
    id: product.id,
    name: product.name || 'Untitled Product',
    description: product.description || '',
    subcategoryId: product.subcategoryId || product.subcategory?.id || '',
    subcategoryName: product.subcategory?.name || '',
    categoryId: product.subcategory?.categoryId || product.subcategory?.category?.id || '',
    categoryName: product.subcategory?.category?.name || '',
    status: product.status === 'ACTIVE' ? 'Active' : product.status === 'INACTIVE' ? 'Inactive' : product.status || 'Active',
    featuredImage: product.featuredImage || product.images?.[0]?.imageUrl || '',
    images: Array.isArray(product.images)
      ? product.images.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
        }))
      : [],
  }
}

function buildProductPayload(product) {
  return {
    name: product.name.trim(),
    description: product.description || '',
    status: mapStatusValueToBackend(product.status),
    subcategoryId: product.subcategoryId,
    imageFiles: product.imageFiles || [],
    removeImageIds: product.removeImageIds || [],
  }
}

function validateProductPayload(product) {
  if (!product.name?.trim() || product.name.trim().length < 2) {
    return 'Product name must be at least 2 characters.'
  }

  if (!product.subcategoryId) {
    return 'Subcategory is required.'
  }

  return ''
}

function mapStatusValueToBackend(statusValue) {
  return statusValue === 'Inactive' ? 'INACTIVE' : 'ACTIVE'
}

function mapStatusFilterToBackend(statusValue) {
  if (statusValue === 'Active') return 'ACTIVE'
  if (statusValue === 'Inactive') return 'INACTIVE'
  return ''
}

const inputClassName =
  'h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100'

export default ProductPage
