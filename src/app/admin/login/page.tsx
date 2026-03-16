import { adminLogin } from '../actions'

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams
  const hasInvalidPassword = params?.error === 'invalid-password'

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-xl shadow-md border max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {hasInvalidPassword && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid password. Try again.
          </p>
        )}
        <form action={adminLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              name="password" 
              className="mt-1 block w-full p-2 border rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              required 
              placeholder="admin123"
            />
          </div>
          <button className="w-full bg-gray-900 text-white p-3 rounded-md hover:bg-black font-semibold transition">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
