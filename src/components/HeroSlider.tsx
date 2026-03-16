'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type HeroSlide = {
  era: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  imageUrl: string
}

const slides: HeroSlide[] = [
  {
    era: 'Past Moments',
    title: 'Where Legends Took The Stage',
    description:
      'Relive the thunder of packed crowds, neon lights, and unforgettable festival performances from last season.',
    ctaLabel: 'View Highlights',
    ctaHref: '/events/cultural',
    imageUrl:
      'https://raw.githubusercontent.com/shrinivaskumari/TalkChain/main/en_cr.jpeg',
  },
  {
    era: 'Live This Week',
    title: 'Campus Alive: Beats, Games, Applause',
    description:
      'From stage shows to sports battles, the festival energy is peaking right now. Pick your event and join the crowd.',
    ctaLabel: 'Register Now',
    ctaHref: '#tickets',
    imageUrl:
      'https://raw.githubusercontent.com/shrinivaskumari/TalkChain/main/past%20event.jpeg',
  },
  {
    era: 'Upcoming',
    title: 'Next Up: Bigger Nights, Wilder Vibes',
    description:
      'Explore upcoming cultural showcases, sports finals, and celebration nights crafted for an electric college festival season.',
    ctaLabel: 'Explore Events',
    ctaHref: '/events/games',
    imageUrl:
      'https://raw.githubusercontent.com/shrinivaskumari/TalkChain/main/p1.jpeg',
  },
]

const AUTOPLAY_DELAY = 5500

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = useMemo(() => slides[activeIndex], [activeIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, AUTOPLAY_DELAY)

    return () => clearInterval(timer)
  }, [])

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="relative w-full min-h-[78vh] overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(250,204,21,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.18),transparent_40%)]" />

      <div className="relative z-10 mx-auto flex min-h-[78vh] w-full max-w-7xl items-center px-4 pb-20 pt-32 sm:px-6 lg:px-10">
        <div key={activeSlide.title} className="max-w-3xl animate-[fadeIn_700ms_ease-out]">
          <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
            {activeSlide.era}
          </p>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {activeSlide.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/85 sm:text-lg">
            {activeSlide.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={activeSlide.ctaHref}
              className="rounded-full bg-accent-yellow px-8 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:scale-105 hover:bg-yellow-400"
            >
              {activeSlide.ctaLabel}
            </Link>
            <Link
              href="/identify"
              className="rounded-full border border-white/50 bg-white/10 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Get Festival Pass
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={goPrev}
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:scale-105 hover:bg-black/50"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={goNext}
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:scale-105 hover:bg-black/50"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to ${slide.era} slide`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex
                ? 'w-10 bg-accent-yellow'
                : 'w-2.5 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}