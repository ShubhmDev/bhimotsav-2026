import { firestoreDB } from '@/lib/firebase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Download, Users } from 'lucide-react'

export default async function AdminParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'true') redirect('/admin/login')

  const eventDoc = await firestoreDB.collection('events').doc(id).get()
  const event: any = eventDoc.exists ? eventDoc.data() : null

  if (!event) return <div className="p-8 text-center text-red-500">Event not found</div>

  // Fetch registrations
  const regsSnap = await firestoreDB.collection('registrations')
     .where('eventId', '==', id)
     .get()

  // Decorate with user data avoiding multiple awaits in map
  const regs = await Promise.all(regsSnap.docs.map(async (doc) => {
     const data = doc.data()
     let user = null
     try {
       const userDoc = await firestoreDB.collection('users').doc(data.userId).get()
       user = userDoc.exists ? userDoc.data() : null
     } catch (e) {
       console.error("Failed to fetch user", data.userId)
     }
     return {
       ...data,
       user: user || { name: 'Unknown', phoneNumber: 'Unknown' },
       teamMembers: data.teamMembers || []
     }
  }))

  // Sort by registeredAt desc
  event.registrations = regs.sort((a: any, b: any) => 
     new Date(b.registeredAt || 0).getTime() - new Date(a.registeredAt || 0).getTime()
  )

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
         <div className="flex items-center gap-4">
           <Link href="/admin" className="text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition">
              <ArrowLeft size={20} />
           </Link>
           <div>
             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 flex items-center gap-2">
               Participants
             </h1>
             <p className="text-sm text-gray-500">{event.eventName} • {event.category} {event.isTeamEvent && <span className="text-blue-600 font-medium"> (Team Event)</span>}</p>
           </div>
         </div>
         <a 
           href={`/api/export/${event.id}`} 
           className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition"
         >
           <Download size={18} /> Export Excel
         </a>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant / Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{event.isTeamEvent ? 'Captain / Members' : 'Details'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {event.registrations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No participants yet.</td>
              </tr>
            )}
            {event.registrations.map((reg: any) => {
              const isTeam = event.isTeamEvent && reg.teamName

              return (
                <tr key={reg.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {isTeam ? (
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          <Users size={16} className="text-blue-500" /> {reg.teamName}
                        </div>
                        <div className="text-xs text-blue-600 font-medium mt-1">Team of {1 + reg.teamMembers.length}</div>
                      </div>
                    ) : (
                      <div className="font-medium text-gray-900">{reg.user.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium">{reg.user.phoneNumber}</div>
                    <div className="text-xs">{reg.phoneNumber || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {isTeam ? (
                      <details className="cursor-pointer">
                        <summary className="font-medium text-gray-700 select-none outline-none">View Roster</summary>
                        <div className="mt-2 pl-2 border-l-2 border-blue-200 space-y-2">
                          <div>
                            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-1 py-0.5 rounded">Capt</span> <span className="font-medium text-gray-900">{reg.user.name}</span>
                          </div>
                          {reg.teamMembers.map((member: any, i: number) => (
                            <div key={i}>
                              <span className="text-xs font-bold text-gray-500 bg-gray-50 px-1 py-0.5 rounded border">Mem</span> <span className="text-gray-700">{member.name}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    ) : (
                       <div className="text-sm text-gray-400 italic">Solo</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(reg.registeredAt).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
