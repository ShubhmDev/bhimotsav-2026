import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, ShieldAlert } from 'lucide-react'
import { adminLogout } from './actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_token')?.value === 'true'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isAdmin && (
        <header className="bg-gray-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-blue-400" />
              <Link href="/admin" className="font-bold text-lg tracking-wide">
                Admin Panel
              </Link>
            </div>
            <form action={adminLogout}>
               <button className="text-gray-300 hover:text-white flex items-center gap-2 text-sm font-medium">
                 <LogOut size={16} /> Logout
               </button>
            </form>
          </div>
        </header>
      )}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
