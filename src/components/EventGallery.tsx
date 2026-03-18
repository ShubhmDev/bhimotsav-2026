'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Maximize2, X, Plus } from 'lucide-react'

// Images from public/images/past/
const allImages = [
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.24 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.25 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.25 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.26 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.27 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.27 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.28 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.28 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.29 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.29 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.30 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.31 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.31 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.32 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.32 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.33 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.34 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.34 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.35 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.35 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.36 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.36 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.37 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.38 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.38 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.39 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.40 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.41 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.42 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.44 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.45 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.46 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.47 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.48 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.48 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.51 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.51 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.56 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.56 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.57 AM (1).jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.57 AM.jpeg',
  '/images/past/WhatsApp Image 2026-03-16 at 11.02.59 AM.jpeg',
]

// The first 14 will be used for the hero layout
const fittedImages = allImages.slice(0, 14)
// The center image
const centerImage = '/images/past/WhatsApp Image 2026-03-16 at 11.02.31 AM.jpeg'

export default function EventGallery() {
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImage(null)
        setShowAll(false)
      }
    }
    if (activeImage || showAll) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImage, showAll])

  return (
    <>
      <section className="w-full py-32 bg-[#e0e0e0] px-4 relative overflow-hidden min-h-[900px]">
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative w-full aspect-[16/10] md:aspect-[16/8] lg:aspect-[16/7]">
            
            {/* Center Image (Large) */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] aspect-[16/11] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-20 group cursor-pointer border-4 border-white/10"
              onClick={() => setActiveImage(centerImage)}
            >
              <Image src={centerImage} alt="Featured" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <h3 className="text-white text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.2em] drop-shadow-2xl text-center px-4 leading-tight">
                  JAYANTI <br className="md:hidden" /> 2025
                </h3>
              </div>
            </div>

            {/* Surrounding Images - Positioned relative to center */}
            {/* Top Row */}
            <GalleryItem src={fittedImages[0]} style={{ top: '0%', left: '15%', width: '10%', height: '22%' }} onClick={() => setActiveImage(fittedImages[0])} />
            <GalleryItem src={fittedImages[1]} style={{ top: '0%', left: '28%', width: '12%', height: '25%' }} onClick={() => setActiveImage(fittedImages[1])} />
            <GalleryItem src={fittedImages[2]} style={{ top: '-10%', left: '45%', width: '11%', height: '26%' }} onClick={() => setActiveImage(fittedImages[2])} />
            <GalleryItem src={fittedImages[3]} style={{ top: '0%', left: '60%', width: '12%', height: '27%' }} onClick={() => setActiveImage(fittedImages[3])} />
            <GalleryItem src={fittedImages[4]} style={{ top: '8%', left: '76%', width: '10%', height: '24%' }} onClick={() => setActiveImage(fittedImages[4])} />

            {/* Middle Sides */}
            <GalleryItem src={fittedImages[5]} style={{ top: '35%', left: '10%', width: '10%', height: '23%' }} onClick={() => setActiveImage(fittedImages[5])} />
            <GalleryItem src={fittedImages[6]} style={{ top: '65%', left: '10%', width: '10%', height: '22%' }} onClick={() => setActiveImage(fittedImages[6])} />
            
            <GalleryItem src={fittedImages[7]} style={{ top: '33%', right: '10%', width: '10%', height: '22%' }} onClick={() => setActiveImage(fittedImages[7])} />
            <GalleryItem src={fittedImages[8]} style={{ top: '64%', right: '10%', width: '10%', height: '23%' }} onClick={() => setActiveImage(fittedImages[8])} />

            {/* Bottom Row */}
            <GalleryItem src={fittedImages[9]} style={{ bottom: '-10%', left: '23%', width: '12%', height: '24%' }} onClick={() => setActiveImage(fittedImages[9])} />
            <GalleryItem src={fittedImages[10]} style={{ bottom: '-8%', left: '40%', width: '10%', height: '27%' }} onClick={() => setActiveImage(fittedImages[10])} />
            <GalleryItem src={fittedImages[11]} style={{ bottom: '-12%', left: '55%', width: '11%', height: '25%' }} onClick={() => setActiveImage(fittedImages[11])} />
            <GalleryItem src={fittedImages[12]} style={{ bottom: '-5%', left: '72%', width: '10%', height: '22%' }} onClick={() => setActiveImage(fittedImages[12])} />

            {/* Branding W. Badge */}
          </div>

          <div className="mt-40 text-center">
            <button 
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1"
            >
              See all photos <Plus size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[100] backdrop-blur-3xl bg-black/90 flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => setActiveImage(null)}
        >
          <button onClick={() => setActiveImage(null)} className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
            <X size={28} />
          </button>
          <div className="relative w-[90vw] h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={activeImage} alt="Gallery image" fill className="object-contain" priority />
          </div>
        </div>
      )}

      {/* Full Gallery Overlay */}
      {showAll && (
        <div className="fixed inset-0 z-[110] bg-[#e0e0e0] overflow-y-auto animate-in slide-in-from-bottom duration-500 pb-20">
           <div className="sticky top-0 z-20 bg-[#e0e0e0]/80 backdrop-blur-md p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
              <h2 className="text-3xl font-black uppercase">The Full Archive</h2>
              <button 
                onClick={() => setShowAll(false)}
                className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <X size={24} />
              </button>
           </div>
           
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-8">
              {allImages.map((src, idx) => (
                <div 
                  key={idx} 
                  className="aspect-[4/5] relative rounded-2xl overflow-hidden cursor-pointer group shadow-md"
                  onClick={() => setActiveImage(src)}
                >
                  <Image src={src} alt={`Archive ${idx}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              ))}
           </div>
        </div>
      )}
    </>
  )
}

function GalleryItem({ src, style, onClick }: { src: string, style: any, onClick: () => void }) {
  return (
    <div 
      className="absolute border-2 border-white/20 rounded-xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:z-30 hover:scale-105 hover:shadow-2xl" 
      style={style}
      onClick={onClick}
    >
      <Image src={src} alt="Past event" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

