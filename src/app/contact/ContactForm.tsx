'use client'

import { useState } from 'react'
import { submitContact } from '@/app/actions'
import { CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const res = await submitContact(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else if (res?.success) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center py-16 text-center space-y-4">
        <CheckCircle className="text-blue-500 w-16 h-16 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-in zoom-in" />
        <h3 className="text-3xl font-black text-white tracking-tight uppercase">Message Sent</h3>
        <p className="text-zinc-400 font-medium">Thanks for reaching out! Our team will get back to you momentarily.</p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="relative z-10 space-y-7">
      {error && <div className="text-red-400 text-sm font-medium p-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>}
      
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium text-zinc-300">
          Full name
        </label>
        <input 
          id="fullName" name="fullName" type="text" required placeholder="John Doe"
          className="w-full bg-[#18181b] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all sm:text-sm shadow-inner"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-300">
          Email Address
        </label>
        <input 
          id="email" name="email" type="email" required placeholder="support@example.com"
          className="w-full bg-[#18181b] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all sm:text-sm shadow-inner"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="hostelName" className="text-sm font-medium text-zinc-300">
          Hostel Name
        </label>
        <input 
          id="hostelName" name="hostelName" type="text" placeholder="Unit 1"
          className="w-full bg-[#18181b] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all sm:text-sm shadow-inner"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-zinc-300">
          Message
        </label>
        <textarea 
          id="message" name="message" required placeholder="Type your message here" rows={5}
          className="w-full bg-[#18181b] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all resize-none sm:text-sm shadow-inner"
        />
      </div>

      <button disabled={loading} type="submit" className="bg-[#27272a] hover:bg-[#3f3f46] text-zinc-100 font-bold px-8 py-3 rounded-lg text-sm transition-colors border border-zinc-700 shadow-lg disabled:opacity-50 tracking-wider uppercase">
        {loading ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}
