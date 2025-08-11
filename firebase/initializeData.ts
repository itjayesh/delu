import { 
  addCouponToFirestore, 
  updatePlatformConfigInFirestore,
  createUserDocument 
} from './firestoreService';
import { MOCK_COUPONS, MOCK_PLATFORM_CONFIG, MOCK_ADMIN_USER } from '../mockData';

export const initializeFirestoreData = async () => {
  try {
    console.log('Initializing Firestore data...');
    
    // Initialize platform config
    await updatePlatformConfigInFirestore(MOCK_PLATFORM_CONFIG);
    console.log('Platform config initialized');
    
    // Initialize coupons
    for (const coupon of MOCK_COUPONS) {
      const { id, ...couponData } = coupon;
      await addCouponToFirestore(couponData);
    }
    console.log('Coupons initialized');
    
    // Create admin user document (this will be created when admin signs up)
    // We'll skip this for now as it should be created through the signup process
    
    console.log('Firestore data initialization complete!');
  } catch (error) {
    console.error('Error initializing Firestore data:', error);
  }
};
