'use client'

import { useState, useEffect } from 'react'
import { UserCard } from './UserCard'
import { Pagination } from '../../../components/Pagination'
import { CreateUserDialog } from './CreateUserDialog'

interface User {
  id: number
  email: string
  facilities: { id: number; name: string }[]
}

interface ApiResponse {
  data: User[]
  currentPage: number
  totalPages: number
  totalUsers: number
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage])

  const fetchUsers = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?page=${page}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse = await response.json()
      setUsers(data.data)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserCreated = () => {
    fetchUsers(currentPage)
  }

  const handleUserDeleted = (deletedId: number) => {
    setUsers(users.filter(user => user.id !== deletedId))
  }

  return (
    <div>
      <div className="mb-6">
        <CreateUserDialog onUserCreated={handleUserCreated} />
      </div>
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} onDelete={handleUserDeleted} />
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