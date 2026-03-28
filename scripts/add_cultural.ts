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
  
  // Create date (month 3 is April)
  const date = new Date(Date.UTC(2026, 3, day, utcHours, utcMinutes));
  return date.toISOString();
}

const culturalEvents = [
  {
    eventName: 'Musical chair',
    category: 'Cultural',
    eventDate: istToUtc(10, '8:00 PM'),
    description: 'Solo musical chairs competition.',
    venue: 'Hostel ground',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  },
  {
    eventName: 'Speech competition',
    category: 'Cultural',
    eventDate: istToUtc(11, '4:00 PM'),
    description: 'Solo speech delivery contest.',
    venue: 'On the stage',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  },
  {
    eventName: 'Fancy dress competition',
    category: 'Cultural',
    eventDate: istToUtc(11, '6:00 PM'),
    description: 'Theme: Historical figures, Political figures.',
    venue: 'On the stage',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  },
  {
    eventName: 'Drama',
    category: 'Cultural',
    eventDate: istToUtc(11, '8:00 PM'),
    description: 'Live theatrical performances and skits.',
    venue: 'On the stage',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  },
  {
    eventName: 'Essay writing',
    category: 'Cultural',
    eventDate: istToUtc(8, '6:00 PM'),
    description: 'Solo essay writing competition.',
    venue: 'Old building',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  },
  {
    eventName: 'Quiz competition',
    category: 'Cultural',
    eventDate: istToUtc(10, '6:00 PM'),
    description: 'Solo quiz competition testing knowledge.',
    venue: 'Old building',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  },
  {
    eventName: 'Debate competition',
    category: 'Cultural',
    eventDate: istToUtc(9, '6:00 PM'),
    description: 'Solo debate competition.',
    venue: 'Old building',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  }
];

async function updateCultural() {
  console.log('Updating Cultural events in Firestore (IST adjusted)...');
  const eventsRef = firestoreDB.collection('events');

  // Delete all existing events in 'Cultural' category
  console.log('🗑️ Deleting old Cultural events...');
  const snapshot = await eventsRef.where('category', '==', 'Cultural').get();
  const batch = firestoreDB.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Add new events
  for (const event of culturalEvents) {
    const docRef = eventsRef.doc();
    await docRef.set({
      id: docRef.id,
      ...event,
      createdAt: new Date().toISOString()
    });
    console.log(`✅ Added: ${event.eventName} at ${event.eventDate}`);
  }

  console.log('Successfully updated all Cultural events!');
}

updateCultural().catch(console.error);
