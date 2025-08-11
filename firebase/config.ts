import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxuTrW-QOQoxUFmCWULRySkV-kbeDQP7E",
  authDomain: "dellu-app.firebaseapp.com",
  projectId: "dellu-app",
  storageBucket: "dellu-app.firebasestorage.app",
  messagingSenderId: "822716749786",
  appId: "1:822716749786:web:c0adae9cb7500880c2d2e3",
  measurementId: "G-PFLW63SHC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services for use in the application
export { app, analytics, auth, db };
