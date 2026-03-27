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

const educationalEvents = [
  {
    eventName: 'Project Competition',
    category: 'Educational',
    eventDate: istToUtc(23, '4:30 PM'),
    description: 'Showcase your innovation and technical projects.',
    isTeamEvent: true,
    minTeamSize: 1,
    maxTeamSize: 4,
  },
  {
    eventName: '12-Hour Study Challenge',
    category: 'Educational',
    eventDate: istToUtc(24, '1:30 PM'),
    description: 'A test of endurance and focus - can you study for 12 hours?',
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  }
];

async function updateEducational() {
  console.log('Updating Educational events in Firestore (IST adjusted)...');
  const eventsRef = firestoreDB.collection('events');

  // Delete all existing events in 'Educational' category
  console.log('🗑️ Deleting old Educational events...');
  const snapshot = await eventsRef.where('category', '==', 'Educational').get();
  const batch = firestoreDB.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Add new events
  for (const event of educationalEvents) {
    const docRef = eventsRef.doc();
    await docRef.set({
      id: docRef.id,
      ...event,
      createdAt: new Date().toISOString()
    });
    console.log(`✅ Added: ${event.eventName} at ${event.eventDate}`);
  }

  console.log('Successfully updated all Educational events!');
}

updateEducational().catch(console.error);
