import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Organization {
  id: number
  name: string
  facilities: { id: number; organizationId: number; name: string }[]
  pcc_org_id: string | null
  pcc_org_uuid: string | null
}

interface OrganizationCardProps {
  organization: Organization
  onDelete: (id: number) => void
}

export function OrganizationCard({ organization, onDelete }: OrganizationCardProps) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations/${organization.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete organization')
        }

        onDelete(organization.id)
      } catch (error) {
        console.error('Error deleting organization:', error)
        alert('Failed to delete organization. Please try again.')
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">Facilities: {organization.facilities?.length || "No Facility"}</p>
        <p className="text-sm text-muted-foreground">PCC Org ID: {organization?.pcc_org_id || 'Not set'}</p>
        <p className="text-sm text-muted-foreground">PCC Org UUID: {organization?.pcc_org_uuid || 'Not set'}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/organization/${organization.id}`}>
          <Button variant="outline">View</Button>
        </Link>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </CardFooter>
    </Card>
  )
}