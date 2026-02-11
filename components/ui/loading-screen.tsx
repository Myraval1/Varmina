'use client';

import React from 'react';

export const LoadingScreen: React.FC = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-50 dark:bg-stone-950 flex-col gap-8">
        {/* Animated Logo Ring */}
        <div className="relative animate-fade-in">
            <div className="w-20 h-20 border border-stone-200 dark:border-stone-800 rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-t-2 border-gold-400 rounded-full animate-spin" />
            <div className="absolute inset-2 w-16 h-16 border-b border-gold-300/30 rounded-full animate-spin-slow" />
        </div>

        {/* Brand */}
        <div className="text-center space-y-3 animate-fade-in-up">
            <h2 className="font-serif text-xl tracking-[0.4em] text-stone-900 dark:text-gold-200 uppercase">
                Varmina
            </h2>
            <div className="premium-divider w-16 mx-auto" />
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold">
                Cargando experiencia
            </p>
        </div>
    </div>
);
