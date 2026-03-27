'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Instagram, Twitter, PlayCircle } from 'lucide-react'

interface GalleryItemData {
  id: number;
  src: string;
  title?: string;
  subtitle?: string;
  color?: string;
  icon?: 'instagram' | 'x' | 'shorts';
  span?: string;
  type?: 'image' | 'text' | 'social';
}

const galleryItems: GalleryItemData[] = [
  {
    id: 1,
    src: '/images/past/WhatsApp Image 2026-03-16 at 11.02.24 AM.jpeg',
    span: 'md:col-span-2 md:row-span-2',
    type: 'social'
  },
  {
    id: 2,
    src: '',
    title: 'Signs That Changes The World',
    color: 'bg-blue-100',
    type: 'text'
  },
  {
    id: 3,
    src: '/images/past/WhatsApp Image 2026-03-16 at 11.02.25 AM.jpeg',
    type: 'image'
  },
  {
    id: 4,
    src: '/images/past/WhatsApp Image 2026-03-16 at 11.02.32 AM.jpeg',
    title: 'Dive into Culture Activities',
    span: 'md:row-span-2',
    type: 'image'
  },
  {
    id: 5,
    src: '',
    title: 'Featured Media Stories',
    color: 'bg-yellow-100',
    type: 'text'
  },
  {
    id: 6,
    src: '/images/past/WhatsApp Image 2026-03-16 at 11.02.35 AM.jpeg',
    title: 'Highlights',
    span: 'md:row-span-2',
    type: 'social'
  },
  {
    id: 7,
    src: '/images/past/WhatsApp Image 2026-03-16 at 11.02.57 AM.jpeg',
    color: 'bg-emerald-500',
    span: 'md:row-span-2',
    type: 'social'
  },
];

export default function EventGallery() {
  const [activeImage, setActiveImage] = useState<string | null>(null)

  return (
    <section className="w-full py-24 bg-gray-50 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-6xl sm:text-7xl md:text-9xl font-black text-black tracking-tighter leading-none mb-6">BHIM JAYANTI 2K25</h2>
          <p className="text-gray-600 ml-5 max-w-sm text-lg font-medium leading-relaxed">
            The pulse of our story, told one post at a time.
          </p>
        </div>

        {/* Grid - Refined Masonry-like Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]">
          {galleryItems.map((item, index) => {
            // Assign specific spans for a masonry feel
            let span = item.span || '';
            if (index === 0) span = 'lg:col-span-2 lg:row-span-2';
            if (index === 3 || index === 5 || index === 6) span = 'lg:row-span-2';
            
            return (
              <GalleryCard 
                key={item.id} 
                item={{...item, span}} 
                onClick={() => item.src && setActiveImage(item.src)} 
              />
            );
          })}
        </div>

        {/* See More Button - Navigates to /gallery */}
        <div className="mt-20 text-center">
          <Link 
            href="/gallery"
            className="inline-flex flex-col items-center gap-4 group transition-all"
          >
            <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center lg:group-hover:bg-black lg:group-hover:text-white transition-all duration-300 shadow-xl text-black">
              <Plus size={36} />
            </div>
            <span className="font-bold uppercase tracking-[0.2em] text-xs text-black transition-colors group-hover:text-gray-600">Explore All Memories</span>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[100] backdrop-blur-xl bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <button onClick={() => setActiveImage(null)} className="absolute top-6 right-6 p-2 bg-white text-black rounded-full shadow-2xl">
            <X size={24} />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={activeImage} alt="Gallery item" fill className="object-contain" priority />
          </div>
        </div>
      )}
    </section>
  )
}

function GalleryCard({ item, onClick }: { item: GalleryItemData, onClick: () => void }) {
  const baseClasses = `relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[0.98] ${item.span || ''}`;
  
  if (item.type === 'text') {
    return (
      <div className={`${baseClasses} ${item.color || 'bg-gray-100'} p-8 flex flex-col justify-between`} onClick={onClick}>
        <div className="w-8 h-8 rounded-full border-2 border-black/10"></div>
        <h3 className="text-2xl font-bold text-black/80 leading-tight">{item.title}</h3>
      </div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {item.src && (
        <Image 
          src={item.src} 
          alt={item.title || 'Gallery image'} 
          fill 
          className="object-cover"
        />
      )}
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {item.title && (
        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
           {item.icon === 'instagram' && <Instagram className="text-white mb-3" size={28} />}
           {item.icon === 'x' && <Twitter className="text-white mb-3" size={28} />}
           {item.icon === 'shorts' && <PlayCircle className="text-white mb-3" size={28} />}
           <h3 className="text-white font-bold text-xl leading-snug tracking-tight">{item.title}</h3>
        </div>
      )}

      {!item.title && item.icon && (
        <div className="absolute top-8 left-8">
           {item.icon === 'instagram' && <Instagram className="text-white" size={32} strokeWidth={1.5} />}
        </div>
      )}
    </div>
  );
}
