
import React, { useState, useEffect } from 'react';
import { Gig, GigStatus } from '../types';
import Button from './Button';
import { RupeeIcon, ClockIcon, HomeIcon, UserIcon, CheckCircleIcon, LightningBoltIcon, ArchiveBoxIcon, DocumentTextIcon } from './icons';

interface GigCardProps {
    gig: Gig;
    onAction?: () => void;
    actionLabel?: string;
    showRequesterInfo?: boolean;
    platformFee?: number;
    showOtp?: boolean;
}

const GigStatusBadge: React.FC<{ status: GigStatus }> = ({ status }) => {
    const statusStyles = {
        [GigStatus.OPEN]: 'bg-green-500/20 text-green-300',
        [GigStatus.ACCEPTED]: 'bg-yellow-500/20 text-yellow-300',
        [GigStatus.COMPLETED]: 'bg-blue-500/20 text-blue-300',
        [GigStatus.EXPIRED]: 'bg-red-500/20 text-red-300',
    };

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-500/20 text-gray-300'}`}>
            {status}
        </span>
    );
};


const GigCard: React.FC<GigCardProps> = ({ gig, onAction, actionLabel, showRequesterInfo = false, platformFee = 0.2, showOtp = false }) => {
    
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (gig.status === GigStatus.COMPLETED) {
            setTimeLeft('Completed');
            return;
        }
        if (gig.status === GigStatus.EXPIRED) {
            setTimeLeft('Expired');
            return;
        }

        const deadline = new Date(gig.deliveryDeadline);

        const calculateTimeLeft = () => {
            const diff = deadline.getTime() - new Date().getTime();

            if (diff <= 0) {
                if (gig.status !== GigStatus.ACCEPTED) {
                    setTimeLeft('Deadline Passed');
                } else {
                    setTimeLeft('Overdue');
                }
                return;
            }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hours > 0) {
                setTimeLeft(`in ${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`in ${minutes}m`);
            }
        };

        calculateTimeLeft();
        const intervalId = setInterval(calculateTimeLeft, 30000); // Update every 30s

        return () => clearInterval(intervalId);
    }, [gig.deliveryDeadline, gig.status]);
    
    const timeAgo = (date: Date): string => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const isActionable = onAction && actionLabel && (gig.status === GigStatus.OPEN || (gig.status === GigStatus.ACCEPTED && showRequesterInfo));

    return (
        <div className={`bg-brand-dark-200 rounded-xl shadow-lg p-5 flex flex-col justify-between transition-transform hover:scale-105 duration-300 ${gig.status === GigStatus.EXPIRED ? 'opacity-60' : ''}`}>
            <div>
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white pr-2 flex items-center gap-2">
                        {gig.isUrgent && <LightningBoltIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />}
                        {gig.parcelInfo}
                    </h3>
                    <GigStatusBadge status={gig.status} />
                </div>
                
                <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                        <HomeIcon className="h-5 w-5 text-brand-primary" />
                        <span>From <strong>{gig.pickupBlock}</strong> to <strong>{gig.destinationBlock}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ArchiveBoxIcon className="h-5 w-5 text-brand-primary" />
                        <span>Size: <strong>{gig.size}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-brand-primary" />
                        <span>Deliver by <strong>{new Date(gig.deliveryDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> ({timeLeft})</span>
                    </div>
                    
                     {gig.note && showRequesterInfo && (
                        <div className="flex items-start space-x-2 pt-2 border-t border-brand-dark-300">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                            <p className="text-gray-400">Note: <span className="text-gray-300">{gig.note}</span></p>
                        </div>
                    )}

                    {gig.status !== GigStatus.OPEN && gig.deliverer && (
                        <div className="flex items-center space-x-2 pt-2 border-t border-brand-dark-300">
                             <UserIcon className="h-5 w-5 text-brand-secondary" />
                            <span className="font-semibold">{gig.status === GigStatus.ACCEPTED ? 'Deliverer:' : 'Delivered by:'} <strong>{gig.deliverer.name}</strong></span>
                        </div>
                    )}
                    {showOtp && (
                        <div className="space-y-2 pt-2 border-t border-brand-dark-300">
                            <h4 className="text-sm font-semibold text-gray-400">Collection OTP</h4>
                            <p className="text-2xl font-bold tracking-widest text-brand-secondary bg-brand-dark p-2 mt-1 rounded-md text-center">{gig.otp}</p>
                        </div>
                    )}
                     {gig.status === GigStatus.COMPLETED && (
                        <div className="flex items-center space-x-2 text-brand-secondary">
                             <CheckCircleIcon className="h-5 w-5" />
                            <span className="font-semibold">Completed</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5">
                 {gig.status !== GigStatus.EXPIRED && (
                    <div className="flex items-center justify-between bg-brand-dark-300/50 p-3 rounded-lg mb-4">
                        <span className="text-gray-400 font-medium">Payout</span>
                        <div className="flex items-center space-x-1 text-brand-secondary text-xl font-bold">
                            <RupeeIcon className="h-5 w-5" />
                            <span>{(gig.price * (1-platformFee)).toFixed(0)}</span>
                        </div>
                    </div>
                 )}
                {isActionable && (
                    <Button onClick={onAction} fullWidth>
                        {actionLabel}
                    </Button>
                )}
                 <p className="text-xs text-gray-500 text-center mt-3">
                    Posted {timeAgo(gig.postedAt)}
                    {showRequesterInfo && ` by ${gig.requester.name}`}
                </p>
            </div>
        </div>
    );
};

export default GigCard;