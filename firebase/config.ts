import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcNB02GK3Dh03bXXX7tCXHv52PWSp-aTM",
  authDomain: "unihive-app.firebaseapp.com",
  projectId: "unihive-app",
  storageBucket: "unihive-app.firebasestorage.app",
  messagingSenderId: "199181240300",
  appId: "1:199181240300:web:a19a3c8d235aad4e8ca2c9",
  measurementId: "G-TDZPWPYKYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services for use in the application
export { app, analytics, auth, db, storage };
