import Link from 'next/link'
import EventCard from '@/components/EventCard'
import HeroSlider from '@/components/HeroSlider'
import EventGallery from '@/components/EventGallery'
import CommitteeMembers from '@/components/CommitteeMembers'
import { firestoreDB } from '@/lib/firebase'
import { getCurrentUser } from '@/app/actions'
import { revalidatePath } from 'next/cache'

export const revalidate = 60

export default async function Home() {
  const user = await getCurrentUser()
  
  // Fetch some events for the featured section
  let events: any[] = []
  try {
    const snap = await firestoreDB.collection('events')
      .orderBy('eventDate', 'asc')
      .limit(3)
      .get()
    events = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Failed to fetch featured events:', error)
  }

  // Get user registrations to pass to EventCard
  let userRegistrations: string[] = []
  if (user) {
    try {
      const regs = await firestoreDB.collection('registrations')
        .where('userId', '==', user.id)
        .get()
      userRegistrations = regs.docs.map(doc => doc.data().eventId)
    } catch (error) {
      console.error('Failed to fetch user registrations:', error)
    }
  }

  return (
    <div className="flex flex-col w-full -mt-8">
      <HeroSlider />

      {/* Featured Artists/Events Section */}
      <section className="w-full py-20 px-4">
        <div className="text-center mb-16">
          <span className="text-accent-blue text-sm font-bold tracking-widest uppercase block mb-4">Highlights</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">The Sound Architects <br/> Behind the Night</h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden border-2 border-accent-blue/30 relative group">
             <img src="/images/past/WhatsApp Image 2026-03-16 at 11.02.45 AM.jpeg" alt="Cultural Event" className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 border-4 border-accent-blue/0 group-hover:border-accent-blue/100 transition-colors duration-500 z-10 m-2"></div>
          </div>
          <div className="space-y-6">
            <h3 className="text-4xl font-bold text-white">BHIM JAYANTI 2025</h3>
            <p className="text-accent-blue font-medium">Headlining Cultural Night</p>
            <p className="text-gray-400 leading-relaxed text-lg">
              Experience the hypnotic rhythms and premiere artistry of our top featured cultural events. Join the underground movement and secure your spot on the dance floor before tickets run out.
            </p>
            <Link href="/events/cultural" className="inline-block mt-4 text-white border-b-2 border-accent-blue pb-1 font-bold hover:text-accent-blue transition-colors">
              Explore Cultural Lineup
            </Link>
          </div>
        </div>
      </section>

      {/* Shows and Tickets (Event Cards) */}
      <section id="tickets" className="w-full py-24 bg-[#0a0a0a] px-4 border-y border-white/5 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16">
            <span className="text-accent-blue text-sm font-bold tracking-widest uppercase block mb-4">Shows And Tickets</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white max-w-2xl">
              Experience the Nights — Find Your City, Book Your Spot
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                isRegistered={userRegistrations.includes(event.id)} 
              />
            ))}
          </div>
          
          {events.length === 0 && (
             <p className="text-gray-500 text-center py-10">No upcoming events scheduled at the moment.</p>
          )}

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center text-sm">
             <Link href="/events/games" className="text-gray-400 hover:text-white transition">
                Games Events →
             </Link>
             <Link href="/events/cultural" className="text-gray-400 hover:text-white transition">
                Cultural Events →
             </Link>
             <Link href="/events/educational" className="text-gray-400 hover:text-white transition">
                Educational Events →
             </Link>
          </div>
        </div>
      </section>

      <EventGallery />
      <CommitteeMembers />
    </div>
  )
}
