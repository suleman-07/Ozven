import { Boxes } from 'lucide-react'
import EntityManagementPage from '../../components/common/EntityManagementPage'

function BoxStylePage() {
  return (
    <EntityManagementPage
      apiEndpoint="/box-styles"
      responseKey="boxStyles"
      title="Box Styles"
      entityNoun="Box Style"
      formNameLabel="Box Style Name"
      description="Manage packaging box styles with search, add, edit, delete, and pagination backed by the admin API."
      emptyTitle="No box styles found"
      emptyDescription="Try a different search term or add a new box style."
      searchPlaceholder="Search box styles"
      idPrefix="BOX"
      icon={Boxes}
    />
  )
}

export default BoxStylePage
