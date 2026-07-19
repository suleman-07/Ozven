import { Factory } from 'lucide-react'
import EntityManagementPage from '../../components/common/EntityManagementPage'

function IndustryPage() {
  return (
    <EntityManagementPage
      apiEndpoint="/industries"
      responseKey="industries"
      title="Industries"
      entityNoun="Industry"
      formNameLabel="Industry Name"
      description="Manage packaging industries with search, add, edit, delete, and pagination backed by the admin API."
      emptyTitle="No industries found"
      emptyDescription="Try a different search term or add a new industry."
      searchPlaceholder="Search industries"
      idPrefix="IND"
      icon={Factory}
      initialItems={[]}
    />
  )
}

export default IndustryPage
