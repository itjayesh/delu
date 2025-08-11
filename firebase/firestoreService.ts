import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc
} from "firebase/firestore";
import { User, Gig, GigUser, WalletLoadRequest, WithdrawalRequest, Transaction, Coupon } from "../types";

// Collections
const COLLECTIONS = {
  USERS: 'users',
  GIGS: 'gigs',
  WALLET_REQUESTS: 'walletRequests',
  WITHDRAWAL_REQUESTS: 'withdrawalRequests',
  TRANSACTIONS: 'transactions',
  COUPONS: 'coupons',
  PLATFORM_CONFIG: 'platformConfig'
};

// User operations
export const createUserDocument = async (userId: string, userData: Omit<User, 'id'>): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...userData,
      createdAt: Timestamp.fromDate(userData.createdAt)
    });
  } catch (error: any) {
    console.error("Error creating user document:", error);
    throw new Error(error.message);
  }
};

export const getUserDocument = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        id: userDoc.id,
        createdAt: data.createdAt.toDate()
      } as User;
    }
    return null;
  } catch (error: any) {
    console.error("Error getting user document:", error);
    throw new Error(error.message);
  }
};

export const updateUserDocument = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, updates);
  } catch (error: any) {
    console.error("Error updating user document:", error);
    throw new Error(error.message);
  }
};

export const deleteUserDocument = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
  } catch (error: any) {
    console.error("Error deleting user document:", error);
    throw new Error(error.message);
  }
};

// Gig operations
export const addGigToFirestore = async (gigData: Omit<Gig, 'id' | 'postedAt' | 'requester' | 'status' | 'otp' | 'acceptanceSelfieUrl'>, requester: GigUser): Promise<string> => {
  try {
    const newGig = {
      ...gigData,
      requester,
      postedAt: Timestamp.now(),
      status: "OPEN",
      otp: Math.floor(100000 + Math.random() * 900000).toString(),
      deliveryDeadline: Timestamp.fromDate(gigData.deliveryDeadline)
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.GIGS), newGig);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding gig:", error);
    throw new Error(error.message);
  }
};

export const updateGigInFirestore = async (gigId: string, updates: Partial<Gig>): Promise<void> => {
  try {
    const gigRef = doc(db, COLLECTIONS.GIGS, gigId);
    const updateData: any = { ...updates };
    
    // Convert Date objects to Timestamps
    if (updates.deliveryDeadline) {
      updateData.deliveryDeadline = Timestamp.fromDate(updates.deliveryDeadline);
    }
    if (updates.postedAt) {
      updateData.postedAt = Timestamp.fromDate(updates.postedAt);
    }
    
    await updateDoc(gigRef, updateData);
  } catch (error: any) {
    console.error("Error updating gig:", error);
    throw new Error(error.message);
  }
};

export const deleteGigFromFirestore = async (gigId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.GIGS, gigId));
  } catch (error: any) {
    console.error("Error deleting gig:", error);
    throw new Error(error.message);
  }
};

// Wallet request operations
export const addWalletRequestToFirestore = async (requestData: Omit<WalletLoadRequest, 'id' | 'requestedAt'>): Promise<string> => {
  try {
    const newRequest = {
      ...requestData,
      requestedAt: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.WALLET_REQUESTS), newRequest);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding wallet request:", error);
    throw new Error(error.message);
  }
};

export const updateWalletRequestInFirestore = async (requestId: string, updates: Partial<WalletLoadRequest>): Promise<void> => {
  try {
    const requestRef = doc(db, COLLECTIONS.WALLET_REQUESTS, requestId);
    await updateDoc(requestRef, updates);
  } catch (error: any) {
    console.error("Error updating wallet request:", error);
    throw new Error(error.message);
  }
};

// Withdrawal request operations
export const addWithdrawalRequestToFirestore = async (requestData: Omit<WithdrawalRequest, 'id' | 'requestedAt'>): Promise<string> => {
  try {
    const newRequest = {
      ...requestData,
      requestedAt: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.WITHDRAWAL_REQUESTS), newRequest);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding withdrawal request:", error);
    throw new Error(error.message);
  }
};

export const updateWithdrawalRequestInFirestore = async (requestId: string, updates: Partial<WithdrawalRequest>): Promise<void> => {
  try {
    const requestRef = doc(db, COLLECTIONS.WITHDRAWAL_REQUESTS, requestId);
    await updateDoc(requestRef, updates);
  } catch (error: any) {
    console.error("Error updating withdrawal request:", error);
    throw new Error(error.message);
  }
};

// Transaction operations
export const addTransactionToFirestore = async (transactionData: Omit<Transaction, 'id' | 'timestamp'>): Promise<string> => {
  try {
    const newTransaction = {
      ...transactionData,
      timestamp: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.TRANSACTIONS), newTransaction);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding transaction:", error);
    throw new Error(error.message);
  }
};

// Coupon operations
export const addCouponToFirestore = async (couponData: Omit<Coupon, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.COUPONS), couponData);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding coupon:", error);
    throw new Error(error.message);
  }
};

export const updateCouponInFirestore = async (couponId: string, updates: Partial<Coupon>): Promise<void> => {
  try {
    const couponRef = doc(db, COLLECTIONS.COUPONS, couponId);
    await updateDoc(couponRef, updates);
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    throw new Error(error.message);
  }
};

export const deleteCouponFromFirestore = async (couponId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.COUPONS, couponId));
  } catch (error: any) {
    console.error("Error deleting coupon:", error);
    throw new Error(error.message);
  }
};

// Platform config operations
export const updatePlatformConfigInFirestore = async (configData: any): Promise<void> => {
  try {
    const configRef = doc(db, COLLECTIONS.PLATFORM_CONFIG, 'main');
    await setDoc(configRef, configData, { merge: true });
  } catch (error: any) {
    console.error("Error updating platform config:", error);
    throw new Error(error.message);
  }
};

// Real-time listeners
export const subscribeToUsers = (callback: (users: User[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as User[];
    callback(users);
  });
};

export const subscribeToGigs = (callback: (gigs: Gig[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.GIGS), (snapshot) => {
    const gigs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        postedAt: data.postedAt?.toDate() || new Date(),
        deliveryDeadline: data.deliveryDeadline?.toDate() || new Date()
      };
    }) as Gig[];
    callback(gigs);
  });
};

export const subscribeToWalletRequests = (callback: (requests: WalletLoadRequest[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.WALLET_REQUESTS), (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      requestedAt: doc.data().requestedAt?.toDate() || new Date()
    })) as WalletLoadRequest[];
    callback(requests);
  });
};

export const subscribeToWithdrawalRequests = (callback: (requests: WithdrawalRequest[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.WITHDRAWAL_REQUESTS), (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      requestedAt: doc.data().requestedAt?.toDate() || new Date()
    })) as WithdrawalRequest[];
    callback(requests);
  });
};

export const subscribeToTransactions = (callback: (transactions: Transaction[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.TRANSACTIONS), (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as Transaction[];
    callback(transactions);
  });
};

export const subscribeToCoupons = (callback: (coupons: Coupon[]) => void) => {
  return onSnapshot(collection(db, COLLECTIONS.COUPONS), (snapshot) => {
    const coupons = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Coupon[];
    callback(coupons);
  });
};

export const subscribeToPlatformConfig = (callback: (config: any) => void) => {
  return onSnapshot(doc(db, COLLECTIONS.PLATFORM_CONFIG, 'main'), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};
