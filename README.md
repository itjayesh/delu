# Delu - University Delivery Platform

This contains everything you need to run your app locally with Firebase backend integration.

View your app in AI Studio: https://ai.studio/apps/drive/1QZVdvFnDdIj8ncp060jiWF5gSr0cWYCv?showPreview=true&showAssistant=true&showTreeView=true&showCode=true

## Firebase Backend Integration

This application uses Firebase as its backend service, providing:
- **Authentication**: User sign-up, sign-in, and account management
- **Firestore Database**: Real-time NoSQL database for storing application data
- **Cloud Storage**: File storage for profile photos, college IDs, and gig attachments
- **Analytics**: User behavior and app performance tracking

## Prerequisites

- Node.js (version 16 or higher)
- Firebase project with the following services enabled:
  - Authentication
  - Firestore Database
  - Cloud Storage
  - Analytics (optional)

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable the following services:
   - **Authentication**: Enable Email/Password provider
   - **Firestore Database**: Create in production mode
   - **Storage**: Create with default rules
   - **Analytics**: Enable if you want usage tracking

### 2. Get Firebase Configuration

1. In your Firebase project, go to Project Settings
2. Scroll down to "Your apps" section
3. Click on the web app or create a new web app
4. Copy the Firebase configuration object

### 3. Environment Variables Setup

1. Create a `.env.local` file in the project root
2. Add your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

### 4. Firestore Database Structure

The application uses the following Firestore collections:

- **users**: User profiles and account information
- **gigs**: Delivery gig listings and details
- **walletRequests**: Wallet load requests from users
- **withdrawalRequests**: Withdrawal requests from users
- **transactions**: All wallet transactions and payments
- **coupons**: Promotional codes and discounts
- **platformConfig**: Application configuration settings

### 5. Storage Bucket Organization

Files are organized in the following folder structure:

```
storage/
├── profile-photos/     # User profile pictures
├── college-ids/        # College ID verification documents
├── acceptance-selfies/ # Gig acceptance verification photos
└── gig-attachments/    # Gig-related file uploads
```

### 6. Security Rules

Make sure to configure appropriate security rules for Firestore and Storage:

**Firestore Rules Example:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Gigs are readable by all authenticated users
    match /gigs/{gigId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Admin-only collections
    match /platformConfig/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

**Storage Rules Example:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload their own files
    match /profile-photos/{userId}_{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /college-ids/{userId}_{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Gig-related files
    match /acceptance-selfies/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    match /gig-attachments/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase configuration:**
   - Create `.env.local` file with your Firebase configuration
   - Ensure all required environment variables are set

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Firebase Services Usage

### Authentication Service
- Handles user registration and login
- Manages user sessions and authentication state
- Supports email/password authentication

### Firestore Service
- Comprehensive CRUD operations for all data models
- Real-time data synchronization
- Optimized queries with pagination support

### Storage Service
- File upload with progress tracking
- Organized folder structure for different file types
- Automatic file naming and URL generation

## Development Notes

- All Firebase configuration is loaded from environment variables for security
- The app uses TypeScript for type safety across all Firebase operations
- Firebase services are modularized for easy maintenance and testing
- Real-time listeners are available for live data updates

## Security Considerations

- API keys are stored in environment variables and not exposed in client code
- Firestore and Storage rules should be configured to match your security requirements
- User authentication is required for all data operations
- File uploads are validated on both client and server side
