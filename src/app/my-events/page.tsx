import { getCurrentUser, unregisterEvent } from '@/app/actions'
import { prisma } from '@/lib/db'
import { List, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import EventCard from '@/components/EventCard'

export default async function MyEventsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const myRegistrations = await prisma.registration.findMany({
    where: { userId: user.id },
    include: { event: true },
    orderBy: { event: { eventDate: 'asc' } }
  })

  // Server action to delete
  async function removeRegistration(formData: FormData) {
    'use server'
    const regId = formData.get('regId') as string
    if (regId) {
      await unregisterEvent(regId)
      revalidatePath('/my-events')
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-12 border-b border-white/10 pb-8">
        <span className="text-accent-blue text-sm font-bold tracking-widest uppercase block mb-2">Your Itinerary</span>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">My Passes</h1>
        <p className="mt-4 text-gray-400 font-medium text-lg">View and manage the events you are officially attending.</p>
      </div>

      {myRegistrations.length === 0 ? (
        <div className="bg-[#111] border border-white/5 rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500">
             <List size={40} />
           </div>
           <p className="mb-8 text-2xl font-bold text-white tracking-tight">You haven't secured any passes yet.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Link href="/events/games" className="text-gray-400 hover:text-white transition font-bold uppercase tracking-widest text-sm border-b border-white/20 hover:border-accent-blue pb-1">Explore Tournaments</Link>
             <span className="text-gray-700 hidden sm:block">|</span>
             <Link href="/events/cultural" className="text-gray-400 hover:text-white transition font-bold uppercase tracking-widest text-sm border-b border-white/20 hover:border-accent-blue pb-1">Cultural Lineup</Link>
           </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myRegistrations.map((reg: any) => (
            <div key={reg.id} className="relative group">
              <EventCard event={reg.event} isRegistered={true} />
              
              <form action={removeRegistration} className="absolute top-4 right-4 z-10">
                <input type="hidden" name="regId" value={reg.id} />
                <button 
                  type="submit" 
                  title="Cancel Registration" 
                  className="bg-black/80 backdrop-blur-md text-gray-400 hover:text-red-500 hover:bg-black p-3 rounded-full transition-all border border-white/10 shadow-lg opacity-80 md:opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110"
                >
                   <Trash2 size={20} />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
