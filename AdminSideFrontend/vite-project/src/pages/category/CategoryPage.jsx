import { FolderTree } from 'lucide-react'
import EntityManagementPage from '../../components/common/EntityManagementPage'

const initialCategories = [
  {
    id: 1,
    name: 'Custom Boxes',
    slug: 'custom-boxes',
    products: 48,
    status: 'Active',
    updatedAt: 'Jul 02, 2026',
  },
  {
    id: 2,
    name: 'Retail Packaging',
    slug: 'retail-packaging',
    products: 35,
    status: 'Active',
    updatedAt: 'Jun 28, 2026',
  },
  {
    id: 3,
    name: 'Food Packaging',
    slug: 'food-packaging',
    products: 27,
    status: 'Active',
    updatedAt: 'Jun 25, 2026',
  },
  {
    id: 4,
    name: 'Cosmetic Packaging',
    slug: 'cosmetic-packaging',
    products: 19,
    status: 'Draft',
    updatedAt: 'Jun 19, 2026',
  },
  {
    id: 5,
    name: 'Mailer Boxes',
    slug: 'mailer-boxes',
    products: 22,
    status: 'Active',
    updatedAt: 'Jun 14, 2026',
  },
  {
    id: 6,
    name: 'Rigid Boxes',
    slug: 'rigid-boxes',
    products: 16,
    status: 'Inactive',
    updatedAt: 'Jun 08, 2026',
  },
  {
    id: 7,
    name: 'Eco Packaging',
    slug: 'eco-packaging',
    products: 31,
    status: 'Active',
    updatedAt: 'Jun 01, 2026',
  },
]

function CategoryPage() {
  return (
    <EntityManagementPage
      addEnabled
      apiEndpoint="/categories"
      title="Categories"
      entityNoun="Category"
      formNameLabel="Category Name"
      description="Manage packaging category structure with search, add, edit, delete, and pagination backed by the admin API."
      emptyTitle="No categories found"
      emptyDescription="Try a different search term or add a new category."
      searchPlaceholder="Search categories"
      idPrefix="CAT"
      icon={FolderTree}
      initialItems={initialCategories}
    />
  )
}

export default CategoryPage
