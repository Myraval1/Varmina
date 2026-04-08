'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white dark:bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-8 animate-fade-in">
                <div className="space-y-4">
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-white uppercase tracking-widest">
                        Algo salió mal
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                        Lo sentimos, ha ocurrido un error inesperado. Hemos sido notificados y estamos trabajando para solucionarlo.
                    </p>
                    {error.digest && (
                        <p className="text-[10px] text-stone-300 dark:text-stone-700 font-mono">
                            ID Error: {error.digest}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => reset()}
                        className="flex items-center gap-2 px-8 py-4 uppercase tracking-widest text-xs font-bold"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Reintentar
                    </Button>
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-2 px-8 py-4 uppercase tracking-widest text-xs font-bold"
                        >
                            <Home className="w-4 h-4" />
                            Volver al Inicio
                        </Button>
                    </Link>
                </div>

                <div className="pt-12">
                    <div className="w-12 h-[1px] bg-gold-500 mx-auto opacity-50" />
                    <p className="mt-4 font-serif text-stone-400 dark:text-stone-600 text-xs italic">
                        Varmina
                    </p>
                </div>
            </div>
        </div>
    );
}
