
import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LogoIcon } from './icons';
import Button from './Button';

const Header: React.FC = () => {
    const context = useContext(AppContext);
    const { currentUser, openAuthModal, logout } = context ?? {};
    const navigate = useNavigate();

    const handleLogout = () => {
        if (logout) {
            logout();
        }
        navigate('/live', { replace: true });
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-brand-dark-300 hover:text-white'
        }`;
        
    const AdminNav = () => (
        <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/admin" className={navLinkClasses}>Admin Dashboard</NavLink>
            </div>
        </div>
    );

    const UserNav = () => (
        <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/live" className={navLinkClasses}>Live Gigs</NavLink>
                <NavLink to="/my-gigs" className={navLinkClasses}>My Gigs</NavLink>
                <NavLink to="/create" className={navLinkClasses}>Create Gig</NavLink>
                <NavLink to="/wallet" className={navLinkClasses}>Wallet</NavLink>
                <NavLink to="/refer-and-earn" className={navLinkClasses}>Refer & Earn</NavLink>
            </div>
        </div>
    );
    
    const MobileNav = () => (
        <div className="md:hidden flex justify-around p-2 bg-brand-dark-300">
            {currentUser?.isAdmin ? (
                <NavLink to="/admin" className={navLinkClasses}>Admin</NavLink>
            ) : (
                <>
                    <NavLink to="/live" className={navLinkClasses}>Live Gigs</NavLink>
                    <NavLink to="/my-gigs" className={navLinkClasses}>My Gigs</NavLink>
                    <NavLink to="/create" className={navLinkClasses}>Create Gig</NavLink>
                    <NavLink to="/wallet" className={navLinkClasses}>Wallet</NavLink>
                    <NavLink to="/refer-and-earn" className={navLinkClasses}>Refer</NavLink>
                </>
            )}
        </div>
    );

    return (
        <header className="bg-brand-dark-200 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to={currentUser?.isAdmin ? "/admin" : "/live"} className="flex-shrink-0 flex items-center gap-2">
                            <LogoIcon className="h-8 w-auto text-brand-primary" />
                            <span className="font-bold text-xl text-white">UniHive</span>
                        </Link>
                        {currentUser && (currentUser.isAdmin ? <AdminNav /> : <UserNav />)}
                    </div>
                    <div className="flex items-center">
                        {currentUser ? (
                            <div className="flex items-center">
                                <div className="text-right mr-3 hidden sm:block">
                                    <div className="text-white text-sm font-medium">{currentUser.name}</div>
                                    <div className="text-xs text-brand-secondary font-semibold">₹{currentUser.walletBalance.toFixed(2)}</div>
                                </div>
                                <img className="h-9 w-9 rounded-full object-cover" src={currentUser.profilePhotoUrl} alt="User" />
                                <button
                                    onClick={handleLogout}
                                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-brand-dark-300 hover:text-white transition-colors"
                                    aria-label="Logout"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                             <Button onClick={openAuthModal}>Login / Sign Up</Button>
                        )}
                    </div>
                </div>
                {/* Mobile Menu */}
                {currentUser && <MobileNav />}
            </nav>
        </header>
    );
};

export default Header;
