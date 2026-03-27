import { firestoreDB } from '../src/lib/firebase';
import * as dotenv from 'dotenv';
dotenv.config();

const sampleEvents = [
  // Educational Events
  {
    eventName: "Code Quest 2026",
    description: "A fast-paced 12-hour hackathon where students build incredible real-world software solutions from scratch.",
    category: "Educational",
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: "09:00 AM",
    venue: "Main Computer Lab 1",
    isTeamEvent: true,
    maxTeamSize: 4,
    registrationFee: 200,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    eventName: "AI & Future Tech Symposium",
    description: "A brilliant guest lecture and open Q&A session discussing the impact of Large Language Models on the future of engineering.",
    category: "Educational",
    eventDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    time: "02:00 PM",
    venue: "Auditorium A",
    isTeamEvent: false,
    maxTeamSize: 1,
    registrationFee: 0,
    featured: false,
    createdAt: new Date().toISOString()
  },

  // Cultural Events
  {
    eventName: "Rhythmic Resonance (Dance Battle)",
    description: "The ultimate showdown of rhythm and style. Show off your solo or crew choreography to win the championship trophy!",
    category: "Cultural",
    eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    time: "06:00 PM",
    venue: "Open Air Theatre",
    isTeamEvent: true,
    maxTeamSize: 10,
    registrationFee: 500,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    eventName: "Canvas Chronicles",
    description: "An impromptu live painting and sketching competition. Themes will be given on the spot. Bring your own brushes!",
    category: "Cultural",
    eventDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    time: "10:30 AM",
    venue: "Art Studio",
    isTeamEvent: false,
    maxTeamSize: 1,
    registrationFee: 50,
    featured: false,
    createdAt: new Date().toISOString()
  },

  // Games Events
  {
    eventName: "Valorant Championship Series",
    description: "Join the ultimate 5v5 tactical shooter tournament. Prove your aim and strategy against the best gamers on campus.",
    category: "Games",
    eventDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    time: "11:00 AM",
    venue: "E-Sports Arena",
    isTeamEvent: true,
    maxTeamSize: 5,
    registrationFee: 250,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    eventName: "Table Tennis Singles",
    description: "A classic knockout table tennis tournament. Paddles provided, but bring your A-game.",
    category: "Games",
    eventDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
    time: "04:00 PM",
    venue: "Indoor Sports Complex",
    isTeamEvent: false,
    maxTeamSize: 1,
    registrationFee: 100,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

async function seedDatabase() {
  console.log('🌱 Starting to seed the Firestore database...');
  
  try {
    const batch = firestoreDB.batch();
    
    // Check if we already seeded to avoid duplicates
    const existing = await firestoreDB.collection('events').limit(1).get()
    if (!existing.empty) {
        console.log("⚠️ Database already has events. Clearing old events first...");
        const snapshot = await firestoreDB.collection('events').get();
        const deleteBatch = firestoreDB.batch();
        snapshot.docs.forEach(doc => deleteBatch.delete(doc.ref));
        await deleteBatch.commit();
        console.log("🗑️ Cleared old events.");
    }
    
    for (const event of sampleEvents) {
      // Create a new document reference with an auto-generated ID
      const newEventRef = firestoreDB.collection('events').doc();
      batch.set(newEventRef, event);
      console.log(`Prepared event: ${event.eventName}`);
    }

    // Commit the batch
    await batch.commit();
    console.log('✅ Seeding complete! Added', sampleEvents.length, 'events.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
