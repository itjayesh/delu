import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { StarIcon } from './icons';

interface FeedbackFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comments: string) => void;
    targetName: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ isOpen, onClose, onSubmit, targetName }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comments, setComments] = useState('');

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, comments);
        }
    };

    const handleClose = () => {
        setRating(0);
        setHoverRating(0);
        setComments('');
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Rate your experience with ${targetName}`}>
            <div className="space-y-6">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">How was your experience?</p>
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                aria-label={`Rate ${star} stars`}
                            >
                                <StarIcon className={`h-8 w-8 transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-600'}`} />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-300 mb-2">Additional Comments (Optional)</label>
                    <textarea
                        id="comments"
                        rows={3}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Tell us more..."
                        className="w-full bg-brand-dark-300 border border-brand-dark-300 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
                <Button onClick={handleSubmit} disabled={rating === 0} fullWidth>
                    Submit Feedback
                </Button>
            </div>
        </Modal>
    );
};

export default FeedbackForm;