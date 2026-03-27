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
    eventName: 'Carrom',
    category: 'Games',
    eventDate: istToUtc(11, '2:30 PM'),
    description: '2 players team competition.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 2,
  },
  {
    eventName: 'Chess',
    category: 'Games',
    eventDate: istToUtc(12, '3:30 PM'),
    description: 'Solo chess championship.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  },
  {
    eventName: 'Volleyball',
    category: 'Games',
    eventDate: istToUtc(12, '4:30 PM'),
    description: 'High-energy volleyball tournament. Teams of 6-12 players.',
    isTeamEvent: true,
    minTeamSize: 6,
    maxTeamSize: 12,
  },
  {
    eventName: 'ESport BGMI',
    category: 'Games',
    eventDate: istToUtc(13, '7:30 PM'),
    description: '4 players team battle royale.',
    isTeamEvent: true,
    minTeamSize: 4,
    maxTeamSize: 4,
  },
  {
    eventName: 'Badminton',
    category: 'Games',
    eventDate: istToUtc(14, '2:30 PM'),
    description: '2 players team competition.',
    isTeamEvent: true,
    minTeamSize: 2,
    maxTeamSize: 2,
  },
  {
    eventName: 'Cricket Competition',
    category: 'Games',
    eventDate: istToUtc(20, '1:30 PM'),
    description: '11 players team cricket matches.',
    isTeamEvent: true,
    minTeamSize: 11,
    maxTeamSize: 11,
  },
  {
    eventName: 'Marathon',
    category: 'Games',
    eventDate: istToUtc(21, '11:30 AM'),
    description: '5km city run for fitness and fun.',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
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
