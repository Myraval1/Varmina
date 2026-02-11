
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children, variant = 'primary', size = 'md', isLoading, className = '', ...props
}) => {
    const base = "inline-flex items-center justify-center uppercase tracking-[0.2em] font-serif transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[#1A1A1A] text-white hover:bg-gold-500 active:bg-black",
        secondary: "bg-gold-400 text-white hover:bg-gold-500",
        outline: "border border-stone-200 text-stone-900 hover:border-stone-900 dark:border-stone-700 dark:text-stone-100",
        ghost: "text-stone-400 hover:text-stone-900 dark:text-stone-500 dark:hover:text-white transition-colors",
        danger: "text-red-500 hover:text-red-700 hover:bg-red-50 px-2 rounded-full transition-all",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-[10px]",
        md: "px-8 py-2.5 text-xs font-bold",
        lg: "px-10 py-3.5 text-sm font-bold",
    };

    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
            {children}
        </button>
    );
};
