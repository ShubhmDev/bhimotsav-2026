'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navigation({ user }: { user: { name: string, phoneNumber: string } | null }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/events/games', label: 'Games' },
    { href: '/events/cultural', label: 'Cultural' },
    { href: '/events/educational', label: 'Educational' },
    { href: '/my-events', label: 'My Events' },
    { href: '/contact', label: 'Contact' },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={120} 
                height={30} 
                className="w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-accent-blue'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
               <>
                 <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition">
                    Dashboard
                 </Link>
                 <div className="h-10 w-10 rounded-full bg-accent-blue flex items-center justify-center text-background font-bold shadow-lg shadow-accent-blue/20">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
               </>
            ) : (
              <Link
                href="/identify"
                className="bg-accent-blue hover:bg-blue-500 text-background px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-md"
              >
                Get Tickets
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-white/10 absolute w-full left-0 top-20 shadow-2xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-3 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? 'bg-white/5 text-accent-blue'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-white/10">
              {user ? (
                <div className="flex items-center gap-4 px-3 py-2">
                  <div className="h-12 w-12 rounded-full bg-accent-blue flex items-center justify-center text-background font-bold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.phoneNumber}</div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/identify"
                  className="block w-full text-center bg-accent-blue hover:bg-blue-500 text-background font-bold px-4 py-3 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  Get Tickets
                </Link>
              )}
            </div>
            
            {user && (
               <Link
                 href="/dashboard"
                 className="block px-3 py-3 mt-2 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                 onClick={() => setIsOpen(false)}
               >
                  Dashboard
               </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
