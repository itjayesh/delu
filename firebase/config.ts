// Firebase configuration and initialization

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxuTrW-QOQoxUFmCWULRySkV-kbeDQP7E",
  authDomain: "dellu-app.firebaseapp.com",
  projectId: "dellu-app",
  storageBucket: "dellu-app.appspot.com",
  messagingSenderId: "822716749786",
  appId: "1:822716749786:web:c0adae9cb7500880c2d2e3",
  measurementId: "G-PFLW63SHC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, firestore, storage, analytics, googleProvider };