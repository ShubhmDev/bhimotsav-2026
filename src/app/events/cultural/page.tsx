import { firestoreDB } from '@/lib/firebase'
import EventCard from '@/components/EventCard'
import { getCurrentUser } from '@/app/actions'

export const revalidate = 60

export default async function CulturalEventsPage() {
  const user = await getCurrentUser()
  let events: any[] = []
  try {
    const eventsSnap = await firestoreDB.collection('events')
       .where('category', '==', 'Cultural')
       .orderBy('eventDate', 'asc')
       .get()

    events = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Failed to fetch cultural events:', error)
  }

  // Get user's registrations to determine if they already registered
  let userRegistrations: any[] = []
  if (user) {
    try {
      const regSnap = await firestoreDB.collection('registrations')
         .where('userId', '==', user.id)
         .get()
      userRegistrations = regSnap.docs.map(doc => doc.data())
    } catch (error) {
      console.error('Failed to fetch user registrations for cultural events:', error)
    }
  }
    
  const registeredEventIds = new Set(userRegistrations.map((r: any) => r.eventId))

  return (
    <div className="flex flex-col w-full -mt-8">
      {/* Category Hero */}
      <section className="relative w-full pt-40 pb-32 mb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/cultural.png" alt="Cultural Events" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-accent-blue text-sm font-bold tracking-widest uppercase block mb-4">Live Performances</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mix-blend-screen">
            Cultural Lineup
          </h1>
          <p className="mt-6 text-xl text-gray-300 font-medium">
            Immerse yourself in artistic expression, hypnotic rhythms, and unforgettable theatricals.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event: any, index: number) => (
            <EventCard 
              key={event.id} 
              event={event} 
              isRegistered={registeredEventIds.has(event.id)} 
              priority={index < 3}
            />
          ))}
        </div>
        
        {events.length === 0 && (
           <div className="text-center py-32 text-gray-400 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-2">The stage is empty</h3>
              <p>Check back later for new cultural lineup announcements.</p>
           </div>
        )}
      </div>
    </div>
  )
}
