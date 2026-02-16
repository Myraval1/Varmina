'use client';

import React from 'react';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-brand-cream dark:bg-stone-950 flex flex-col items-center justify-center gap-8 transition-all animate-fade-in">
            {/* Logo ring */}
            <div className="relative">
                <div className="w-20 h-20 border border-gold-400/40 rounded-full animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/assets/no bg png.png"
                        alt="Loading"
                        className="w-10 h-10 object-contain opacity-80"
                    />
                </div>
            </div>

            {/* Brand Text */}
            <div className="flex flex-col items-center gap-3">
                <h2 className="font-serif text-xl md:text-2xl tracking-[0.5em] text-stone-400 dark:text-stone-600 uppercase select-none">
                    Varmina
                </h2>
                <div className="premium-divider w-8 opacity-50" />
                <p className="text-[9px] uppercase tracking-[0.3em] text-stone-300 dark:text-stone-700 font-bold animate-pulse">
                    Cargando Colección
                </p>
            </div>
        </div>
    );
};
