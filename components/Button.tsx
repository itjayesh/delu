
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, fullWidth = false, variant = 'primary', ...props }) => {
    const baseClasses = 'px-4 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark';
    const variantClasses = {
        primary: 'bg-brand-primary hover:bg-brand-primary/90 focus:ring-brand-primary disabled:bg-brand-primary/50',
        secondary: 'bg-brand-dark-300 hover:bg-brand-dark-300/80 focus:ring-brand-dark-300 disabled:bg-brand-dark-300/50',
    };
    const widthClass = fullWidth ? 'w-full' : 'w-auto';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
