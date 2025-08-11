import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from './Modal';
import Button from './Button';
import { RupeeIcon } from './icons';

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
    const context = useContext(AppContext);
    const [amount, setAmount] = useState<number | ''>('');
    const [upiId, setUpiId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const currentUser = context?.currentUser;
    const balance = currentUser?.walletBalance || 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!amount || !upiId) {
            setError('Please fill out all fields.');
            return;
        }
        if (amount < 100) {
            setError('Minimum withdrawal amount is ₹100.');
            return;
        }
        if (amount > balance) {
            setError('Withdrawal amount cannot exceed your wallet balance.');
            return;
        }

        const success = context?.requestWithdrawal(amount, upiId);

        if (success) {
            setSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 4000);
        } else {
            setError('An error occurred. Please try again.');
        }
    };
    
    const handleClose = () => {
        setAmount('');
        setUpiId('');
        setError('');
        setSuccess(false);
        onClose();
    }
    
    if (success) {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} title="Request Submitted">
                <div className="text-center p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-green-400">Thank You!</h3>
                    <p className="text-gray-300">Your withdrawal request has been submitted. It will be processed within 24-48 hours.</p>
                    <Button onClick={handleClose}>Close</Button>
                </div>
            </Modal>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Withdraw Money">
            <div className="space-y-4">
                <div className="bg-brand-dark-300 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Current Balance</p>
                    <p className="text-2xl font-bold text-white">₹{balance.toFixed(2)}</p>
                </div>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Amount to Withdraw (INR)</label>
                        <div className="relative">
                           <RupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                           <input 
                                type="number" 
                                placeholder="Min. ₹100" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} 
                                className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                           />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Your UPI ID</label>
                        <input 
                            type="text" 
                            placeholder="e.g., yourname@okbank" 
                            value={upiId} 
                            onChange={e => setUpiId(e.target.value)} 
                            className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                        />
                    </div>
                    <Button type="submit" fullWidth>Request Withdrawal</Button>
                </form>
            </div>
        </Modal>
    );
};

export default WithdrawModal;