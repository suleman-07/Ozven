import { Sparkles } from 'lucide-react'
import EntityManagementPage from '../../components/common/EntityManagementPage'

function FinishPage() {
  return (
    <EntityManagementPage
      apiEndpoint="/finishes"
      responseKey="finishes"
      title="Finishes"
      entityNoun="Finish"
      formNameLabel="Finish Name"
      description="Manage packaging finishes with search, add, edit, delete, and pagination backed by the admin API."
      emptyTitle="No finishes found"
      emptyDescription="Try a different search term or add a new finish."
      searchPlaceholder="Search finishes"
      idPrefix="FIN"
      icon={Sparkles}
    />
  )
}

export default FinishPage
