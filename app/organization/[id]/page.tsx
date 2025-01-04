'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Organization {
  id: number
  name: string
  facilities: { id: number; organizationId: number; name: string }[]
  pcc_org_id: string | null
  pcc_org_uuid: string | null
}

export default function OrganizationPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const [params, setParams] = useState<{ id: string } | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await paramsPromise
      setParams(resolvedParams)
    }
    fetchParams()
  }, [paramsPromise])

  useEffect(() => {
    if (params?.id) {
      fetchOrganization()
    }
  }, [params])

  const fetchOrganization = async () => {
    if (!params?.id) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations/${params.id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setOrganization(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch organization')
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
      setError('Failed to fetch organization. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (organization) {
      setOrganization({ ...organization, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!params?.id) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organization),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setIsEditing(false)
        fetchOrganization()
      } else {
        throw new Error(data.error || 'Failed to update organization')
      }
    } catch (error) {
      console.error('Error updating organization:', error)
      setError('Failed to update organization. Please try again later.')
    }
  }

  if (isLoading || !params) {
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
    </div>
  )
}