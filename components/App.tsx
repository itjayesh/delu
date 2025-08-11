
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext, AppContextType } from '../context/AppContext';
import { User, Gig, GigStatus, WalletLoadRequest, Transaction, TransactionType, Coupon, WithdrawalRequest, GigUser, WalletRequestStatus, WithdrawalRequestStatus } from '../types';
import { MOCK_USERS, MOCK_GIGS, MOCK_COUPONS, MOCK_PLATFORM_CONFIG } from '../mockData';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { 
  createUserDocument, 
  getUserDocument, 
  updateUserDocument,
  deleteUserDocument,
  addGigToFirestore,
  updateGigInFirestore,
  deleteGigFromFirestore,
  addWalletRequestToFirestore,
  updateWalletRequestInFirestore,
  addWithdrawalRequestToFirestore,
  updateWithdrawalRequestInFirestore,
  addTransactionToFirestore,
  addCouponToFirestore,
  updateCouponInFirestore,
  deleteCouponFromFirestore,
  updatePlatformConfigInFirestore,
  subscribeToUsers,
  subscribeToGigs,
  subscribeToWalletRequests,
  subscribeToWithdrawalRequests,
  subscribeToTransactions,
  subscribeToCoupons,
  subscribeToPlatformConfig
} from '../firebase/firestoreService';

import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
import Header from './Header';
import OfferBar from './OfferBar';
import LiveGigs from '../pages/LiveGigs';
import MyGigs from '../pages/MyGigs';
import CreateGig from '../pages/CreateGig';
import AuthModal from './AuthModal';
import Wallet from '../pages/Wallet';
import Admin from '../pages/Admin';
import ReferAndEarn from '../pages/ReferAndEarn';

// Custom hook for Firebase authentication
const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get user data from Firestore
                    const userData = await getUserDocument(firebaseUser.uid);
                    if (userData) {
                        setCurrentUser(userData);
                    } else {
                        // If user document doesn't exist, create one with basic info
                        const isAdminUser = firebaseUser.email === 'admin@delu.live';
                        const newUser: User = {
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || (isAdminUser ? 'Admin User' : ''),
                            phone: firebaseUser.phoneNumber || (isAdminUser ? '0000000000' : ''),
                            email: firebaseUser.email || '',
                            block: isAdminUser ? 'Admin Block' : '',
                            profilePhotoUrl: firebaseUser.photoURL || '',
                            collegeIdUrl: '',
                            rating: 5.0,
                            deliveriesCompleted: isAdminUser ? 100 : 0,
                            walletBalance: isAdminUser ? 9999 : 0,
                            isAdmin: isAdminUser,
                            referralCode: isAdminUser ? 'ADMINREF' : `${(firebaseUser.displayName || 'USER').split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.random().toString(36).substring(2, 6)}`.toUpperCase(),
                            firstRechargeCompleted: isAdminUser,
                            usedCouponCodes: {},
                            createdAt: new Date(),
                        };
                        await createUserDocument(firebaseUser.uid, newUser);
                        setCurrentUser(newUser);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setCurrentUser(null);
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateUser = (user: User | null) => {
        setCurrentUser(user);
    }

    return { currentUser, updateUser, isAuthLoading };
}

const App: React.FC = () => {
    const { currentUser, updateUser, isAuthLoading } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [walletLoadRequests, setWalletLoadRequests] = useState<WalletLoadRequest[]>([]);
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [platformConfig, setPlatformConfig] = useState(MOCK_PLATFORM_CONFIG);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    // Set up real-time listeners for cross-device sync
    useEffect(() => {
        const unsubscribeUsers = subscribeToUsers(setUsers);
        const unsubscribeGigs = subscribeToGigs(setGigs);
        const unsubscribeWalletRequests = subscribeToWalletRequests(setWalletLoadRequests);
        const unsubscribeWithdrawalRequests = subscribeToWithdrawalRequests(setWithdrawalRequests);
        const unsubscribeTransactions = subscribeToTransactions(setTransactions);
        const unsubscribeCoupons = subscribeToCoupons(setCoupons);
        const unsubscribePlatformConfig = subscribeToPlatformConfig((config) => {
            if (config) {
                setPlatformConfig(config);
            }
        });

        return () => {
            unsubscribeUsers();
            unsubscribeGigs();
            unsubscribeWalletRequests();
            unsubscribeWithdrawalRequests();
            unsubscribeTransactions();
            unsubscribeCoupons();
            unsubscribePlatformConfig();
        };
    }, []);

    const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
    const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

    // --- Core Functions (Local State Version) ---
    
    const addTransaction = useCallback(async (userId: string, type: TransactionType, amount: number, description: string, relatedGigId?: string) => {
        try {
            await addTransactionToFirestore({
                userId,
                type,
                amount,
                description,
                relatedGigId,
            });
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    }, []);
    
    const login = useCallback(async (email: string, password: string): Promise<User> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userData = await getUserDocument(userCredential.user.uid);
            if (userData) {
                updateUser(userData);
                return userData;
            } else {
                throw new Error("User data not found");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            throw new Error(error.message);
        }
    }, [updateUser]);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            updateUser(null);
        } catch (error: any) {
            console.error("Logout error:", error);
            throw new Error(error.message);
        }
    }, [updateUser]);

    const signup = useCallback(async (userData: Omit<User, 'id' | 'rating' | 'deliveriesCompleted' | 'walletBalance' | 'isAdmin' | 'referralCode' | 'firstRechargeCompleted' | 'usedCouponCodes' | 'createdAt'>, password: string, referredByCode?: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
            const isAdminUser = userData.email === 'admin@delu.live';
            const newUser: User = {
                id: userCredential.user.uid,
                ...userData,
                createdAt: new Date(),
                rating: 5.0,
                deliveriesCompleted: isAdminUser ? 100 : 0,
                walletBalance: isAdminUser ? 9999 : 0,
                isAdmin: isAdminUser,
                referralCode: isAdminUser ? 'ADMINREF' : `${userData.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.random().toString(36).substring(2, 6)}`.toUpperCase(),
                referredByCode: referredByCode?.trim() || undefined,
                firstRechargeCompleted: isAdminUser,
                usedCouponCodes: {},
            };
            await createUserDocument(userCredential.user.uid, newUser);
            updateUser(newUser);
        } catch (error: any) {
            console.error("Signup error:", error);
            throw new Error(error.message);
        }
    }, [updateUser]);

    const addGig = useCallback(async (gigData: Omit<Gig, 'id' | 'postedAt' | 'requester' | 'status' | 'otp' | 'acceptanceSelfieUrl'>): Promise<boolean> => {
        if (!currentUser) { openAuthModal(); return false; };
        
        const userInDb = users.find(u => u.id === currentUser.id);
        if(!userInDb || userInDb.walletBalance < gigData.price) return false;
        
        try {
            // 1. Deduct from requester's wallet
            const newBalance = userInDb.walletBalance - gigData.price;
            await updateUserDocument(currentUser.id, { walletBalance: newBalance });
            
            // 2. Create the new gig
            const requesterInfo: GigUser = { id: currentUser.id, name: currentUser.name, phone: currentUser.phone, email: currentUser.email };
            const newGigId = await addGigToFirestore(gigData, requesterInfo);
            
            // 3. Add transaction record
            await addTransaction(currentUser.id, 'DEBIT', gigData.price, `Gig created: ${gigData.parcelInfo}`, newGigId);
            
            return true;
        } catch (error) {
            console.error('Error adding gig:', error);
            return false;
        }
    }, [currentUser, openAuthModal, users, addTransaction]);
    
    const deleteGig = useCallback(async (gigId: string) => {
        const gigData = gigs.find(g => g.id === gigId);
        if (!gigData) return;

        if (gigData.status === GigStatus.OPEN) {
            try {
                // Refund requester
                const requesterUser = users.find(u => u.id === gigData.requester.id);
                if (requesterUser) {
                    const newBalance = requesterUser.walletBalance + gigData.price;
                    await updateUserDocument(gigData.requester.id, { walletBalance: newBalance });
                }

                await addTransaction(gigData.requester.id, 'CREDIT', gigData.price, `Refund for deleted gig: ${gigData.parcelInfo}`, gigId);
                await deleteGigFromFirestore(gigId);
            } catch (error) {
                console.error('Error deleting gig:', error);
            }
        } else {
            console.warn("Attempted to delete a non-open gig.");
        }
    }, [gigs, users, addTransaction]);

    const updateGig = useCallback(async (gigId: string, updates: Partial<Gig>) => {
        try {
            if (updates.status === GigStatus.COMPLETED) {
                const currentGig = gigs.find(g => g.id === gigId);
                if(!currentGig || currentGig.status === GigStatus.COMPLETED || !currentGig.deliverer) return;

                const deliverer = users.find(u => u.id === currentGig.deliverer!.id);
                if (deliverer) {
                    const payout = currentGig.price * (1 - platformConfig.fee);
                    const newBalance = deliverer.walletBalance + payout;
                    const newDeliveries = deliverer.deliveriesCompleted + 1;
                    
                    await updateUserDocument(currentGig.deliverer!.id, { 
                        walletBalance: newBalance,
                        deliveriesCompleted: newDeliveries
                    });
                    
                    await addTransaction(currentGig.deliverer!.id, 'PAYOUT', payout, `Payout for gig: ${currentGig.parcelInfo}`, gigId);
                }
            }

            await updateGigInFirestore(gigId, updates);
        } catch (error) {
            console.error('Error updating gig:', error);
        }
    }, [gigs, users, platformConfig.fee, addTransaction]);

    const requestWalletLoad = useCallback(async (requestData: Omit<WalletLoadRequest, 'id'|'status'|'requestedAt'|'userId'|'userName'>, couponCode?: string) => {
        if(!currentUser) return;
        try {
            await addWalletRequestToFirestore({
                ...requestData,
                userId: currentUser.id,
                userName: currentUser.name,
                status: WalletRequestStatus.PENDING,
                couponCode: couponCode?.trim().toUpperCase() || undefined,
            });
        } catch (error) {
            console.error('Error requesting wallet load:', error);
        }
    }, [currentUser]);

    const approveWalletLoad = useCallback(async (requestId: string) => {
        const request = walletLoadRequests.find(r => r.id === requestId);
        if (!request || request.status !== WalletRequestStatus.PENDING) return;
        
        try {
            const user = users.find(u => u.id === request.userId);
            if (!user) return;

            let totalBonus = 0, referrerReward = 0, referrerId: string | null = null;
            const transactionDescriptions: string[] = [];
            let updatedUserData: Partial<User> = {};
            
            if (request.couponCode) {
                const coupon = coupons.find(c => c.code === request.couponCode && c.isActive);
                if (coupon) {
                    const timesUsed = user.usedCouponCodes[coupon.code] || 0;
                    if (timesUsed < coupon.maxUsesPerUser) {
                        totalBonus += request.amount * coupon.bonusPercentage;
                        transactionDescriptions.push(`${coupon.bonusPercentage * 100}% bonus from ${coupon.code}`);
                        updatedUserData.usedCouponCodes = {...user.usedCouponCodes, [coupon.code]: timesUsed + 1};
                    }
                }
            }

            if (request.amount >= 100 && !user.firstRechargeCompleted && user.referredByCode) {
                const referrer = users.find(u => u.referralCode === user.referredByCode);
                if (referrer) {
                    referrerId = referrer.id;
                    referrerReward = 10;
                    totalBonus += request.amount * 0.05;
                    transactionDescriptions.push('5% First Recharge Referral Bonus');
                    updatedUserData.firstRechargeCompleted = true;
                }
            }
            
            const finalBalanceAddition = request.amount + totalBonus;
            updatedUserData.walletBalance = user.walletBalance + finalBalanceAddition;
            
            // Update user document
            await updateUserDocument(user.id, updatedUserData);
            
            // Add transactions
            if (totalBonus > 0) {
                await addTransaction(user.id, 'CREDIT', totalBonus, transactionDescriptions.join(' & '));
            }
            await addTransaction(user.id, 'TOPUP', request.amount, `Wallet load approved (UTR: ${request.utr})`);
            
            // Handle referrer reward
            if (referrerId) {
                const referrer = users.find(u => u.id === referrerId);
                if (referrer) {
                    await updateUserDocument(referrerId, { walletBalance: referrer.walletBalance + referrerReward });
                    await addTransaction(referrerId, 'CREDIT', referrerReward, `Referral reward for ${user.name}`);
                }
            }
            
            // Update request status
            await updateWalletRequestInFirestore(requestId, { status: WalletRequestStatus.APPROVED });
        } catch (error) {
            console.error('Error approving wallet load:', error);
        }
    }, [walletLoadRequests, users, coupons, addTransaction]);

    const rejectWalletLoad = useCallback(async (requestId: string) => {
        try {
            await updateWalletRequestInFirestore(requestId, { status: WalletRequestStatus.REJECTED });
        } catch (error) {
            console.error('Error rejecting wallet load:', error);
        }
    }, []);
    
    const requestWithdrawal = useCallback(async (amount: number, upiId: string): Promise<boolean> => {
        if (!currentUser) return false;
        const user = users.find(u => u.id === currentUser.id);
        if (!user || user.walletBalance < amount || amount < 100) return false;

        try {
            const newBalance = user.walletBalance - amount;
            await updateUserDocument(currentUser.id, { walletBalance: newBalance });
            
            await addWithdrawalRequestToFirestore({
                userId: currentUser.id, 
                userName: currentUser.name, 
                amount, 
                upiId,
                status: WithdrawalRequestStatus.PENDING
            });
            
            await addTransaction(currentUser.id, 'WITHDRAWAL', amount, `Withdrawal to UPI: ${upiId}`);
            return true;
        } catch (error) {
            console.error('Error requesting withdrawal:', error);
            return false;
        }
    }, [currentUser, users, addTransaction]);

    const approveWithdrawal = useCallback(async (requestId: string) => {
        try {
            await updateWithdrawalRequestInFirestore(requestId, { status: WithdrawalRequestStatus.PROCESSED });
        } catch (error) {
            console.error('Error approving withdrawal:', error);
        }
    }, []);

    const rejectWithdrawal = useCallback(async (requestId: string) => {
        const request = withdrawalRequests.find(r => r.id === requestId);
        if (!request || request.status !== WithdrawalRequestStatus.PENDING) return;
        
        try {
            const user = users.find(u => u.id === request.userId);
            if (user) {
                await updateUserDocument(request.userId, { walletBalance: user.walletBalance + request.amount });
            }

            await addTransaction(request.userId, 'CREDIT', request.amount, 'Refund for rejected withdrawal request.');
            await updateWithdrawalRequestInFirestore(requestId, { status: WithdrawalRequestStatus.REJECTED });
        } catch (error) {
            console.error('Error rejecting withdrawal:', error);
        }
    }, [withdrawalRequests, users, addTransaction]);
    
    // --- Admin-specific Functions ---
    const manualTopUp = async (phone: string, amount: number) => { return false };
    
    const setPlatformFee = async (fee: number) => { 
        if (fee >= 0 && fee <= 1) {
            try {
                await updatePlatformConfigInFirestore({ fee });
                setPlatformConfig(p => ({...p, fee}));
            } catch (error) {
                console.error('Error updating platform fee:', error);
            }
        }
    };
    
    const setOfferBarText = async (text: string) => { 
        try {
            await updatePlatformConfigInFirestore({ offerBarText: text });
            setPlatformConfig(p => ({...p, offerBarText: text}));
        } catch (error) {
            console.error('Error updating offer bar text:', error);
        }
    };
    
    const deleteUser = async (userId: string) => { 
        try {
            await deleteUserDocument(userId);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    
    const addCoupon = async (couponData: Omit<Coupon, 'id'>) => { 
        try {
            await addCouponToFirestore(couponData);
        } catch (error) {
            console.error('Error adding coupon:', error);
        }
    };
    
    const updateCoupon = async (couponId: string, updates: Partial<Coupon>) => { 
        try {
            await updateCouponInFirestore(couponId, updates);
        } catch (error) {
            console.error('Error updating coupon:', error);
        }
    };
    
    const deleteCoupon = async (couponId: string) => { 
        try {
            await deleteCouponFromFirestore(couponId);
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    // --- Expired Gigs Effect ---
    useEffect(() => {
        if (!currentUser?.isAdmin) return; 
        const interval = setInterval(() => {
            const now = new Date();
            let gigsToExpire: Gig[] = [];

            setGigs(prevGigs => {
                const stillValidGigs = prevGigs.filter(g => {
                    const isExpired = g.status === 'OPEN' && g.deliveryDeadline.getTime() < now.getTime();
                    if(isExpired) gigsToExpire.push(g);
                    return !isExpired;
                });
                if(gigsToExpire.length > 0) {
                     return [...stillValidGigs, ...gigsToExpire.map(g => ({...g, status: GigStatus.EXPIRED}))];
                }
                return prevGigs;
            });
            
            if (gigsToExpire.length > 0) {
                setUsers(prevUsers => {
                    const usersToRefund = gigsToExpire.reduce((acc, gig) => {
                        acc[gig.requester.id] = (acc[gig.requester.id] || 0) + gig.price;
                        addTransaction(gig.requester.id, 'CREDIT', gig.price, `Refund for expired gig: ${gig.parcelInfo}`, gig.id);
                        return acc;
                    }, {} as {[key: string]: number});
                    
                    const newUsers = prevUsers.map(u => {
                        if(usersToRefund[u.id]) {
                            return {...u, walletBalance: u.walletBalance + usersToRefund[u.id]};
                        }
                        return u;
                    });
                    
                    const updatedCurrentUser = newUsers.find(u => u.id === currentUser.id);
                    if(updatedCurrentUser) updateUser(updatedCurrentUser);
                    
                    return newUsers;
                });
            }

        }, 60000); 

        return () => clearInterval(interval);
    }, [currentUser?.isAdmin, addTransaction, updateUser]);

    const appContextValue: AppContextType = useMemo(() => ({
        currentUser, isAuthLoading, users, gigs, walletLoadRequests, withdrawalRequests, transactions, 
        platformFee: platformConfig.fee, offerBarText: platformConfig.offerBarText, coupons,
        isAuthModalOpen, openAuthModal, closeAuthModal,
        login, logout, signup, addGig, updateGig, deleteGig, requestWalletLoad,
        approveWalletLoad, rejectWalletLoad, requestWithdrawal, approveWithdrawal, rejectWithdrawal, 
        manualTopUp, setPlatformFee, setOfferBarText,
        deleteUser, addCoupon, updateCoupon, deleteCoupon
    }), [currentUser, isAuthLoading, users, gigs, walletLoadRequests, withdrawalRequests, transactions, platformConfig, coupons, isAuthModalOpen, openAuthModal, closeAuthModal, login, logout, signup, addGig, updateGig, deleteGig, requestWalletLoad, approveWalletLoad, rejectWalletLoad, requestWithdrawal, approveWithdrawal, rejectWithdrawal, manualTopUp, setPlatformFee, setOfferBarText, deleteUser, addCoupon, updateCoupon, deleteCoupon, addTransaction]);

    return (
        <AppContext.Provider value={appContextValue}>
            <HashRouter>
                <AuthModal />
                <Routes>
                    <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />

                    <Route path="*" element={
                        <div className="min-h-screen bg-brand-dark flex flex-col">
                            <OfferBar />
                            <Header />
                            <main className="flex-grow container mx-auto p-4 md:p-6">
                                <Routes>
                                    <Route path="/live" element={<LiveGigs />} />
                                    <Route path="/my-gigs" element={<ProtectedRoute><MyGigs /></ProtectedRoute>} />
                                    <Route path="/create" element={<ProtectedRoute><CreateGig /></ProtectedRoute>} />
                                    <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                                    <Route path="/refer-and-earn" element={<ProtectedRoute><ReferAndEarn /></ProtectedRoute>} />
                                    <Route path="/" element={<Navigate to="/live" replace />} />
                                    <Route path="*" element={<Navigate to="/live" replace />} />
                                </Routes>
                            </main>
                        </div>
                    } />
                </Routes>
            </HashRouter>
        </AppContext.Provider>
    );
};

export default App;