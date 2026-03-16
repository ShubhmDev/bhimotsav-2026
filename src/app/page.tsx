import Link from 'next/link'
import EventCard from '@/components/EventCard'
import HeroSlider from '@/components/HeroSlider'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/app/actions'
import { Mail, Phone, MapPin } from 'lucide-react'

export default async function Home() {
  const user = await getCurrentUser()
  
  // Fetch some events for the featured section
  const events = await prisma.event.findMany({
    take: 3,
    orderBy: { eventDate: 'asc' }
  })

  // Get user registrations to pass to EventCard
  let userRegistrations: string[] = []
  if (user) {
    const regs = await prisma.registration.findMany({
      where: { userId: user.id },
      select: { eventId: true }
    })
    userRegistrations = regs.map(r => r.eventId)
  }

  return (
    <div className="flex flex-col w-full -mt-8">
      <HeroSlider />

      {/* Featured Artists/Events Section */}
      <section className="w-full py-20 px-4">
        <div className="text-center mb-16">
          <span className="text-accent-yellow text-sm font-bold tracking-widest uppercase block mb-4">Highlights</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">The Sound Architects <br/> Behind the Night</h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden border-2 border-accent-yellow/30 relative group">
             <img src="/cultural.png" alt="Cultural Event" className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 border-4 border-accent-yellow/0 group-hover:border-accent-yellow/100 transition-colors duration-500 z-10 m-2"></div>
          </div>
          <div className="space-y-6">
            <h3 className="text-4xl font-bold text-white">Richie Hawtin</h3>
            <p className="text-accent-yellow font-medium">Headlining Cultural Night</p>
            <p className="text-gray-400 leading-relaxed text-lg">
              Experience the hypnotic rhythms and premiere artistry of our top featured cultural events. Join the underground movement and secure your spot on the dance floor before tickets run out.
            </p>
            <Link href="/events/cultural" className="inline-block mt-4 text-white border-b-2 border-accent-yellow pb-1 font-bold hover:text-accent-yellow transition-colors">
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
            <span className="text-accent-yellow text-sm font-bold tracking-widest uppercase block mb-4">Shows And Tickets</span>
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

          <div className="mt-16 text-center">
             <Link href="/events/games" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                View All Events →
             </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-blue-600 text-sm font-bold tracking-widest uppercase block mb-4">Contact Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">We would love to <br/> talk to you</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <div className="flex items-center gap-3 text-gray-400 mb-3">
                  <Mail size={20} />
                  <span className="font-semibold text-gray-900">Email</span>
                </div>
                <a href="mailto:contact@eventhub.com" className="text-gray-600 hover:text-blue-600 transition">contact@eventhub.com</a>
              </div>
              <div>
                <div className="flex items-center gap-3 text-gray-400 mb-3">
                  <Phone size={20} />
                  <span className="font-semibold text-gray-900">Phone</span>
                </div>
                <a href="tel:+1234567890" className="text-gray-600 hover:text-blue-600 transition">+1 (800) 123-4567</a>
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center gap-3 text-gray-400 mb-3">
                  <MapPin size={20} />
                  <span className="font-semibold text-gray-900">Headquarters</span>
                </div>
                <p className="text-gray-600 leading-relaxed max-w-xs">
                  125 Monroe Str.<br/>
                  Bldg. 125<br/>
                  Sydney, Australia
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
            <form className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Your Name *</label>
                <input type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Enter First Name" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Email address</label>
                <input type="email" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="you@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <input type="tel" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Your message</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none" placeholder="How can we help?" required></textarea>
              </div>
              <button type="submit" className="bg-accent-yellow hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-full transition-transform hover:-translate-y-1 shadow-md w-max inline-flex items-center gap-2">
                Submit →
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
