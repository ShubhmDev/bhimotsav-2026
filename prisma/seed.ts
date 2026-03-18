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
      imageUrl: 'https://images.unsplash.com/photo-1518331539958-693df9ab1d19?auto=format&fit=crop&q=80',
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
      imageUrl: 'https://images.unsplash.com/photo-1560523160-59a686b24037?auto=format&fit=crop&q=80',
    },
    {
      eventName: 'Essay writing',
      category: 'Cultural',
      description: 'Solo essay writing competition.',
      eventDate: new Date('2026-04-16T10:00:00Z'),
      isTeamEvent: false,
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80',
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
