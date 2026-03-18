import { getCurrentUser } from '@/app/actions'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Calendar, Trophy, List, LogOut } from 'lucide-react'
import { logout } from '@/app/actions'
import EventCard from '@/components/EventCard'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const myRegistrations = await prisma.registration.findMany({
    where: { userId: user.id },
    include: { event: true },
    orderBy: { registeredAt: 'desc' },
    take: 3
  })

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8 px-4">
      {/* Header Profile */}
      <div className="bg-[#0a0a0a] rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative z-10">
          <div className="h-24 w-24 bg-accent-blue text-background text-4xl font-black rounded-full flex mx-auto md:mx-0 items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">Welcome connected, <br className="hidden md:block"/><span className="text-accent-blue">{user.name}!</span></h1>
            <p className="text-gray-400 font-medium">{user.phoneNumber}</p>
          </div>
        </div>
        <form action={logout} className="relative z-10 w-full md:w-auto">
           <button className="flex items-center gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 px-6 py-3 rounded-xl transition font-bold text-sm uppercase tracking-widest w-full justify-center border border-red-500/30">
             <LogOut size={18} /> Disconnect
           </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Nav */}
        <Link href="/events/games" className="group bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-accent-blue/50 transition flex items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="h-16 w-16 bg-white/5 text-white rounded-2xl flex items-center justify-center group-hover:bg-accent-blue group-hover:text-background transition-colors shadow-lg z-10">
             <Trophy size={28} />
          </div>
          <div className="z-10">
            <h3 className="font-bold text-xl text-white group-hover:text-accent-blue transition uppercase tracking-wide">Tournaments</h3>
            <p className="text-sm text-gray-500 font-medium">View sports & esports</p>
          </div>
        </Link>
        <Link href="/events/cultural" className="group bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-accent-blue/50 transition flex items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="h-16 w-16 bg-white/5 text-white rounded-2xl flex items-center justify-center group-hover:bg-accent-blue group-hover:text-background transition-colors shadow-lg z-10">
             <Calendar size={28} />
          </div>
          <div className="z-10">
            <h3 className="font-bold text-xl text-white group-hover:text-accent-blue transition uppercase tracking-wide">Cultural Lineup</h3>
            <p className="text-sm text-gray-500 font-medium">View fests & drama</p>
          </div>
        </Link>
        <Link href="/my-events" className="group bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-accent-blue/50 transition flex items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="h-16 w-16 bg-white/5 text-white rounded-2xl flex items-center justify-center group-hover:bg-accent-blue group-hover:text-background transition-colors shadow-lg z-10">
             <List size={28} />
          </div>
          <div className="z-10">
            <h3 className="font-bold text-xl text-white group-hover:text-accent-blue transition uppercase tracking-wide">My Passes</h3>
            <p className="text-sm text-gray-500 font-medium">Manage registrations</p>
          </div>
        </Link>
      </div>

      <div className="pt-8 border-t border-white/10">
         <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-accent-blue text-sm font-bold tracking-widest uppercase block mb-2">Your Activity</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Recent Passes</h2>
            </div>
            {myRegistrations.length > 0 && (
              <Link href="/my-events" className="text-gray-400 font-bold hover:text-white transition uppercase tracking-widest text-sm border-b border-transparent hover:border-accent-blue pb-1">View all →</Link>
            )}
         </div>
         {myRegistrations.length === 0 ? (
            <div className="bg-[#111] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                <List size={32} />
              </div>
              <p className="text-gray-400 mb-6 font-medium text-lg">You haven't secured any passes yet.</p>
              <Link href="/events/cultural" className="inline-flex bg-accent-blue text-background font-bold px-8 py-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all uppercase tracking-widest">Explore Lineup</Link>
            </div>
         ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {myRegistrations.map((reg: any) => (
                 <EventCard key={reg.id} event={reg.event} isRegistered={true} />
              ))}
            </div>
         )}
      </div>
    </div>
  )
}
