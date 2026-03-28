'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

export default function EventCard({ event, isRegistered }: { event: any, isRegistered: boolean }) {
  const eventDateObj = event.eventDate ? new Date(event.eventDate) : null
  const isValidDate = eventDateObj && !isNaN(eventDateObj.getTime())
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dateStr = isValidDate 
    ? `${monthNames[eventDateObj.getMonth()]} ${eventDateObj.getDate()}${getOrdinalSuffix(eventDateObj.getDate())}`
    : 'Date TBD'
  
  const timeStr = isValidDate 
    ? eventDateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : 'Time TBD'

  const getEventImage = () => {
    if (event.imageUrl) return event.imageUrl;

    const name = (event.eventName || '').toLowerCase();
    const cat = (event.category || '').toLowerCase();

    if (name.includes('cricket')) return 'https://cdn.pixabay.com/photo/2020/06/28/10/56/cricket-5348883_1280.jpg?w=800&q=80';
    if (name.includes('carrom')) return 'https://cdn.pixabay.com/photo/2014/07/11/23/14/carrom-390835_1280.jpg?w=800&q=80';
    if (name.includes('chess')) return 'https://cdn.pixabay.com/photo/2015/12/07/10/40/strategy-1080528_1280.jpg?w=800&q=80';
    if (name.includes('badminton')) return 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&q=80';
    if (name.includes('volleyball')) return 'https://cdn.pixabay.com/photo/2013/05/02/21/23/basketball-108622_1280.jpg?w=800&q=80';
    if (name.includes('esport')) return 'https://cdn.pixabay.com/photo/2020/01/04/11/15/game-play-4740277_1280.jpg?w=800&q=80';
    if (name.includes('marathon')) return 'https://cdn.pixabay.com/photo/2021/09/27/10/02/marathon-6660180_1280.jpg?w=800&q=80';

    if (cat.includes('cultural') || name.includes('debate') || name.includes('music') || name.includes('essay') || name.includes('quiz') || name.includes('funny') || name.includes('speech') || name.includes('drama')) {
      if (name.includes('debate')) return 'https://images.unsplash.com/photo-1679833645645-e262e042f532?q=80&w=1082&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      if (name.includes('fashion') || name.includes('ramp')) return 'https://cdn.pixabay.com/photo/2016/11/19/20/17/catwalk-1840941_1280.jpg?w=800&q=80';
      if (name.includes('drama') || name.includes('play') || name.includes('theater')) return 'https://cdn.pixabay.com/photo/2017/04/10/22/27/audience-2219414_1280.jpg?w=800&q=80';
      if (name.includes('quiz')) return 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80';
      if (name.includes('essay')) return 'https://images.unsplash.com/photo-1630032866155-f87ec4d047bd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800&q=80';
      if (name.includes('funny')) return 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?w=800&q=80';
      if (name.includes('speech')) return 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1920&q=75';
      if (name.includes('drama')) return 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf%3Fauto%3Dformat%26fit%3Dcrop%26q%3D80&w=1920&q=75?w=800&q=80';
      return 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80';
    }

    if (cat.includes('educational') || name.includes('project') || name.includes('12-Hour') || name.includes('Study') || name.includes('tech')) {
      if (name.includes('project') || name.includes('hackathon') || name.includes('program')) return 'https://cdn.pixabay.com/photo/2024/01/10/16/20/woman-8499928_1280.jpg?w=800&q=80';

      if (name.includes('12-Hourp') || name.includes('Study') || name.includes('lecture')) return 'https://cdn.pixabay.com/photo/2013/04/19/01/15/university-105709_1280.jpg?w=800&q=80';
      return 'https://cdn.pixabay.com/photo/2013/04/19/01/15/university-105709_1280.jpg?w=800&q=80';
    }

    return `https://picsum.photos/seed/${event.id}/800/600`;
  };

  const displayImage = getEventImage();

  const [imgSrc, setImgSrc] = useState(displayImage);

  useEffect(() => {
    setImgSrc(displayImage);
  }, [displayImage]);

  function getOrdinalSuffix(n: number) {
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return (s[(v - 20) % 10] || s[v] || s[0])
  }

  return (
    <div className="bg-[#f2efe4] rounded-3xl p-4 flex flex-col h-full shadow-xl transition-transform hover:-translate-y-2 relative border border-white/20">

      {/* Image Header */}
      <div className="relative h-48 w-full bg-gray-800 rounded-2xl mb-6 overflow-hidden shadow-inner"> {/* Adjusted div classes and height */}
        <Image
          src={imgSrc}
          alt={event.eventName}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          onError={() => setImgSrc(`https://picsum.photos/seed/${event.id}/800/600`)}
        />
      </div>

      <div className="px-2 flex flex-col items-center text-center flex-grow">
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{event.eventName}</h3>
        <p suppressHydrationWarning className="text-gray-800 font-semibold mb-3">{dateStr}</p>

        <p className="text-gray-500 text-xs px-4 mb-3 line-clamp-2 min-h-8">
          {event.category} • {event.description}
        </p>

        <p suppressHydrationWarning className="font-bold text-gray-900 text-sm mb-2">Starts {timeStr}</p>

        {event.venue && (
          <div className="flex items-center gap-1 text-gray-600 text-xs mb-4">
             <MapPin size={14} className="text-blue-500" />
             <span className="font-medium">{event.venue}</span>
          </div>
        )}

        {/* <div className="bg-accent-blue text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full mb-8">
           Entry Price: Free
        </div> */}

      </div>

      <div className="px-2 mt-auto pb-2">
        {isRegistered ? (
          <button disabled className="w-full text-center text-green-700 font-bold py-3 uppercase tracking-widest text-sm border-t border-gray-300 opacity-60">
            REGISTERED ✓
          </button>
        ) : (
          <Link
            href={`/events/${event.id}/register`}
            className="bg-blue-500 w-full block text-center text-gray-900 hover:text-white rounded-full font-bold py-3 uppercase tracking-widest text-sm border-t border-gray-300 transition-colors"
          >
            REGISTER NOW
          </Link>
        )}
      </div>
    </div>
  )
}
