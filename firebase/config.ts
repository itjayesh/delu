import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Firebase Configuration
 * 
 * This configuration uses environment variables to securely store Firebase project settings.
 * All sensitive information like API keys are loaded from environment variables to avoid
 * exposing them in the source code.
 * 
 * Environment variables are prefixed with VITE_ to make them available in the Vite build process.
 * Make sure to set these variables in your .env.local file for local development.
 */

// Check if all required Firebase environment variables are present
const requiredEnvVars = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value || value === 'your-api-key-here' || value.includes('your-'))
  .map(([key, _]) => key);

if (missingVars.length > 0) {
  console.error('🔥 Firebase Configuration Error!');
  console.error('Missing or invalid environment variables:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  console.error('');
  console.error('Please create/update your .env.local file with your actual Firebase configuration.');
  console.error('You can find these values in your Firebase Console > Project Settings > General > Web apps');
  console.error('');
  console.error('Example .env.local format:');
  console.error('VITE_FIREBASE_API_KEY=AIza...');
  console.error('VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com');
  console.error('VITE_FIREBASE_PROJECT_ID=your-project-id');
  console.error('VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com');
  console.error('VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012');
  console.error('VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456');
  console.error('VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX');
}

const firebaseConfig = {
  apiKey: requiredEnvVars.VITE_FIREBASE_API_KEY,
  authDomain: requiredEnvVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: requiredEnvVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: requiredEnvVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: requiredEnvVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: requiredEnvVars.VITE_FIREBASE_APP_ID,
  measurementId: requiredEnvVars.VITE_FIREBASE_MEASUREMENT_ID
};

/**
 * Initialize Firebase App
 * 
 * This creates the main Firebase app instance using the configuration above.
 * All other Firebase services will be initialized from this app instance.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Analytics
 * 
 * Provides insights into app usage and user behavior.
 * Used for tracking user engagement and performance metrics.
 */
const analytics = getAnalytics(app);

/**
 * Firebase Authentication
 * 
 * Handles user authentication including sign-up, sign-in, and user management.
 * Supports various authentication methods like email/password, phone, and social providers.
 */
const auth = getAuth(app);

/**
 * Cloud Firestore Database
 * 
 * NoSQL document database for storing application data.
 * Used for storing user profiles, gigs, transactions, and other app data.
 * Provides real-time synchronization across clients.
 */
const db = getFirestore(app);

/**
 * Firebase Cloud Storage
 * 
 * File storage service for uploading and serving user-generated content.
 * Used for storing profile photos, college ID images, gig-related files,
 * and acceptance selfies.
 */
const storage = getStorage(app);

// Export all Firebase services for use throughout the application
export { app, analytics, auth, db, storage };
