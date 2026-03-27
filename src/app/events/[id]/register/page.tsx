import { firestoreDB } from '@/lib/firebase'
import { getCurrentUser } from '@/app/actions'
import { redirect } from 'next/navigation'
import CheckoutForm from '@/components/CheckoutForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EventCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/identify')

  let event: any = null
  try {
    const eventDoc = await firestoreDB.collection('events').doc(id).get()
    if (eventDoc.exists) {
       event = { id: eventDoc.id, ...eventDoc.data() }
    }
  } catch (error) {
    console.error('Failed to fetch event for registration:', error)
    return <div className="text-center p-16 text-white font-bold text-2xl">Database connection error. Please try again later.</div>
  }

  if (!event) return <div className="text-center p-16 text-white font-bold text-2xl">Event not found</div>

  // Check if already registered
  let existingRegistration = null
  try {
    const regSnap = await firestoreDB.collection('registrations')
      .where('userId', '==', user.id)
      .where('eventId', '==', event.id)
      .limit(1)
      .get()
      
    if (!regSnap.empty) {
      existingRegistration = regSnap.docs[0].data()
    }
  } catch (error) {
    console.error('Failed to check existing registration:', error)
  }

  if (existingRegistration) {
    return (
      <div className="text-center py-32 bg-[#0a0a0a] min-h-[60vh] flex flex-col items-center justify-center">
         <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">You are already registered!</h2>
         <Link href="/my-events" className="text-background bg-accent-blue hover:bg-blue-500 font-bold px-8 py-3 rounded-full transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(59,130,246,0.2)]">View My Passes</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[150px] pointer-events-none"></div>

      <Link href="javascript:history.back()" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 font-bold uppercase tracking-widest text-sm transition-colors relative z-10">
         <ArrowLeft size={16} /> Back
      </Link>
      
      <div className="grid lg:grid-cols-5 gap-12 items-start relative z-10">
         <div className="lg:col-span-2 bg-[#111] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            
            <div className="relative z-10">
              <span className="inline-block bg-accent-blue text-background text-xs font-black px-3 py-1 rounded-sm mb-6 uppercase tracking-widest">{event.category}</span>
              <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter mix-blend-screen">{event.eventName}</h1>
              <p className="text-gray-400 mb-10 leading-relaxed font-medium">{event.description}</p>
              
              <div className="space-y-4 pt-8 border-t border-white/10">
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Date</span>
                    <span className="font-bold text-white">{new Date(event.eventDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Time</span>
                    <span className="font-bold text-white">{new Date(event.eventDate).toLocaleTimeString(undefined, {timeStyle: 'short'})}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Participant</span>
                    <span className="font-bold text-white max-w-[150px] truncate text-right">{user.name}</span>
                 </div>
              </div>
            </div>
         </div>
         
         <div className="lg:col-span-3">
            <CheckoutForm 
              eventId={event.id} 
              eventName={event.eventName} 
              isTeamEvent={event.isTeamEvent}
              minTeamSize={event.minTeamSize}
              maxTeamSize={event.maxTeamSize}
            />
         </div>
      </div>
    </div>
  )
}
