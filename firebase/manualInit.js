// Firebase initialization script
// Run this in the browser console to manually initialize Firebase data

import { initializeFirestoreData } from './firebase/initializeData';

// This function can be called manually if needed
window.initializeFirebase = async () => {
  try {
    await initializeFirestoreData();
    console.log('✅ Firebase initialization completed successfully!');
    console.log('📝 Next steps:');
    console.log('1. Create admin account by signing up with email: admin@unihive.live');
    console.log('2. Start using the application!');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
};

console.log('🔧 Firebase initialization function loaded.');
console.log('Call window.initializeFirebase() to manually initialize Firebase data.');