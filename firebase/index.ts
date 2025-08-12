/**
 * Firebase Services Index
 * 
 * This file provides a centralized export for all Firebase services and utilities.
 * Import Firebase functionality from this file to ensure consistent service usage
 * across the application.
 */

// Core Firebase configuration and services
export { 
  app, 
  analytics, 
  auth, 
  db, 
  storage 
} from './config';

// Firestore database operations
export {
  // User operations
  createUserDocument,
  getUserDocument,
  updateUserDocument,
  deleteUserDocument,
  
  // Gig operations
  addGigToFirestore,
  updateGigInFirestore,
  deleteGigFromFirestore,
  
  // Wallet operations
  addWalletRequestToFirestore,
  updateWalletRequestInFirestore,
  
  // Withdrawal operations
  addWithdrawalRequestToFirestore,
  updateWithdrawalRequestInFirestore,
  
  // Transaction operations
  addTransactionToFirestore,
  
  // Coupon operations
  addCouponToFirestore,
  updateCouponInFirestore,
  deleteCouponFromFirestore,
  
  // Platform config operations
  updatePlatformConfigInFirestore,
  
  // Real-time listeners
  subscribeToUsers,
  subscribeToGigs,
  subscribeToWalletRequests,
  subscribeToWithdrawalRequests,
  subscribeToTransactions,
  subscribeToCoupons,
  subscribeToPlatformConfig
} from './firestoreService';

// Storage operations
export {
  // Core storage functions
  uploadFile,
  uploadFileWithProgress,
  deleteFile,
  
  // Specialized upload functions
  uploadProfilePhoto,
  uploadCollegeId,
  uploadAcceptanceSelfie,
  uploadGigAttachment,
  
  // Storage paths
  STORAGE_PATHS
} from './storageService';

// Data initialization
export { initializeFirestoreData } from './initializeData';

/**
 * Firebase Service Summary
 * 
 * Authentication (auth):
 * - User registration and login
 * - Session management
 * - Password reset functionality
 * 
 * Firestore Database (db):
 * - User profiles and account data
 * - Gig listings and management
 * - Wallet and transaction history
 * - Coupons and platform configuration
 * - Real-time data synchronization
 * 
 * Cloud Storage (storage):
 * - Profile photo uploads
 * - College ID verification documents
 * - Gig acceptance selfies
 * - General file attachments
 * 
 * Analytics (analytics):
 * - User behavior tracking
 * - App performance monitoring
 * - Custom event logging
 */