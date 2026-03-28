import { firestoreDB } from '@/lib/firebase'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { updateEvent } from '../../../actions'
import Link from 'next/link'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'true') redirect('/admin/login')

  const doc = await firestoreDB.collection('events').doc(id).get()
  if (!doc.exists) notFound()

  const event = { id: doc.id, ...doc.data() } as any

  // Format date for datetime-local input (YYYY-MM-DDThh:mm)
  const date = new Date(event.eventDate)
  const formattedDate = date.toISOString().slice(0, 16)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Event: {event.eventName}</h1>
        <Link href="/admin" className="text-gray-500 hover:text-gray-900">Cancel</Link>
      </div>

      <div className="bg-white p-6 md:p-8 border rounded-xl shadow-sm">
        <form action={updateEvent.bind(null, id)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input 
              type="text" 
              name="eventName" 
              defaultValue={event.eventName}
              required 
              className="block w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              name="category" 
              defaultValue={event.category}
              required 
              className="block w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Games">Games</option>
              <option value="Cultural">Cultural</option>
              <option value="Educational">Educational</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              defaultValue={event.description}
              required 
              rows={4} 
              className="block w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
            <input 
              type="datetime-local" 
              name="eventDate" 
              defaultValue={formattedDate}
              required 
              className="block w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <input 
              type="text" 
              name="venue" 
              defaultValue={event.venue || ''}
              className="block w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="e.g. Campus Amphitheater" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
            <input 
              type="url" 
              name="imageUrl" 
              defaultValue={event.imageUrl || ''}
              className="block w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-bold text-black-900 mb-4">Team Rules (Optional)</h3>
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="isTeamEvent" 
                name="isTeamEvent" 
                defaultChecked={event.isTeamEvent}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label htmlFor="isTeamEvent" className="ml-2 block text-sm text-gray-900 font-medium">
                This is a Team Event
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Team Size</label>
                <input 
                  type="number" 
                  min="1" 
                  name="minTeamSize" 
                  defaultValue={event.minTeamSize || ''}
                  className="block w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Team Size</label>
                <input 
                  type="number" 
                  min="1" 
                  name="maxTeamSize" 
                  defaultValue={event.maxTeamSize || ''}
                  className="block w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-700 transition mt-6">
            Update Event
          </button>
        </form>
      </div>
    </div>
  )
}
