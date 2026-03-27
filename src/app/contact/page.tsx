import { Mail } from "lucide-react";
import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with us.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 py-24 sm:py-32 w-full font-sans">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Section */}
        <div className="flex flex-col justify-start">
          <div className="w-12 h-12 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <Mail className="w-6 h-6 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">Contact us</h1>
          
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-md">
            We are always looking for ways to improve our products and services. Contact us and let us know how we can help you.
          </p>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400 mb-16">
            <a href="mailto:contact@yoursaas.ai" className="hover:text-zinc-200 transition-colors">contact@yoursaas.ai</a>
            <span className="text-zinc-600 px-1">•</span>
            <span className="hover:text-zinc-200 transition-colors">+91 8530469718</span>
            <span className="text-zinc-600 px-1">•</span>
            <a href="mailto:support@yoursaas.ai" className="hover:text-zinc-200 transition-colors">support@yoursaas.ai</a>
          </div>

          {/* Abstract Map Area */}
          <div className="relative w-full aspect-[4/3] max-w-md bg-transparent rounded-lg overflow-hidden flex items-center justify-center mt-auto">
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiM2NjYiLz48L3N2Zz4=')] bg-[length:12px_12px] mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none"></div>
            
            {/* World Map SVG Paths approximation */}
            <svg viewBox="0 0 1000 500" className="w-[120%] h-auto opacity-30 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
                <path d="M 200,100 Q 250,50 300,100 T 400,120 T 500,80 T 600,150 T 700,100 T 800,160 Q 850,200 800,250 T 650,300 T 500,350 T 350,280 T 250,250 T 150,200 Q 100,150 200,100 Z" fill="none" stroke="#444" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 300,150 Q 350,180 400,140 T 450,200 T 380,250 T 300,220 Z" fill="none" stroke="#555" strokeWidth="1" />
                <path d="M 600,200 Q 650,220 620,280 T 550,260 Z" fill="none" stroke="#444" strokeWidth="1" />
            </svg>

            {/* Glowing Pin */}
            <div className="absolute top-[45%] left-[55%] flex flex-col items-center">
              <div className="relative">
                {/* Ping animation effect */}
                <div className="absolute inline-flex h-3 w-3 rounded-full bg-blue-500 opacity-75 animate-ping -left-1.5 -top-1.5 duration-1000"></div>
                <div className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400"></div>
                
                {/* Pin Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-xs px-3 py-1.5 rounded-full text-zinc-300 whitespace-nowrap shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-sm shadow-blue-900/20">
                  Samajh Kalyan, Vishrantwadi, Pune
                </div>
                {/* Connecting Line */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-gradient-to-t from-blue-500 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section Form */}
        <div className="bg-[#121214]/50 border border-zinc-900/80 rounded-3xl p-8 sm:p-10 relative overflow-hidden backdrop-blur-sm shadow-2xl">
          {/* Subtle Grid Background for Form */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0zOSAzOVYwaC0xdjM5SDB2MWgzOXoiIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4yNCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)] opacity-30 pointer-events-none"></div>
          
          <ContactForm />
        </div>

      </div>
    </div>
  );
}
