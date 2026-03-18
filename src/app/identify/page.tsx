import { identifyUser } from '@/app/actions'
import { ArrowRight } from 'lucide-react'

export default function IdentifyPage() {
  return (
    <div className="flex items-center justify-center pt-20 px-4 min-h-[70vh]">
      <div className="max-w-md w-full p-8 md:p-10 bg-[#0a0a0a] rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
        
        {/* Abstract Glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent-blue/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-accent-blue text-background font-black text-3xl flex items-center justify-center rounded-2xl mx-auto mb-6 rotate-3">
            E
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Get Connected</h1>
          <p className="text-gray-400 font-medium">Join the frequency. Enter your details, no password required.</p>
        </div>

        <form action={identifyUser} className="space-y-6 relative z-10">
          <div>
            <label htmlFor="name" className="block text-sm font-bold tracking-wide text-gray-300 mb-2 uppercase">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              required
              className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-xl focus:ring-accent-blue focus:border-accent-blue p-4 outline-none transition-all placeholder-gray-600 font-medium"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-bold tracking-wide text-gray-300 mb-2 uppercase">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              autoComplete="tel"
              pattern="[0-9]{10}"
              required
              title="10 digit mobile number"
              className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-xl focus:ring-accent-blue focus:border-accent-blue p-4 outline-none transition-all placeholder-gray-600 font-medium"
              placeholder="9876543210"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-3 py-4 px-4 border text-base font-bold text-background bg-accent-blue border-accent-blue hover:bg-blue-500 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all uppercase tracking-widest mt-8"
          >
            Plug In <ArrowRight size={20} />
          </button>
        </form>
        <p className="mt-8 text-xs text-center text-gray-500 font-medium relative z-10">
          By continuing, you agree to our Terms of Service and Privacy Policy. Session secured locally.
        </p>
      </div>
    </div>
  )
}
