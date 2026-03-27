import { firestoreDB } from '@/lib/firebase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Users, Trash2 } from 'lucide-react'
import { deleteEvent } from './actions'

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'true') redirect('/admin/login')

  let events: any[] = []
  try {
    const snap = await firestoreDB.collection('events').orderBy('eventDate', 'desc').get()
    
    events = await Promise.all(snap.docs.map(async doc => {
       const data = doc.data()
       // Count aggregations query
       const countQuery = await firestoreDB.collection('registrations').where('eventId', '==', doc.id).count().get()
       return {
         id: doc.id,
         ...data,
         _count: {
            registrations: countQuery.data().count
         }
       }
    }))
  } catch (error) {
    console.error('Failed to fetch admin events:', error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <Link href="/admin/events/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm transition">
           <Plus size={18} /> Add Event
        </Link>
      </div>
      
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No events found. Create one!</td>
              </tr>
            )}
            {events.map((event: any) => (
              <tr key={event.id} className="hover:bg-gray-50 transition group">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{event.eventName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-black bg-blue-50 text-blue-700 rounded-full">{event.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(event.eventDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/admin/events/${event.id}/participants`} className="flex w-fit items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-blue-700 transition font-medium">
                     <Users size={16} /> {event._count.registrations}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* .bind approach to pass args to action without inline function */}
                  <form action={deleteEvent.bind(null, event.id)}>
                    <button type="submit" className="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50" title="Delete Event">
                       <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
