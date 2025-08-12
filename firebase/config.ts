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
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
