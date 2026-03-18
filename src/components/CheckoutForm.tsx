'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerEvent } from '@/app/actions'
import { CreditCard, CheckCircle, Plus, Trash2 } from 'lucide-react'

export default function CheckoutForm({ 
  eventId, 
  eventName, 
  isTeamEvent = false,
  minTeamSize = null,
  maxTeamSize = null
}: { 
  eventId: string, 
  eventName: string, 
  isTeamEvent?: boolean,
  minTeamSize?: number | null,
  maxTeamSize?: number | null
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  // Auto-initialize required teammates if it is a fixed size team
  const initialMembers = isTeamEvent && minTeamSize && minTeamSize > 1
    ? Array.from({ length: minTeamSize - 1 }).map(() => ({ name: '' }))
    : []

  const [teamMembers, setTeamMembers] = useState<{name: string}[]>(initialMembers)
  const router = useRouter()
  
  const handleAddMember = () => {
    if (maxTeamSize && teamMembers.length + 1 >= maxTeamSize) return
    setTeamMembers([...teamMembers, { name: '' }])
  }

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const updateMember = (index: number, field: 'name', value: string) => {
    const newMembers = [...teamMembers]
    newMembers[index][field] = value
    setTeamMembers(newMembers)
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // Validate min team size
    if (isTeamEvent && minTeamSize && teamMembers.length + 1 < minTeamSize) {
       alert(`Team must have at least ${minTeamSize} members.`)
       setLoading(false)
       return
    }

    const formData = new FormData(e.currentTarget)
    const phoneNumber = formData.get('phoneNumber') as string
    const teamName = isTeamEvent ? (formData.get('teamName') as string) : undefined
    const hostelName = formData.get('hostelName') as string || undefined
    
    const formattedMembers = teamMembers.map(m => ({ ...m, isCaptain: false }))

    const res = await registerEvent(eventId, {
      phoneNumber,
      teamName,
      hostelName,
      teamMembers: isTeamEvent && formattedMembers.length > 0 ? formattedMembers : undefined
    })
    
    if (res?.error) {
      alert(res.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/my-events')
        router.refresh()
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 min-h-[400px] bg-[#111] rounded-3xl border border-accent-blue/30 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
         <CheckCircle className="text-accent-blue w-24 h-24 mx-auto" />
         <div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Secured</h3>
            <p className="text-gray-400 mt-2 font-medium">Your pass has been assigned. Redirecting...</p>
         </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#111] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] pointer-events-none"></div>

      <div className="border-b border-white/10 pb-6 mb-8 relative z-10">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Checkout Details</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">Completing registration for {eventName}</p>
      </div>

      <div className="space-y-5 relative z-10">
        <div>
          <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Phone Number</label>
          <input type="tel" name="phoneNumber" required pattern="[0-9]{10}" title="10 digit mobile number" className="block w-full bg-[#0a0a0a] border border-white/10 text-white rounded-xl focus:ring-accent-blue focus:border-accent-blue p-4 outline-none transition-all placeholder-gray-700 font-medium" placeholder="9876543210" />
        </div>

        {isTeamEvent && (
          <div className="pt-8 mt-8 border-t border-white/10 space-y-8">
            <div className="space-y-2">
               <h3 className="text-xl font-bold text-white tracking-tight">Team Registration</h3>
               <p className="text-sm font-medium text-gray-400 tracking-wide">Awesome, you're registering a team! You will be assigned as the Team Captain. Let's get your squad set up.</p>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-accent-blue uppercase mb-3">Team name</label>
              <input type="text" name="teamName" required className="block w-full bg-[#0a0a0a] border border-accent-blue/30 text-white rounded-xl focus:ring-accent-blue focus:border-accent-blue p-4 outline-none transition-all placeholder-gray-700 font-medium" placeholder="Enter your team name (e.g., The Midnight Runners)" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-accent-blue uppercase mb-3">Hostel name</label>
              <input type="text" name="hostelName" required className="block w-full bg-[#0a0a0a] border border-accent-blue/30 text-white rounded-xl focus:ring-accent-blue focus:border-accent-blue p-4 outline-none transition-all placeholder-gray-700 font-medium" placeholder="Enter your hostel name (e.g., Unit 1)" />
            </div>

            <div className="space-y-5 bg-white/5 p-6 rounded-2xl border border-white/5">
               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                 <div className="space-y-1">
                   <label className="block text-xs font-bold tracking-widest text-gray-300 uppercase">Team member name</label>
                   <p className="text-xs text-gray-500 font-medium">Current roster size: {teamMembers.length + 1}</p>
                 </div>
                 {(!maxTeamSize || teamMembers.length + 1 < maxTeamSize) && (
                   <button type="button" onClick={handleAddMember} className="bg-accent-blue/10 text-accent-blue hover:bg-accent-blue hover:text-background transition-colors px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                     <Plus size={16} /> Add Teammate
                   </button>
                 )}
               </div>

               {teamMembers.map((member, index) => (
                 <div key={index} className="flex gap-4 bg-[#0a0a0a] p-5 rounded-xl items-start relative border border-white/5 group hover:border-white/10 transition-colors">
                    <div className="flex-grow space-y-4">
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Teammate {index + 1} • Full Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Jane Doe" 
                          value={member.name}
                          onChange={(e) => updateMember(index, 'name', e.target.value)}
                          className="block w-full bg-transparent border-b border-white/10 text-white focus:border-accent-blue pb-2 text-sm outline-none transition-all placeholder-gray-700" 
                        />
                      </div>
                    </div>
                    {(!minTeamSize || (index + 1) >= minTeamSize) && (
                      <button type="button" onClick={() => handleRemoveMember(index)} className="text-gray-600 hover:text-red-500 p-2 mt-6 bg-white/5 rounded-lg hover:bg-red-500/10 transition-colors" title="Remove Teammate">
                        <Trash2 size={18} />
                      </button>
                    )}
                 </div>
               ))}
               
               {isTeamEvent && minTeamSize && (teamMembers.length + 1 < minTeamSize) && (
                 <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
                   <p className="text-xs text-red-400 font-bold uppercase tracking-widest">Action Required</p>
                   <p className="text-sm font-medium text-red-300 mt-1">Please add {minTeamSize - (teamMembers.length + 1)} more squad member(s) to hit the minimum roster requirement of {minTeamSize}.</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/5 text-gray-300 p-5 rounded-2xl border border-white/10 flex justify-between items-center font-bold uppercase tracking-widest text-sm relative z-10">
         <span>Entry Pass</span>
         <span className="bg-accent-blue text-background px-3 py-1 rounded bg-opacity-100">Free</span>
      </div>

      <button disabled={loading} type="submit" className="w-full bg-accent-blue hover:bg-blue-500 text-background font-black uppercase tracking-widest py-4 mt-8 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:-translate-y-1 relative z-10">
        {loading ? 'Processing...' : 'Confirm Registration'}
      </button>
    </form>
  )
}
