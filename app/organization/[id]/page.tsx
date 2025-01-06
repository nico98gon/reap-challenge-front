'use client'

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { SquarePlus } from 'lucide-react'

interface Facility {
  id: number
  name: string
}

interface Organization {
  id: number
  name: string
  facilities: Facility[]
  pcc_org_id: string | null
  pcc_org_uuid: string | null
}

type tParams = { id: string }

const organizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  pcc_org_id: z.string().min(1, 'PCC Org ID is required'),
  pcc_org_uuid: z.string().min(1, 'PCC Org UUID is required'),
  facilities: z.array(z.object({
    id: z.number().int().positive(),
    name: z.string().min(1, 'Facility name is required')
  })).min(1, 'At least one facility is required'),
})

export default function OrganizationPage(props: { params: Promise<tParams> }) {
  const params = use(props.params);
  const { id } = params
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      pcc_org_id: '',
      pcc_org_uuid: '',
      facilities: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    // @ts-expect-error Necesary to handle an incompatible type
    name: 'facilities',
  })

  const fetchOrganization = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setOrganization(data.data)
        form.reset(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch organization')
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
      setError('Failed to fetch organization. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [id, form])

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  const handleSubmit = async (data: z.infer<typeof organizationSchema>) => {
    setIsLoading(true)
    setError(null)
  
    const { pcc_org_id, pcc_org_uuid, ...dataWithoutPcc } = data // eslint-disable-line @typescript-eslint/no-unused-vars

    const dataToSubmit = {
      ...dataWithoutPcc,
      facilities: dataWithoutPcc.facilities.map(facility => ({
        name: facility.name,
      }))
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
  
      if (result.success) {
        setIsEditing(false)
        fetchOrganization()
        toast.success('Organization updated', {
          description: `The organization ${data.name} has been updated successfully`,
        })
      } else {
        throw new Error(result.error || 'Failed to update organization')
      }
    } catch (error) {
      console.error('Error updating organization:', error)
      setError('Failed to update organization. Please try again later.')
      toast.error('Failed to update organization')
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

  if (!organization) {
    return <div className="text-center py-4">Organization not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">{organization.name}</h1>
      {isEditing ? (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <Input
              {...form.register('name')}
              id="name"
              className="mt-1 block w-full"
            />
            <p className="text-sm text-red-500">{form.formState.errors.name?.message}</p>
          </div>
          <div>
            <label htmlFor="pcc_org_id" className="block text-sm font-medium">
              PCC Org ID
            </label>
            <Input
              {...form.register('pcc_org_id')}
              id="pcc_org_id"
              className="mt-1 block w-full"
              disabled
            />
            <p className="text-sm text-red-500">{form.formState.errors.pcc_org_id?.message}</p>
          </div>
          <div>
            <label htmlFor="pcc_org_uuid" className="block text-sm font-medium">
              PCC Org UUID
            </label>
            <Input
              {...form.register('pcc_org_uuid')}
              id="pcc_org_uuid"
              className="mt-1 block w-full"
              disabled
            />
            <p className="text-sm text-red-500">{form.formState.errors.pcc_org_uuid?.message}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="facilities" className="block text-sm font-medium">
              Facilities
            </label>
            {fields.map((facility, index) => (
              <div key={facility.id} className="flex items-center space-x-4">
                <Input
                  // @ts-expect-error Necesary to handle a dynamic index
                  {...form.register(`facilities.${index}.name`)}
                  placeholder="Facility Name"
                  className="mt-1 block w-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ id: fields.length + 1, name: '' })}
            >
              <SquarePlus className="mr-2 h-4 w-4" />
              Add Facility
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p><strong>PCC Org ID:</strong> {organization.pcc_org_id || 'Not set'}</p>
          <p><strong>PCC Org UUID:</strong> {organization.pcc_org_uuid || 'Not set'}</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">Facilities</h2>
          <ul className="list-disc pl-5">
            {organization.facilities.map((facility) => (
              <li key={facility.id}>{facility.name}</li>
            ))}
          </ul>
          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button onClick={() => router.push('/')} variant="outline">Back to List</Button>
          </div>
        </div>
      )}
    </div>
  )
}