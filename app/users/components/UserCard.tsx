import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface User {
  id: number
  email: string
  facilities: { id: number; name: string }[]
}

interface UserCardProps {
  user: User
  onDelete: (id: number) => void
}

export function UserCard({ user, onDelete }: UserCardProps) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${user.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete user')
        }

        onDelete(user.id)
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user. Please try again.')
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.email}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Facilities: {user.facilities?.length || "No Facility"}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/users/${user.id}`}>
          <Button variant="outline">View</Button>
        </Link>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </CardFooter>
    </Card>
  )
}