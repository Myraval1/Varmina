'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children, variant = 'primary', size = 'md', isLoading, className = '', disabled, ...props
}) => {
    const base = "inline-flex items-center justify-center uppercase tracking-[0.2em] font-serif transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2";

    const variants: Record<string, string> = {
        primary: "bg-brand-dark text-white hover:bg-gold-500 active:bg-black shadow-sm hover:shadow-lg",
        secondary: "bg-gold-400 text-white hover:bg-gold-500 shadow-sm hover:shadow-gold-400/20",
        outline: "border border-stone-200 text-stone-900 hover:border-stone-900 dark:border-stone-700 dark:text-stone-100 dark:hover:border-stone-400",
        ghost: "text-stone-400 hover:text-stone-900 dark:text-stone-500 dark:hover:text-white",
        danger: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all",
        success: "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-green-500/20",
    };

    const sizes: Record<string, string> = {
        sm: "px-3 py-1.5 text-[10px]",
        md: "px-8 py-2.5 text-xs font-bold",
        lg: "px-10 py-3.5 text-sm font-bold",
        icon: "p-2",
    };

    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
            {children}
        </button>
    );
};
