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
  Upload,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageTitle from '../../components/common/PageTitle'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import {
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

const statusOptions = ['Active', 'Draft', 'Inactive']
const pageSize = PAGE_SIZE

function ProductPage() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')
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
  const [industries, setIndustries] = useState([])
  const [materials, setMaterials] = useState([])
  const [finishes, setFinishes] = useState([])
  const [boxStyles, setBoxStyles] = useState([])

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const lookups = await getLookupResources()

        setCategories(lookups.categories)
        setIndustries(lookups.industries)
        setMaterials(lookups.materials)
        setFinishes(lookups.finishes)
        setBoxStyles(lookups.boxStyles)
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load lookup data right now.'))
      }
    }

    void loadLookups()
  }, [])

  const loadProducts = useCallback(async (
    page = currentPage,
    query = searchTerm,
    categoryValue = categoryFilter,
    industryValue = industryFilter,
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
          industryId: industryValue === 'All' ? '' : industryValue,
          materialId: '',
          finishId: '',
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
  }, [categoryFilter, currentPage, industryFilter, searchTerm, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProducts(currentPage, searchTerm, categoryFilter, industryFilter, statusFilter)
    }, 0)

    return () => clearTimeout(timer)
  }, [categoryFilter, currentPage, industryFilter, loadProducts, searchTerm, statusFilter])

  const categoryFilterOptions = useMemo(
    () => [{ value: 'All', label: 'All Category' }, ...categories.map((option) => ({ value: option.id, label: option.name }))],
    [categories],
  )
  const industryFilterOptions = useMemo(
    () => [{ value: 'All', label: 'All Industry' }, ...industries.map((option) => ({ value: option.id, label: option.name }))],
    [industries],
  )
  const statusFilterOptions = useMemo(
    () => [{ value: 'All', label: 'All Status' }, { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }],
    [],
  )

  const totalPages = Math.max(1, pagination.totalPages)
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const resetToFirstPage = () => setCurrentPage(1)

  const handleAddProduct = async (product) => {
    const validationMessage = validateProductPayload(product)

    if (validationMessage) {
      toast.error(validationMessage)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createResource('/products', buildProductPayload(product))
      setIsAddModalOpen(false)
      setCurrentPage(1)
      await loadProducts(1, searchTerm, categoryFilter, industryFilter, statusFilter)
      toast.success('Product added successfully.')
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to add product right now.')
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveProduct = async (product) => {
    const validationMessage = validateProductPayload(product)

    if (validationMessage) {
      toast.error(validationMessage)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await updateResource('/products', editingProduct.id, buildProductPayload(product))
      setEditingProduct(null)
      await loadProducts(currentPage, searchTerm, categoryFilter, industryFilter, statusFilter)
      toast.success('Product updated successfully.')
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to update product right now.')
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
      await loadProducts(currentPage, searchTerm, categoryFilter, industryFilter, statusFilter)
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
    setError(null)

    try {
      await updateResource('/products', product.id, buildProductPayload({ ...product, status: nextStatus }))
      await loadProducts(currentPage, searchTerm, categoryFilter, industryFilter, statusFilter)
      toast.success('Status updated successfully.')
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to update product status right now.')
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <PageTitle
        title="Products"
        description="Manage product catalog data with search, filters, pagination, and backend-backed CRUD operations."
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
                resetToFirstPage()
              }}
            />
            <FilterSelect
              label="Category"
              value={categoryFilter}
              options={categoryFilterOptions}
              onChange={(value) => {
                setCategoryFilter(value)
                resetToFirstPage()
              }}
            />
            <FilterSelect
              label="Industry"
              value={industryFilter}
              options={industryFilterOptions}
              onChange={(value) => {
                setIndustryFilter(value)
                resetToFirstPage()
              }}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              options={statusFilterOptions}
              onChange={(value) => {
                setStatusFilter(value)
                resetToFirstPage()
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
            <button
              type="button"
              className="text-left text-sm font-semibold text-brand-600 hover:text-brand-500 disabled:cursor-not-allowed disabled:text-slate-400"
              disabled={!searchTerm && categoryFilter === 'All' && industryFilter === 'All' && statusFilter === 'All'}
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('All')
                setIndustryFilter('All')
                setStatusFilter('All')
                setCurrentPage(1)
              }}
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <TableHead>Featured Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Finish</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">Actions</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <TableSkeleton />
              ) : error ? (
                <tr>
                  <td colSpan="8" className="px-4 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-950">Unable to load products</p>
                    <p className="mt-1 text-sm text-slate-500">{error}</p>
                    <Button variant="secondary" className="mt-4" onClick={() => void loadProducts(currentPage, searchTerm, categoryFilter, industryFilter, statusFilter)}>
                      Try again
                    </Button>
                  </td>
                </tr>
              ) : products.length ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-4">
                      <img
                        src={product.featuredImage}
                        alt=""
                        className="size-14 rounded-lg border border-slate-200 object-cover"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                        <p className="text-xs text-slate-500">ID: PRD-{product.id.toString().padStart(3, '0')}</p>
                      </div>
                    </td>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.industry}</TableCell>
                    <TableCell>{product.material}</TableCell>
                    <TableCell>{product.finish}</TableCell>
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
          industries={industries}
          materials={materials}
          finishes={finishes}
          boxStyles={boxStyles}
          isSubmitting={isSubmitting}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProduct}
        />
      ) : null}

      {editingProduct ? (
        <ProductModal
          title="Edit Product"
          submitLabel="Save Changes"
          product={editingProduct}
          categories={categories}
          industries={industries}
          materials={materials}
          finishes={finishes}
          boxStyles={boxStyles}
          isSubmitting={isSubmitting}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleSaveProduct}
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
        placeholder="Search products"
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
        <option value="All">All {label}</option>
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

function StatusToggle({ status, onToggle }) {
  const isActive = status === 'Active'

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition',
        isActive
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
          : status === 'Draft'
            ? 'bg-amber-50 text-amber-700 ring-amber-600/10'
            : 'bg-slate-100 text-slate-600 ring-slate-500/10',
      )}
      onClick={onToggle}
    >
      <span
        className={cn(
          'size-2 rounded-full',
          isActive ? 'bg-emerald-500' : status === 'Draft' ? 'bg-amber-500' : 'bg-slate-400',
        )}
      />
      {status}
    </button>
  )
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={index}>
      {Array.from({ length: 8 }).map((__, cellIndex) => (
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
      <td colSpan="8" className="px-4 py-14 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Package size={24} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-950">No products found</h2>
        <p className="mt-1 text-sm text-slate-500">Adjust filters or add a new product to the catalog.</p>
      </td>
    </tr>
  )
}

function ProductModal({
  title,
  submitLabel,
  product,
  categories,
  industries,
  materials,
  finishes,
  boxStyles,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const [featuredImage, setFeaturedImage] = useState(product?.featuredImage || createProductImage('New', '#1565c0', '#d8ecff'))
  const [galleryImages, setGalleryImages] = useState(product?.galleryImages || [])
  const [isActive, setIsActive] = useState(product?.status !== 'Inactive')

  const handleFeaturedImageChange = (event) => {
    const file = event.target.files?.[0]

    if (file) {
      setFeaturedImage(URL.createObjectURL(file))
    }
  }

  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files || [])
    const previews = files.map((file) => URL.createObjectURL(file))
    setGalleryImages((current) => [...current, ...previews])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const status = formData.get('status')

    onSubmit({
      name: formData.get('name'),
      categoryId: formData.get('category'),
      industryId: formData.get('industry'),
      materialId: formData.get('material'),
      finishId: formData.get('finish'),
      boxStyleId: formData.get('boxStyle') || boxStyles[0]?.id || '',
      status: status === 'Draft' ? 'Active' : isActive ? 'Active' : 'Inactive',
      featuredImage,
      galleryImages,
    })
  }

  return (
    <Modal title={title} onClose={onClose} size="wide">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <ImageUploadPanel
              title="Featured Image"
              description="Upload the main product image preview."
              icon={ImagePlus}
              inputId="featured-image"
              multiple={false}
              onChange={handleFeaturedImageChange}
            >
              <img
                src={featuredImage}
                alt=""
                className="mt-4 aspect-[4/3] w-full rounded-lg border border-slate-200 object-cover"
              />
            </ImageUploadPanel>

            <ImageUploadPanel
              title="Gallery Images"
              description="Upload multiple supporting product images."
              icon={Upload}
              inputId="gallery-images"
              multiple
              onChange={handleGalleryImagesChange}
            >
              <div className="mt-4 grid grid-cols-4 gap-2">
                {galleryImages.length ? (
                  galleryImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative">
                      <img
                        src={image}
                        alt=""
                        className="aspect-square w-full rounded-lg border border-slate-200 object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Remove gallery image"
                        className="absolute right-1 top-1 rounded-md bg-white/90 p-1 text-slate-600 shadow-sm hover:text-red-600"
                        onClick={() =>
                          setGalleryImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
                        }
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
                    No gallery images selected
                  </div>
                )}
              </div>
            </ImageUploadPanel>
          </div>

          <div className="space-y-4">
            <FormField label="Product Name">
              <input
                name="name"
                defaultValue={product?.name || ''}
                className={inputClassName}
                placeholder="Custom Mailer Box"
                required
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category">
                <SelectField
                  name="category"
                  defaultValue={product?.categoryId || categories[0]?.id}
                  options={categories.map((option) => ({ value: option.id, label: option.name }))}
                />
              </FormField>
              <FormField label="Industry">
                <SelectField
                  name="industry"
                  defaultValue={product?.industryId || industries[0]?.id}
                  options={industries.map((option) => ({ value: option.id, label: option.name }))}
                />
              </FormField>
              <FormField label="Material">
                <SelectField
                  name="material"
                  defaultValue={product?.materialId || materials[0]?.id}
                  options={materials.map((option) => ({ value: option.id, label: option.name }))}
                />
              </FormField>
              <FormField label="Finish">
                <SelectField
                  name="finish"
                  defaultValue={product?.finishId || finishes[0]?.id}
                  options={finishes.map((option) => ({ value: option.id, label: option.name }))}
                />
              </FormField>
            </div>

            <FormField label="Status">
              <select name="status" defaultValue={product?.status || 'Active'} className={inputClassName}>
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Box Style">
              <SelectField
                name="boxStyle"
                defaultValue={product?.boxStyleId || boxStyles[0]?.id}
                options={boxStyles.map((option) => ({ value: option.id, label: option.name }))}
              />
            </FormField>

            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Status Toggle</p>
                  <p className="mt-1 text-sm text-slate-500">Switch between active and inactive for quick catalog control.</p>
                </div>
                <button
                  type="button"
                  aria-pressed={isActive}
                  className={cn(
                    'relative h-7 w-12 rounded-full transition',
                    isActive ? 'bg-brand-600' : 'bg-slate-300',
                  )}
                  onClick={() => setIsActive((current) => !current)}
                >
                  <span
                    className={cn(
                      'absolute top-1 size-5 rounded-full bg-white shadow transition',
                      isActive ? 'left-6' : 'left-1',
                    )}
                  />
                </button>
              </div>
            </div>
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

function ImageUploadPanel({ title, description, icon: Icon, inputId, multiple, onChange, children }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <label
        htmlFor={inputId}
        className="mt-4 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
      >
        Choose image{multiple ? 's' : ''}
      </label>
      <input id={inputId} type="file" accept="image/*" multiple={multiple} className="sr-only" onChange={onChange} />
      {children}
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

function SelectField({ name, defaultValue, options }) {
  return (
    <select name={name} defaultValue={defaultValue || options[0]?.value} className={inputClassName}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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
          <div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-950">{product.name}</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-70"
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

function createProductImage(label, color, background) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
      <rect width="320" height="240" rx="24" fill="${background}" />
      <rect x="76" y="48" width="168" height="132" rx="16" fill="#ffffff" stroke="${color}" stroke-width="10" />
      <path d="M96 88h128M96 116h96M96 144h72" stroke="${color}" stroke-width="12" stroke-linecap="round" opacity="0.35" />
      <text x="160" y="208" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="${color}">${label}</text>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function normalizeProduct(product) {
  return {
    ...product,
    id: product.id,
    name: product.name || 'Untitled Product',
    category: product.category?.name || product.category || '',
    categoryId: product.categoryId || product.category?.id || '',
    industry: product.industry?.name || product.industry || '',
    industryId: product.industryId || product.industry?.id || '',
    material: product.material?.name || product.material || '',
    materialId: product.materialId || product.material?.id || '',
    finish: product.finish?.name || product.finish || '',
    finishId: product.finishId || product.finish?.id || '',
    boxStyleId: product.boxStyleId || product.boxStyle?.id || '',
    status: product.status === 'ACTIVE' ? 'Active' : product.status === 'INACTIVE' ? 'Inactive' : product.status || 'Active',
    featuredImage: product.featuredImage || createProductImage(product.name || 'Product', '#1565c0', '#d8ecff'),
    galleryImages: Array.isArray(product.images) ? product.images.map((image) => image.imageUrl || image.url) : [],
  }
}

function buildProductPayload(product) {
  return {
    name: product.name.trim(),
    description: '',
    featuredImage: resolveImageUrl(product.featuredImage),
    status: mapStatusValueToBackend(product.status),
    categoryId: product.categoryId,
    industryId: product.industryId,
    boxStyleId: product.boxStyleId,
    materialId: product.materialId,
    finishId: product.finishId,
  }
}

function validateProductPayload(product) {
  if (!product.name?.trim()) {
    return 'Product name is required.'
  }

  if (product.name.trim().length < 2) {
    return 'Product name must be at least 2 characters.'
  }

  if (!product.categoryId) {
    return 'Category is required.'
  }

  if (!product.industryId) {
    return 'Industry is required.'
  }

  if (!product.materialId) {
    return 'Material is required.'
  }

  if (!product.finishId) {
    return 'Finish is required.'
  }

  if (!product.boxStyleId) {
    return 'Box style is required.'
  }

  return ''
}

function resolveImageUrl(value) {
  if (!value) {
    return createProductImage('Product', '#1565c0', '#d8ecff')
  }

  if (typeof value === 'string' && value.startsWith('blob:')) {
    return createProductImage('Product', '#1565c0', '#d8ecff')
  }

  return value
}

function mapStatusValueToBackend(statusValue) {
  if (statusValue === 'Active') {
    return 'ACTIVE'
  }

  if (statusValue === 'Inactive') {
    return 'INACTIVE'
  }

  return 'ACTIVE'
}

function mapStatusFilterToBackend(statusValue) {
  if (statusValue === 'Active') {
    return 'ACTIVE'
  }

  if (statusValue === 'Inactive') {
    return 'INACTIVE'
  }

  return ''
}

const inputClassName =
  'h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100'

export default ProductPage
