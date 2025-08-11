
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const OfferBar: React.FC = () => {
    const context = useContext(AppContext);
    const offerText = context?.offerBarText || '';
    const offers = offerText.split(';;').map(s => s.trim()).filter(Boolean);

    if (offers.length === 0) return null;

    return (
        <div className="bg-brand-secondary text-brand-dark font-bold overflow-hidden whitespace-nowrap relative py-2">
            <div className="inline-block animate-marquee">
                {offers.map((offer, index) => (
                    <span key={index} className="mx-8">{offer}</span>
                ))}
            </div>
            <div className="inline-block animate-marquee" aria-hidden="true">
                {offers.map((offer, index) => (
                    <span key={`dup-${index}`} className="mx-8">{offer}</span>
                ))}
            </div>
        </div>
    );
};

export default OfferBar;