import { UserList } from '@/app/users/components/UserList'

export default function UsersPage() {
  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Users</h1>
      <UserList />
    </div>
  )
}