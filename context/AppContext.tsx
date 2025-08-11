
import { createContext } from 'react';
import { User, Gig, WalletLoadRequest, Transaction, Coupon, WithdrawalRequest } from '../types';

export interface AppContextType {
    currentUser: User | null;
    isAuthLoading: boolean;
    users: User[];
    gigs: Gig[];
    walletLoadRequests: WalletLoadRequest[];
    withdrawalRequests: WithdrawalRequest[];
    transactions: Transaction[];
    platformFee: number;
    offerBarText: string;
    coupons: Coupon[];
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    login: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    signup: (userData: Omit<User, 'id' | 'rating' | 'deliveriesCompleted' | 'walletBalance' | 'isAdmin' | 'referralCode' | 'firstRechargeCompleted' | 'usedCouponCodes' | 'createdAt'>, password: string, referredByCode?: string) => Promise<void>;
    addGig: (gig: Omit<Gig, 'id' | 'postedAt' | 'requester' | 'status' | 'otp' | 'acceptanceSelfieUrl'>) => Promise<boolean>;
    updateGig: (gigId: string, updates: Partial<Gig>) => Promise<void>;
    deleteGig: (gigId: string) => Promise<void>;
    requestWalletLoad: (requestData: Omit<WalletLoadRequest, 'id' | 'status' | 'requestedAt' | 'userId' | 'userName'>, couponCode?: string) => Promise<void>;
    approveWalletLoad: (requestId: string) => Promise<void>;
    rejectWalletLoad: (requestId: string) => Promise<void>;
    requestWithdrawal: (amount: number, upiId: string) => Promise<boolean>;
    approveWithdrawal: (requestId: string) => Promise<void>;
    rejectWithdrawal: (requestId: string) => Promise<void>;
    manualTopUp: (phone: string, amount: number) => Promise<boolean>;
    setPlatformFee: (fee: number) => Promise<void>;
    setOfferBarText: (text: string) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
    updateCoupon: (couponId: string, updates: Partial<Coupon>) => Promise<void>;
    deleteCoupon: (couponId: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);