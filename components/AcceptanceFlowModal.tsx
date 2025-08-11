

import React, { useState, useEffect, useCallback } from 'react';
import { Gig } from '../types';
import Modal from './Modal';
import Button from './Button';
import CameraCapture from './CameraCapture';
import { CameraIcon, LightningBoltIcon } from './icons';

interface AcceptanceFlowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selfieDataUrl: string) => void;
    gig: Gig;
}

const AcceptanceFlowModal: React.FC<AcceptanceFlowModalProps> = ({ isOpen, onClose, onConfirm, gig }) => {
    const [stage, setStage] = useState<'selfie' | 'confirm'>('selfie');
    const [selfie, setSelfie] = useState<string | null>(null);
    const [timer, setTimer] = useState(60);

    const handleClose = useCallback(() => {
        setStage('selfie');
        setSelfie(null);
        setTimer(60);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) {
            handleClose();
        }
    }, [isOpen, handleClose]);
    
    useEffect(() => {
        let interval: number | null = null;
        if (stage === 'confirm' && timer > 0) {
            interval = window.setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            handleClose();
        }
        return () => {
            if (interval) window.clearInterval(interval);
        };
    }, [stage, timer, handleClose]);

    const handleSelfieCapture = (imageDataUrl: string) => {
        setSelfie(imageDataUrl);
        setStage('confirm');
    };

    const handleFinalConfirm = () => {
        if (selfie) {
            onConfirm(selfie);
        }
    }

    const SelfieStage = () => (
        <div className="space-y-4 text-white">
            <p className="text-gray-300">Please take a quick selfie to verify your identity before accepting the gig.</p>
            <div className="flex flex-col items-center space-y-2">
                <CameraCapture onCapture={handleSelfieCapture} trigger={
                    <button type="button" className="w-full h-64 rounded-lg bg-brand-dark-300 flex items-center justify-center text-gray-400 hover:bg-brand-dark-300/80 transition-colors">
                        <div className="text-center">
                            <CameraIcon className="h-16 w-16 mx-auto" />
                            <p className="mt-2 font-semibold">Tap to open camera</p>
                        </div>
                    </button>
                }/>
            </div>
        </div>
    );

    const ConfirmStage = () => (
        <div className="space-y-4 text-white text-center">
            <img src={selfie!} alt="Selfie Preview" className="w-48 h-48 rounded-lg object-cover mx-auto mb-4 border-2 border-brand-primary" />
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 rounded-lg text-sm">
                <p className="font-bold">Important: Responsibility Notice</p>
                <p className="mt-2">Once accepted, this gig must be delivered on time. You are solely responsible for the safe and timely delivery of the parcel. Cancellations are not permitted after this step.</p>
                {gig.isUrgent && (
                    <div className="flex items-center justify-center gap-2 mt-3 font-bold text-yellow-200">
                        <LightningBoltIcon className="h-5 w-5" />
                        <span>This is an URGENT delivery and requires immediate action!</span>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center gap-4">
                <Button onClick={handleClose} variant="secondary">Cancel</Button>
                <Button onClick={handleFinalConfirm}>
                    {`Accept (${timer}s)`}
                </Button>
            </div>
        </div>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose} 
            title={stage === 'selfie' ? 'Confirm Your Identity' : 'Final Confirmation'}
        >
            {stage === 'selfie' && <SelfieStage />}
            {stage === 'confirm' && <ConfirmStage />}
        </Modal>
    );
};

export default AcceptanceFlowModal;