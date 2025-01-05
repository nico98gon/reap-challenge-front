import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)  // Estado para controlar la visibilidad del Dialog

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations/${organization.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete organization')
      }

      onDelete(organization.id)
      setIsDialogOpen(false)
      toast.success('Organization deleted')
    } catch (error) {
      console.error('Error deleting organization:', error)
      toast.error('Failed to delete organization')
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Organization</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this organization? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Confirm Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}