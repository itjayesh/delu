import { firestore } from "./config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";

export interface UserDoc {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "user";
  [key: string]: any;
}

// Returns a reference to the user document in "users/{uid}"
export const userDocRef = (uid: string): DocumentReference => doc(firestore, "users", uid);

// Fetches the user document
export const getUserDoc = async (uid: string): Promise<DocumentSnapshot> => getDoc(userDocRef(uid));

// Creates/updates a user document (with role)
export const setUserDoc = async (user: UserDoc): Promise<void> =>
  setDoc(userDocRef(user.uid), user, { merge: true });

// Updates the role field of a user document
export const updateUserRole = async (uid: string, role: "admin" | "user"): Promise<void> =>
  updateDoc(userDocRef(uid), { role });

export { firestore };