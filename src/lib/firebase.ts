import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Validate that environment variables are present to avoid silent failures
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.warn("Firebase environment variables are missing. Firestore will fail to initialize correctly.");
}

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Handle newlines and accidental double quotes in the private key string from env vars
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
};

export const customInitApp = () => {
  if (getApps().length <= 0) {
    if (firebaseConfig.projectId && firebaseConfig.privateKey) {
       initializeApp({
         credential: cert(firebaseConfig),
       });
    } else {
       // Fallback for development if no cert is provided, but throws if requested
       initializeApp();
    }
  }
};

// Initialize app automatically
customInitApp();

export const firestoreDB = getFirestore();
