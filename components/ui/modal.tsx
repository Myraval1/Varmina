'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-[95vw]'
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className={`relative bg-white dark:bg-stone-900 w-full ${sizeClasses[size]} max-h-[100vh] md:max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in rounded-t-3xl md:rounded-2xl`}
            >
                {title ? (
                    <div className="flex items-center justify-between p-6 md:p-8 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white dark:bg-stone-900 z-10 rounded-t-3xl md:rounded-t-2xl">
                        <h3 className="font-serif text-xl md:text-2xl uppercase tracking-[0.1em] text-stone-900 dark:text-white">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
                            aria-label="Cerrar diálogo"
                        >
                            <X className="w-5 h-5 text-stone-400" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-[40] p-2 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-stone-800 rounded-full transition-colors border border-stone-100 dark:border-stone-800 shadow-sm"
                        aria-label="Cerrar diálogo"
                    >
                        <X className="w-4 h-4 text-stone-900 dark:text-white" />
                    </button>
                )}
                <div className={title ? "p-6 md:p-8" : "p-0"}>
                    {children}
                </div>
            </div>
        </div>
    );
};
