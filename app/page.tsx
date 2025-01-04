import { OrganizationList } from './organization/components/OrganizationList'

export default function Home() {
  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Organizations</h1>
      <OrganizationList />
    </div>
  )
}