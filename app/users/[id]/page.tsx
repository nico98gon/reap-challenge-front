'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface User {
  id: number
  email: string
  facilities: { id: number; name: string }[]
}

export default function UserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${params.id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch user')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setError('Failed to fetch user. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setIsEditing(false)
        fetchUser()
      } else {
        throw new Error(data.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Failed to update user. Please try again later.')
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  if (!user) {
    return <div className="text-center py-4">User not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">{user.email}</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">
              Save
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mt-6 mb-2">Facilities</h2>
          <ul className="list-disc pl-5">
            {user.facilities.map((facility) => (
              <li key={facility.id}>{facility.name}</li>
            ))}
          </ul>
          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button onClick={() => router.push('/users')} variant="outline">
              Back to List
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}