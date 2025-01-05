'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type UserFormData = z.infer<typeof userSchema>

export default function UserPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
    },
  })

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
        form.reset(data.data)
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

  const handleSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        toast.success('User updated', {
          description: `The user with email ${data.email} has been updated successfully.`,
        })
        setIsEditing(false)
        fetchUser()
      } else {
        throw new Error(result.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Failed to update user. Please try again later.')
      toast.error('Failed to update user')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">User Details</h1>
      {isEditing ? (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              {...form.register('email')}
              id="email"
              className="mt-1 block w-full"
            />
            <p className="text-sm text-red-500">
              {form.formState.errors.email?.message}
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p><strong>Email:</strong> {form.getValues('email')}</p>
          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button onClick={() => router.push('/users')} variant="outline">
              Back to List
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}