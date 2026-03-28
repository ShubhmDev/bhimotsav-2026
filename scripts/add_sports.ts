import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '')
  : undefined;

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: privateKey,
};

if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

const firestoreDB = getFirestore();

// Helper to convert IST time string to UTC Date string
// Assumes year 2026 and month April (04)
function istToUtc(day: number, timeStr: string) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  // IST is UTC + 5:30. Substract 5:30 to get UTC.
  let utcHours = hours - 5;
  let utcMinutes = minutes - 30;

  if (utcMinutes < 0) {
    utcMinutes += 60;
    utcHours -= 1;
  }
  if (utcHours < 0) {
    // This would cross the day boundary, but for April events it's fine as long as we don't cross months.
    // For simplicity with these specific dates (11th-21st), we don't need to cross days forward/back unless it's early morning.
  }

  const date = new Date(Date.UTC(2026, 3, day, utcHours, utcMinutes)); // 3 is April
  return date.toISOString();
}

const sportsEvents = [
  {
    eventName: 'Marathon',
    category: 'Games',
    eventDate: istToUtc(6, '6:00 AM'),
    description: '5km city run for fitness and fun.',
    venue: 'Hostel to Deccan corner',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  },
  {
    eventName: 'Volleyball',
    category: 'Games',
    eventDate: istToUtc(6, '4:00 PM'),
    description: 'High-energy volleyball tournament teams of 6 players.',
    venue: 'Volleyball Ground',
    isTeamEvent: true,
    minTeamSize: 6,
    maxTeamSize: 6,
  },
  {
    eventName: 'Carrom',
    category: 'Games',
    eventDate: istToUtc(6, '6:00 PM'),
    description: '2 players team competition.',
    venue: 'New building',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 2,
  },
  {
    eventName: 'Cricket',
    category: 'Games',
    eventDate: istToUtc(7, '8:00 AM'),
    description: '11 players team cricket matches.',
    venue: 'Commerzone(TBD)',
    isTeamEvent: true,
    minTeamSize: 11,
    maxTeamSize: 11,
  },
  {
    eventName: 'Chess',
    category: 'Games',
    eventDate: istToUtc(7, '6:00 PM'),
    description: 'Solo chess competition.',
    venue: 'Old building',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  },
  {
    eventName: 'Badminton',
    category: 'Games',
    eventDate: istToUtc(8, '4:00 PM'),
    description: '2 players team competition.',
    venue: 'New building',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 2,
  },
  {
    eventName: 'E-sport',
    category: 'Games',
    eventDate: istToUtc(8, '8:00 PM'),
    description: 'Solo or team e-sports tournaments.',
    venue: 'Hostel ground',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 4,
  }
];

async function updateGames() {
  console.log('Updating Games events in Firestore (IST adjusted)...');
  const eventsRef = firestoreDB.collection('events');

  // Delete all existing events in 'Games' category
  console.log('🗑️ Deleting old Games events...');
  const snapshot = await eventsRef.where('category', '==', 'Games').get();
  const batch = firestoreDB.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Add new events
  for (const event of sportsEvents) {
    const docRef = eventsRef.doc();
    await docRef.set({
      id: docRef.id,
      ...event,
      createdAt: new Date().toISOString()
    });
    console.log(`✅ Added: ${event.eventName} at ${event.eventDate}`);
  }

  console.log('Successfully updated all Games events!');
}

updateGames().catch(console.error);
