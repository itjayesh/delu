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
    
    // Note: Admin user will be created automatically when admin@unihive.live signs up
    // The system will detect admin email and set appropriate permissions
    
    console.log('Firestore data initialization complete!');
    console.log('To create admin account, sign up with email: admin@unihive.live');
  } catch (error) {
    console.error('Error initializing Firestore data:', error);
  }
};
