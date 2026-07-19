import { Layers3 } from 'lucide-react'
import EntityManagementPage from '../../components/common/EntityManagementPage'

function MaterialPage() {
  return (
    <EntityManagementPage
      apiEndpoint="/materials"
      responseKey="materials"
      title="Materials"
      entityNoun="Material"
      formNameLabel="Material Name"
      description="Manage packaging materials with search, add, edit, delete, and pagination backed by the admin API."
      emptyTitle="No materials found"
      emptyDescription="Try a different search term or add a new material."
      searchPlaceholder="Search materials"
      idPrefix="MAT"
      icon={Layers3}
    />
  )
}

export default MaterialPage
