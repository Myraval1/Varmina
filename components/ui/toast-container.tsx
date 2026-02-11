'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Check, AlertCircle, Info } from 'lucide-react';

export const ToastContainer = () => {
    const { toasts, removeToast } = useStore();

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast, i) => (
                <ToastItem
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    onRemove={removeToast}
                    index={i}
                />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    onRemove: (id: string) => void;
    index: number;
}> = ({ id, type, message, onRemove, index }) => {
    // Auto-dismiss after 4 seconds
    useEffect(() => {
        const timer = setTimeout(() => onRemove(id), 4000);
        return () => clearTimeout(timer);
    }, [id, onRemove]);

    const colors = {
        success: 'border-l-green-500 bg-white dark:bg-stone-900',
        error: 'border-l-red-500 bg-white dark:bg-stone-900',
        info: 'border-l-gold-400 bg-[#1A1A1A]',
    };

    const icons = {
        success: <Check className="w-4 h-4 text-green-500" />,
        error: <AlertCircle className="w-4 h-4 text-red-500" />,
        info: <Info className="w-4 h-4 text-gold-400" />,
    };

    return (
        <div
            className={`
                pointer-events-auto flex items-center gap-4 px-6 py-4 
                shadow-2xl min-w-[320px] max-w-[420px] border-l-2 rounded-r-lg
                animate-slide-in-right
                ${colors[type]}
                ${type === 'info' ? 'text-white' : 'text-stone-800 dark:text-stone-200'}
            `}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex-shrink-0">{icons[type]}</div>
            <p className="text-[11px] font-bold uppercase tracking-wider flex-1 leading-relaxed">
                {message}
            </p>
            <button
                onClick={() => onRemove(id)}
                className="p-1 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full transition-colors opacity-50 hover:opacity-100"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
