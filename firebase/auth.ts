import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { auth, googleProvider } from "./config";

// Sign up with email and password
export const signUp = (email: string, password: string): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password);

// Sign in with email and password
export const signIn = (email: string, password: string): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password);

// Sign in with Google
export const signInWithGoogle = (): Promise<UserCredential> =>
  signInWithPopup(auth, googleProvider);

// Sign out
export const signOut = (): Promise<void> =>
  fbSignOut(auth);

// Subscribe to auth state changes
export const onAuthStateChanged = (callback: (user: User | null) => void) =>
  fbOnAuthStateChanged(auth, callback);

// Get current user synchronously (may be null)
export const getCurrentUser = (): User | null => auth.currentUser;