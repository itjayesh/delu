
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext, AppContextType } from '../context/AppContext';
import { User, Gig, GigStatus, WalletLoadRequest, Transaction, TransactionType, Coupon, WithdrawalRequest, GigUser, WalletRequestStatus, WithdrawalRequestStatus } from '../types';
import { MOCK_USERS, MOCK_GIGS, MOCK_COUPONS, MOCK_PLATFORM_CONFIG } from '../mockData';

import ProtectedRoute from './ProtectedRoute';
import RequireAdmin from './RequireAdmin';
import Header from './Header';
import OfferBar from './OfferBar';
import LiveGigs from '../pages/LiveGigs';
import MyGigs from '../pages/MyGigs';
import CreateGig from '../pages/CreateGig';
import AuthModal from './AuthModal';
import Wallet from '../pages/Wallet';
import ReferAndEarn from '../pages/ReferAndEarn';
import AdminDashboard from '../pages/admin';

// Custom hook for local authentication simulation
const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for a logged-in user
        setTimeout(() => {
            setAuthLoading(false);
        }, 500);
    }, []);

    const updateUser = (user: User | null) => {
        setCurrentUser(user);
    }

    return { currentUser, updateUser, isAuthLoading };
}

const App: React.FC = () => {
    const { currentUser, updateUser, isAuthLoading } = useAuth();
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [gigs, setGigs] = useState<Gig[]>(MOCK_GIGS);
    const [walletLoadRequests, setWalletLoadRequests] = useState<WalletLoadRequest[]>([]);
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
    const [platformConfig, setPlatformConfig] = useState(MOCK_PLATFORM_CONFIG);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
    const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

    // --- Core Functions (Local State Version) ---
    
    const addTransaction = useCallback((userId: string, type: TransactionType, amount: number, description: string, relatedGigId?: string) => {
        const newTransaction: Transaction = {
            id: `trans_${Date.now()}_${Math.random()}`,
            userId,
            type,
            amount,
            description,
            relatedGigId,
            timestamp: new Date(),
        };
        setTransactions(prev => [newTransaction, ...prev].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
    }, []);
    
    const login = useCallback(async (email: string, password: string): Promise<User> => {
        // In a local demo, we ignore password
        const user = users.find(u => u.email === email);
        if (user) {
            updateUser(user);
            return user;
        } else {
            throw new Error("User not found. Try user@delu.live or admin@delu.live");
        }
    }, [users, updateUser]);

    const logout = useCallback(async () => {
        updateUser(null);
    }, [updateUser]);

    const signup = useCallback(async (userData: Omit<User, 'id' | 'rating' | 'deliveriesCompleted' | 'walletBalance' | 'isAdmin' | 'referralCode' | 'firstRechargeCompleted' | 'usedCouponCodes' | 'createdAt'>, password: string, referredByCode?: string) => {
        const newUser: User = {
            id: `user_${Date.now()}`,
            ...userData,
            createdAt: new Date(),
            rating: 5.0,
            deliveriesCompleted: 0,
            walletBalance: 0,
            isAdmin: false,
            referralCode: `${userData.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.random().toString(36).substring(2, 6)}`.toUpperCase(),
            referredByCode: referredByCode?.trim() || undefined,
            firstRechargeCompleted: false,
            usedCouponCodes: {},
        };
        setUsers(prev => [...prev, newUser]);
        updateUser(newUser); // Automatically log in new user
    }, [updateUser]);

    const addGig = useCallback(async (gigData: Omit<Gig, 'id' | 'postedAt' | 'requester' | 'status' | 'otp' | 'acceptanceSelfieUrl'>): Promise<boolean> => {
        if (!currentUser) { openAuthModal(); return false; };
        
        const userInDb = users.find(u => u.id === currentUser.id);
        if(!userInDb || userInDb.walletBalance < gigData.price) return false;
        
        // 1. Deduct from requester's wallet
        const newBalance = userInDb.walletBalance - gigData.price;
        const updatedUser = { ...userInDb, walletBalance: newBalance };
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
        updateUser(updatedUser);

        // 2. Create the new gig
        const requesterInfo: GigUser = { id: currentUser.id, name: currentUser.name, phone: currentUser.phone, email: currentUser.email };
        const newGig: Gig = {
            id: `gig_${Date.now()}`,
            ...gigData,
            requester: requesterInfo,
            postedAt: new Date(),
            status: GigStatus.OPEN,
            otp: Math.floor(100000 + Math.random() * 900000).toString(),
        };
        setGigs(prev => [newGig, ...prev]);
        
        // 3. Add transaction record
        addTransaction(currentUser.id, 'DEBIT', gigData.price, `Gig created: ${gigData.parcelInfo}`, newGig.id);
        return true;
    }, [currentUser, openAuthModal, users, addTransaction, updateUser]);
    
    const deleteGig = useCallback(async (gigId: string) => {
        const gigData = gigs.find(g => g.id === gigId);
        if (!gigData) return;

        if (gigData.status === GigStatus.OPEN) {
            // Refund requester
            let userToUpdate: User | undefined;
            setUsers(prevUsers => {
                const newUsers = [...prevUsers];
                const userIndex = newUsers.findIndex(u => u.id === gigData.requester.id);
                if (userIndex > -1) {
                    const user = newUsers[userIndex];
                    user.walletBalance += gigData.price;
                    userToUpdate = user;
                }
                return newUsers;
            });
            
            if (userToUpdate && currentUser?.id === userToUpdate.id) {
                 updateUser(userToUpdate);
            }

            addTransaction(gigData.requester.id, 'CREDIT', gigData.price, `Refund for deleted gig: ${gigData.parcelInfo}`, gigId);
            setGigs(prev => prev.filter(g => g.id !== gigId));
        } else {
            console.warn("Attempted to delete a non-open gig.");
        }
    }, [gigs, currentUser, addTransaction, updateUser]);

    const updateGig = useCallback(async (gigId: string, updates: Partial<Gig>) => {
        if (updates.status === GigStatus.COMPLETED) {
            const currentGig = gigs.find(g => g.id === gigId);
            if(!currentGig || currentGig.status === GigStatus.COMPLETED || !currentGig.deliverer) return;

            let delivererToUpdate: User | undefined;
            setUsers(prevUsers => {
                 const newUsers = [...prevUsers];
                 const delivererIndex = newUsers.findIndex(u => u.id === currentGig.deliverer!.id);
                 if (delivererIndex > -1) {
                    const deliverer = newUsers[delivererIndex];
                    const payout = currentGig.price * (1 - platformConfig.fee);
                    deliverer.walletBalance += payout;
                    deliverer.deliveriesCompleted += 1;
                    addTransaction(currentGig.deliverer!.id, 'PAYOUT', payout, `Payout for gig: ${currentGig.parcelInfo}`, gigId);
                    delivererToUpdate = deliverer;
                 }
                 return newUsers;
            });

            if (delivererToUpdate && currentUser?.id === delivererToUpdate.id) {
                updateUser(delivererToUpdate);
            }
        }

        setGigs(prev => prev.map(g => g.id === gigId ? { ...g, ...updates } : g));

    }, [gigs, platformConfig.fee, addTransaction, currentUser, updateUser]);

    const requestWalletLoad = useCallback(async (requestData: Omit<WalletLoadRequest, 'id'|'status'|'requestedAt'|'userId'|'userName'>, couponCode?: string) => {
        if(!currentUser) return;
        const newRequest: WalletLoadRequest = {
            id: `req_${Date.now()}`,
            ...requestData,
            userId: currentUser.id,
            userName: currentUser.name,
            status: WalletRequestStatus.PENDING,
            requestedAt: new Date(),
            couponCode: couponCode?.trim().toUpperCase() || undefined,
        };
        setWalletLoadRequests(prev => [newRequest, ...prev]);
    }, [currentUser]);

    const approveWalletLoad = useCallback(async (requestId: string) => {
        const request = walletLoadRequests.find(r => r.id === requestId);
        if (!request || request.status !== WalletRequestStatus.PENDING) return;
        
        let finalUsers = [...users];
        const userIndex = finalUsers.findIndex(u => u.id === request.userId);
        if (userIndex === -1) return;

        let userToUpdate = { ...finalUsers[userIndex] };
        
        let totalBonus = 0, referrerReward = 0, referrerId: string | null = null;
        const transactionDescriptions: string[] = [];
        
        if (request.couponCode) {
            const coupon = coupons.find(c => c.code === request.couponCode && c.isActive);
            if (coupon) {
                const timesUsed = userToUpdate.usedCouponCodes[coupon.code] || 0;
                if (timesUsed < coupon.maxUsesPerUser) {
                    totalBonus += request.amount * coupon.bonusPercentage;
                    transactionDescriptions.push(`${coupon.bonusPercentage * 100}% bonus from ${coupon.code}`);
                    userToUpdate.usedCouponCodes = {...userToUpdate.usedCouponCodes, [coupon.code]: timesUsed + 1};
                }
            }
        }

        if (request.amount >= 100 && !userToUpdate.firstRechargeCompleted && userToUpdate.referredByCode) {
            const referrer = users.find(u => u.referralCode === userToUpdate.referredByCode);
            if (referrer) {
                referrerId = referrer.id;
                referrerReward = 10;
                totalBonus += request.amount * 0.05;
                transactionDescriptions.push('5% First Recharge Referral Bonus');
                userToUpdate.firstRechargeCompleted = true;
            }
        }
        
        const finalBalanceAddition = request.amount + totalBonus;
        userToUpdate.walletBalance += finalBalanceAddition;
        
        if (totalBonus > 0) addTransaction(userToUpdate.id, 'CREDIT', totalBonus, transactionDescriptions.join(' & '));
        addTransaction(userToUpdate.id, 'TOPUP', request.amount, `Wallet load approved (UTR: ${request.utr})`);
        
        finalUsers[userIndex] = userToUpdate;

        if (referrerId) {
            const referrerIndex = finalUsers.findIndex(u => u.id === referrerId);
            if (referrerIndex > -1) {
                const referrer = {...finalUsers[referrerIndex]};
                referrer.walletBalance += referrerReward;
                finalUsers[referrerIndex] = referrer;
                addTransaction(referrerId, 'CREDIT', referrerReward, `Referral reward for ${userToUpdate.name}`);
            }
        }
        
        setUsers(finalUsers);
        if (currentUser?.id === userToUpdate.id) updateUser(userToUpdate);

        setWalletLoadRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: WalletRequestStatus.APPROVED } : r));

    }, [walletLoadRequests, users, coupons, currentUser, addTransaction, updateUser]);

    const rejectWalletLoad = useCallback(async (requestId: string) => {
        setWalletLoadRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: WalletRequestStatus.REJECTED } : r));
    }, []);
    
    const requestWithdrawal = useCallback(async (amount: number, upiId: string): Promise<boolean> => {
        if (!currentUser) return false;
        const user = users.find(u => u.id === currentUser.id);
        if (!user || user.walletBalance < amount || amount < 100) return false;

        const newBalance = user.walletBalance - amount;
        const updatedUser = { ...user, walletBalance: newBalance };
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        updateUser(updatedUser);
        
        const newRequest: WithdrawalRequest = {
            id: `wd_${Date.now()}`,
            userId: currentUser.id, userName: currentUser.name, amount, upiId,
            status: WithdrawalRequestStatus.PENDING, requestedAt: new Date()
        };
        setWithdrawalRequests(prev => [newRequest, ...prev]);
        addTransaction(currentUser.id, 'WITHDRAWAL', amount, `Withdrawal to UPI: ${upiId}`);
        return true;
    }, [currentUser, users, addTransaction, updateUser]);

    const approveWithdrawal = useCallback(async (requestId: string) => {
        setWithdrawalRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: WithdrawalRequestStatus.PROCESSED } : r));
    }, []);

    const rejectWithdrawal = useCallback(async (requestId: string) => {
        const request = withdrawalRequests.find(r => r.id === requestId);
        if (!request || request.status !== WithdrawalRequestStatus.PENDING) return;
        
        let userToUpdate : User | undefined;
        setUsers(prev => prev.map(u => {
            if (u.id === request.userId) {
                userToUpdate = {...u, walletBalance: u.walletBalance + request.amount};
                return userToUpdate;
            }
            return u;
        }));
        if (userToUpdate && currentUser?.id === userToUpdate.id) updateUser(userToUpdate);

        addTransaction(request.userId, 'CREDIT', request.amount, 'Refund for rejected withdrawal request.');
        setWithdrawalRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: WithdrawalRequestStatus.REJECTED } : r));
    }, [withdrawalRequests, users, currentUser, addTransaction, updateUser]);
    
    // --- Admin-specific Functions ---
    const manualTopUp = async (phone: string, amount: number) => { return false };
    const setPlatformFee = async (fee: number) => { if (fee >= 0 && fee <= 1) setPlatformConfig(p => ({...p, fee})) };
    const setOfferBarText = async (text: string) => { setPlatformConfig(p => ({...p, offerBarText: text})) };
    const deleteUser = async (userId: string) => { setUsers(prev => prev.filter(u => u.id !== userId)) };
    const addCoupon = async (couponData: Omit<Coupon, 'id'>) => { setCoupons(prev => [{...couponData, id: `coupon_${Date.now()}`}, ...prev]); };
    const updateCoupon = async (couponId: string, updates: Partial<Coupon>) => { setCoupons(prev => prev.map(c => c.id === couponId ? {...c, ...updates} : c)); };
    const deleteCoupon = async (couponId: string) => { setCoupons(prev => prev.filter(c => c.id !== couponId)) };

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
                    <Route
                        path="/admin"
                        element={
                            <RequireAdmin>
                                <AdminDashboard />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="*"
                        element={
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
                        }
                    />
                </Routes>
            </HashRouter>
        </AppContext.Provider>
    );
};

export default App;