
import { User, Gig, GigStatus, Coupon, GigUser } from './types';

export const MOCK_ADMIN_USER: User = {
    id: 'admin-user-id',
    name: 'Admin User',
    phone: '0000000000',
    email: 'admin@unihive.live',
    block: 'Admin Block',
    profilePhotoUrl: 'https://i.pravatar.cc/150?u=admin',
    collegeIdUrl: 'https://via.placeholder.com/300x200.png?text=Admin+ID',
    rating: 5,
    deliveriesCompleted: 100,
    walletBalance: 9999,
    isAdmin: true,
    referralCode: 'ADMINREF',
    firstRechargeCompleted: true,
    usedCouponCodes: {},
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
};

export const MOCK_NORMAL_USER: User = {
    id: 'normal-user-id',
    name: 'Normal User',
    phone: '1234567890',
    email: 'user@unihive.live',
    block: 'Block A',
    profilePhotoUrl: 'https://i.pravatar.cc/150?u=user',
    collegeIdUrl: 'https://via.placeholder.com/300x200.png?text=User+ID',
    rating: 4.8,
    deliveriesCompleted: 12,
    walletBalance: 250,
    isAdmin: false,
    referralCode: 'USERREF',
    firstRechargeCompleted: true,
    usedCouponCodes: { 'WELCOME10': 1 },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
};

export const MOCK_DELIVERER_USER: User = {
    id: 'deliverer-user-id',
    name: 'Deliverer Dave',
    phone: '9876543210',
    email: 'dave@unihive.live',
    block: 'Block C',
    profilePhotoUrl: 'https://i.pravatar.cc/150?u=dave',
    collegeIdUrl: 'https://via.placeholder.com/300x200.png?text=Dave+ID',
    rating: 4.9,
    deliveriesCompleted: 55,
    walletBalance: 800,
    isAdmin: false,
    referralCode: 'DAVEREF',
    firstRechargeCompleted: true,
    usedCouponCodes: {},
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
};


export const MOCK_USERS: User[] = [MOCK_ADMIN_USER, MOCK_NORMAL_USER, MOCK_DELIVERER_USER];

const requesterUser: GigUser = { id: MOCK_NORMAL_USER.id, name: MOCK_NORMAL_USER.name, phone: MOCK_NORMAL_USER.phone, email: MOCK_NORMAL_USER.email };
const delivererUser: GigUser = { id: MOCK_DELIVERER_USER.id, name: MOCK_DELIVERER_USER.name, phone: MOCK_DELIVERER_USER.phone, email: MOCK_DELIVERER_USER.email };

export const MOCK_GIGS: Gig[] = [
    {
        id: 'gig-1',
        requester: requesterUser,
        parcelInfo: 'Large Amazon Box',
        pickupBlock: 'Main Gate',
        destinationBlock: 'Block A',
        price: 75,
        deliveryDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        postedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
        status: GigStatus.OPEN,
        otp: '123456',
        size: 'Large',
        isUrgent: true,
    },
    {
        id: 'gig-2',
        requester: requesterUser,
        deliverer: delivererUser,
        parcelInfo: 'Swiggy Food Packet',
        pickupBlock: 'Uni Food Court',
        destinationBlock: 'Block A',
        price: 40,
        deliveryDeadline: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
        postedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        status: GigStatus.ACCEPTED,
        otp: '654321',
        size: 'Small',
        note: 'It is a cold coffee, please keep it upright.',
    },
    {
        id: 'gig-3',
        requester: { id: MOCK_DELIVERER_USER.id, name: MOCK_DELIVERER_USER.name, phone: MOCK_DELIVERER_USER.phone, email: MOCK_DELIVERER_USER.email },
        deliverer: requesterUser,
        parcelInfo: 'Library Books',
        pickupBlock: 'Central Library',
        destinationBlock: 'Block C',
        price: 50,
        deliveryDeadline: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago (completed)
        postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        status: GigStatus.COMPLETED,
        otp: '789012',
        size: 'Medium',
        delivererRating: 5,
        delivererComments: 'Super fast delivery!'
    },
     {
        id: 'gig-4',
        requester: requesterUser,
        parcelInfo: 'Expired Gig Example',
        pickupBlock: 'Old Gate',
        destinationBlock: 'Block D',
        price: 30,
        deliveryDeadline: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago (expired)
        postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: GigStatus.OPEN,
        otp: '999888',
        size: 'Small',
    },
];

export const MOCK_COUPONS: Coupon[] = [
    {
        id: 'coupon-1',
        code: 'WELCOME10',
        bonusPercentage: 0.1,
        isActive: true,
        maxUsesPerUser: 1,
    },
    {
        id: 'coupon-2',
        code: 'RECHARGE20',
        bonusPercentage: 0.2,
        isActive: true,
        maxUsesPerUser: 3,
    },
     {
        id: 'coupon-3',
        code: 'INACTIVE',
        bonusPercentage: 0.5,
        isActive: false,
        maxUsesPerUser: 1,
    }
];

export const MOCK_PLATFORM_CONFIG = {
    fee: 0.2,
    offerBarText: 'Use code WELCOME10 for 10% bonus on your first wallet load! ;; Delivery fees starting from just ₹30!'
};