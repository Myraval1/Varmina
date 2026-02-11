import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-stone-900/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6 animate-fade-in-up">
                {/* Gold Divider */}
                <div className="premium-divider w-12 mx-auto" />

                <h1 className="font-serif text-7xl md:text-8xl text-stone-200 dark:text-stone-800 tracking-widest select-none">
                    404
                </h1>
                <h2 className="text-sm text-stone-600 dark:text-stone-400 font-light uppercase tracking-[0.3em]">
                    Página no encontrada
                </h2>
                <p className="text-stone-400 dark:text-stone-500 max-w-sm mx-auto text-sm leading-relaxed">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>

                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 px-8 py-3.5 rounded-full hover:opacity-90 hover:-translate-y-0.5 transition-all uppercase tracking-[0.2em] text-xs font-bold shadow-lg hover:shadow-xl font-serif"
                    >
                        Volver al Inicio
                    </Link>
                </div>

                {/* Gold Divider */}
                <div className="premium-divider w-12 mx-auto !mt-8" />
            </div>
        </div>
    );
}
