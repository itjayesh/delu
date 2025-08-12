# delu.live - Gig Delivery Platform

A modern delivery and gig platform built with React, TypeScript, and Firebase.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### Firebase Setup (Required)

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create a project" or select an existing project
   - Enable the following services:
     - Authentication (Email/Password)
     - Firestore Database
     - Storage
     - Analytics (optional)

2. **Get Your Firebase Configuration**
   - In Firebase Console, go to Project Settings (⚙️ icon)
   - Scroll down to "Your apps" section
   - Click the web app icon (`</>`) or "Add app" if none exists
   - Register your app with a nickname (e.g., "delu-web")
   - Copy the configuration object

3. **Set Up Environment Variables**
   - Create a `.env.local` file in the project root
   - Add your Firebase configuration:

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

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. **Configure Firestore Security Rules**
   - In Firebase Console, go to Firestore Database → Rules
   - Use these basic rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Gigs are readable by all authenticated users
    match /gigs/{gigId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Admin-only collections
    match /{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

5. **Configure Storage Security Rules**
   - In Firebase Console, go to Storage → Rules
   - Use these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd delu
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📁 Project Structure

```
src/
├── components/         # React components
├── pages/             # Page components
├── context/           # React context providers
├── firebase/          # Firebase configuration and services
│   ├── config.ts      # Firebase initialization
│   ├── firestoreService.ts  # Database operations
│   ├── storageService.ts    # File storage operations
│   └── index.ts       # Centralized exports
├── types.ts           # TypeScript type definitions
└── mockData.ts        # Sample data for development
```

## 🔥 Firebase Services

### Authentication
- Email/password authentication
- User session management
- Admin user support

### Firestore Database
Collections:
- **users** - User profiles and account data
- **gigs** - Delivery job listings
- **walletRequests** - Wallet top-up requests
- **withdrawalRequests** - Withdrawal requests
- **transactions** - Financial transaction history
- **coupons** - Promotional codes
- **platformConfig** - App configuration settings

### Cloud Storage
Organized folder structure:
- `profile-photos/` - User profile pictures
- `college-ids/` - Student ID verification documents
- `acceptance-selfies/` - Gig acceptance verification photos
- `gig-attachments/` - Additional gig-related files

## 🎯 Features

- **User Authentication** - Secure email/password login
- **Gig Management** - Create, browse, and manage delivery jobs
- **Wallet System** - Digital wallet with top-up and withdrawal
- **Real-time Updates** - Live synchronization across devices
- **Admin Panel** - Complete administrative controls
- **File Uploads** - Profile photos, ID verification, attachments
- **Referral System** - Earn rewards for referrals
- **Coupon System** - Promotional codes and discounts

## 🛠️ Development

### Environment Variables
All environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

### State Management
The app uses React Context for global state management with real-time Firebase synchronization.

### Type Safety
Full TypeScript support with comprehensive type definitions for all data structures.

## 🚀 Deployment

1. **Build the project**
```bash
npm run build
```

2. **Set production environment variables**
   - Create `.env.production` with your production Firebase config
   - Ensure all `VITE_` prefixed variables are set

3. **Deploy to your hosting provider**
   - Firebase Hosting
   - Vercel
   - Netlify
   - Or any static hosting service

## 🔐 Security

- API keys and sensitive data stored in environment variables
- Firebase security rules for data access control
- User authentication required for all operations
- Admin-only functions protected by role-based access

## 📱 Features Overview

### For Users
- Browse available delivery gigs
- Create delivery requests
- Manage wallet balance
- Track delivery history
- Refer friends for rewards

### For Admin
- User management
- Gig oversight
- Financial transaction monitoring
- Platform configuration
- Analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Need help?** Check the Firebase Console for detailed error messages or create an issue in this repository.
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
