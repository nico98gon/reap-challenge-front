'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ThumbsUpIcon } from 'lucide-react'

interface CreateUserDialogProps {
  onUserCreated: () => void
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [email, setEmail] = useState('')
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null)
  const [facilities, setFacilities] = useState<{ id: number; name: string }[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/facilities`)
  
        if (!response.ok) {
          throw new Error(`Failed to fetch facilities: ${response.statusText}`)
        }
  
        const data = await response.json()
  
        setFacilities(data.data)
      } catch (error) {
        console.error('Error fetching facilities:', error)
        setFacilities([])
      }
    }
  
    fetchFacilities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!selectedFacilityId) {
      setError('Please select a facility.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, facilities: [selectedFacilityId] }),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      setEmail('')
      setSelectedFacilityId(null)
      setIsOpen(false)
      onUserCreated()
      toast.success("User created", {
        description: `The user ${email} has been created successfully`,
        icon: <ThumbsUpIcon className="text-green-500" size={20} />
      })
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Failed to create user. Please try again.')
      toast.error('Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Enter the email for the new user and select a facility.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="facility" className="text-right">
                Facility
              </Label>
              <Select
                value={selectedFacilityId?.toString() || ''}
                onValueChange={(value) => setSelectedFacilityId(Number(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}