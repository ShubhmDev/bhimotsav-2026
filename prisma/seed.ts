import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing existing data...')
  await prisma.registration.deleteMany()
  await prisma.teamMember.deleteMany() // Just in case, though handled by cascade
  await prisma.event.deleteMany()

  console.log('Seeding new events...')

  const events = [
    // Games
    {
      eventName: 'Volleyball',
      category: 'Games',
      description: '6 players team competition.',
      eventDate: new Date('2026-04-10T09:00:00Z'),
      isTeamEvent: true,
      minTeamSize: 6,
      maxTeamSize: 6,
      imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80',
    },
    {
      eventName: 'Carrom',
      category: 'Games',
      description: '2 players team competition.',
      eventDate: new Date('2026-04-11T10:00:00Z'),
      isTeamEvent: true,
      minTeamSize: 2,
      maxTeamSize: 2,
      imageUrl: 'https://images.unsplash.com/photo-1767619834318-63184920c4b1?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      eventName: 'Chess',
      category: 'Games',
      description: 'Solo chess championship.',
      eventDate: new Date('2026-04-12T11:00:00Z'),
      isTeamEvent: false,
      imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80',
    },
    {
      eventName: 'ESport BGMI',
      category: 'Games',
      description: '4 players team battle royale.',
      eventDate: new Date('2026-04-13T14:00:00Z'),
      isTeamEvent: true,
      minTeamSize: 4,
      maxTeamSize: 4,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
    },
    {
      eventName: 'Badminton',
      category: 'Games',
      description: '2 players team competition.',
      eventDate: new Date('2026-04-14T09:00:00Z'),
      isTeamEvent: true,
      minTeamSize: 2,
      maxTeamSize: 2,
      imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80',
    },
    // Cultural
    {
      eventName: 'Debate competition',
      category: 'Cultural',
      description: 'Solo debate competition.',
      eventDate: new Date('2026-04-15T15:00:00Z'),
      isTeamEvent: false,
      imageUrl: 'https://images.unsplash.com/photo-1679833645645-e262e042f532?q=80&w=1082&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      eventName: 'Essay writing',
      category: 'Cultural',
      description: 'Solo essay writing competition.',
      eventDate: new Date('2026-04-16T10:00:00Z'),
      isTeamEvent: false,
      imageUrl: 'https://images.unsplash.com/photo-1630032866155-f87ec4d047bd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      eventName: 'Quiz competition',
      category: 'Cultural',
      description: 'Solo quiz competition testing knowledge.',
      eventDate: new Date('2026-04-17T14:00:00Z'),
      isTeamEvent: false,
      imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80',
    },
    {
      eventName: 'Funny games sangeet khurchi',
      category: 'Cultural',
      description: 'Solo musical chairs competition.',
      eventDate: new Date('2026-04-18T16:00:00Z'),
      isTeamEvent: false,
      imageUrl: 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?auto=format&fit=crop&q=80',
    },
    {
      eventName: 'Speech competition',
      category: 'Cultural',
      description: 'Solo speech delivery contest.',
      eventDate: new Date('2026-04-19T11:00:00Z'),
      isTeamEvent: false,
      imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80',
    },
    // New Events
    {
      eventName: 'Cricket Competition',
      category: 'Games',
      description: '11 players team cricket matches.',
      eventDate: new Date('2026-04-20T08:00:00Z'),
      isTeamEvent: true,
      minTeamSize: 11,
      maxTeamSize: 11,
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80',
    },
    {
      eventName: 'Marathon',
      category: 'Games',
      description: '5km city run for fitness and fun.',
      eventDate: new Date('2026-04-21T06:00:00Z'),
      isTeamEvent: false,
      imageUrl: 'https://images.unsplash.com/photo-1530549387074-d5619b114457?auto=format&fit=crop&q=80',
    },

    {
      eventName: 'Project Competition',
      category: 'Educational',
      description: 'Showcase your innovation and technical projects.',
      eventDate: new Date('2026-04-23T11:00:00Z'),
      isTeamEvent: true,
      minTeamSize: 1,
      maxTeamSize: 4,
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
    },
    {
      eventName: '12-Hour Study Challenge',
      category: 'Educational',
      description: 'A test of endurance and focus - can you study for 12 hours?',
      eventDate: new Date('2026-04-24T08:00:00Z'),
      isTeamEvent: false,
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
    },
    {
      eventName: 'Drama',
      category: 'Cultural',
      description: 'Live theatrical performances and skits.',
      eventDate: new Date('2026-04-25T18:00:00Z'),
      isTeamEvent: true,
      minTeamSize: 2,
      maxTeamSize: 15,
      imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80',
    },
    {
      eventName: 'Fashion Show',
      category: 'Cultural',
      description: 'Theme: Historical figures, Political figures.',
      eventDate: new Date('2026-04-26T19:00:00Z'),
      isTeamEvent: true,
      minTeamSize: 1,
      maxTeamSize: 10,
      imageUrl: '/images/85679884.jpg',
    }
  ]

  for (const ev of events) {
    await prisma.event.create({
      data: ev
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
