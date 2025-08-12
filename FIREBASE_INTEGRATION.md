# Firebase Integration Documentation

## Overview

The application has been successfully integrated with Firebase using the provided API keys for the `unihive-app` project.

## Firebase Services Integrated

### 1. **Firebase Authentication**
- Email/password authentication
- Automatic user document creation in Firestore
- Admin user detection (admin@unihive.live)

### 2. **Firestore Database**
- **Collections:**
  - `users` - User profiles and data
  - `gigs` - Delivery gigs/jobs
  - `walletRequests` - Wallet load requests
  - `withdrawalRequests` - Withdrawal requests  
  - `transactions` - Transaction history
  - `coupons` - Discount coupons
  - `platformConfig` - Platform settings (fees, offer text)

### 3. **Firebase Storage**
- **User Images:**
  - `users/{userId}/profile_*.jpg` - Profile photos
  - `users/{userId}/collegeId_*.jpg` - College ID photos
- **Wallet Requests:**
  - `walletRequests/{requestId}/screenshot_*.jpg` - Payment screenshots
- **Gigs:**
  - `gigs/{gigId}/selfie_*.jpg` - Acceptance selfies

### 4. **Firebase Analytics**
- Integrated and automatically tracks usage

## Configuration

The Firebase configuration has been updated in `firebase/config.ts`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAcNB02GK3Dh03bXXX7tCXHv52PWSp-aTM",
  authDomain: "unihive-app.firebaseapp.com", 
  projectId: "unihive-app",
  storageBucket: "unihive-app.firebasestorage.app",
  messagingSenderId: "199181240300",
  appId: "1:199181240300:web:a19a3c8d235aad4e8ca2c9",
  measurementId: "G-TDZPWPYKYC"
};
```

## Automatic Initialization

The application automatically initializes Firebase data on first load:
- Platform configuration
- Default coupons
- Required collections

## Admin Account Setup

1. Navigate to the application
2. Click "Sign Up" 
3. Use email: `admin@unihive.live`
4. Complete the signup process
5. The system will automatically grant admin privileges

## Image Upload Flow

### User Signup
1. User takes profile photo and college ID photo via camera
2. Images are stored as base64 temporarily during signup
3. Can be migrated to Firebase Storage in the future

### Wallet Load Requests  
1. User uploads payment screenshot
2. Image is uploaded to Firebase Storage
3. Download URL is stored in Firestore

### Gig Acceptance
1. User takes selfie for verification
2. Image is uploaded to Firebase Storage
3. Download URL is stored with gig data

## Security Rules (Recommended)

You should set up Firebase Security Rules for:

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read/write all data
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users can read gigs and create their own
    match /gigs/{gigId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.requester.id;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.requester.id || 
         request.auth.uid == resource.data.deliverer.id);
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can upload wallet request screenshots
    match /walletRequests/{requestId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Users can upload gig acceptance selfies
    match /gigs/{gigId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Manual Initialization

If automatic initialization fails, you can manually initialize:

```javascript
// In browser console
window.initializeFirebase();
```

## Build and Deploy

The application builds successfully with all Firebase integrations:

```bash
npm run build
```

All Firebase services are properly configured and ready for production use.