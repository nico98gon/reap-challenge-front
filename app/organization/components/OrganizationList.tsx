'use client'

import { useState, useEffect } from 'react'
import { OrganizationCard } from './OrganizationCard'
import { Pagination } from '../../../components/Pagination'
import { CreateOrganizationDialog } from './CreateOrganizationDialog'

interface Organization {
  id: number
  name: string
  facilities: { id: number; organizationId: number; name: string }[]
  pcc_org_id: string | null
  pcc_org_uuid: string | null
}

interface ApiResponse {
  data: Organization[]
  currentPage: number
  totalPages: number
  totalOrganizations: number
}

export function OrganizationList() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrganizations(currentPage)
  }, [currentPage])

  const fetchOrganizations = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations-with-facilities?page=${page}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse = await response.json()
      setOrganizations(data.data)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching organizations:', error)
      setError('Failed to fetch organizations. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrganizationCreated = () => {
    fetchOrganizations(currentPage)
  }

  const handleOrganizationDeleted = (deletedId: number) => {
    setOrganizations(organizations.filter(org => org.id !== deletedId))
  }

  return (
    <div>
      <div className="mb-6">
        <CreateOrganizationDialog onOrganizationCreated={handleOrganizationCreated} />
      </div>
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <OrganizationCard key={org.id} organization={org} onDelete={handleOrganizationDeleted} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

