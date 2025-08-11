import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged, getCurrentUser, signOut } from "../firebase/auth";
import { getUserDoc, UserDoc, setUserDoc } from "../firebase/db";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";

interface AuthContextValue {
  user: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userDoc: null,
  loading: true,
  signOut: async () => {},
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [userDoc, setUserDocState] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);
      if (firebaseUser) {
        // Listen for userDoc changes in Firestore
        const userRef = doc(firestore, "users", firebaseUser.uid);
        const unsubDoc = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            setUserDocState(snap.data() as UserDoc);
          } else {
            // Create a userDoc with default "user" role if missing
            const doc: UserDoc = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
              role: "user",
            };
            setUserDoc(doc);
            setUserDocState(doc);
          }
          setLoading(false);
        });
        return () => unsubDoc();
      } else {
        setUserDocState(null);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setUserDocState(null);
  };

  const isAdmin = userDoc?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        userDoc,
        loading,
        signOut: handleSignOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};