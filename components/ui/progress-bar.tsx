'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const ProgressBar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // When pathname or searchParams change, we consider the navigation "started"
        // But since we are already on the client, we show a brief progress bar
        // for perceived performance. 
        // Real router events in App Router are limited, but showing this on mount 
        // of a new page is very effective.
        
        setLoading(true);
        setProgress(30);

        const timer1 = setTimeout(() => setProgress(60), 100);
        const timer2 = setTimeout(() => setProgress(90), 400);
        const timer3 = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 300);
        }, 600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [pathname, searchParams]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[10000] h-[2px] bg-transparent pointer-events-none">
            <div 
                className="h-full bg-gold-500 transition-all duration-300 ease-out shadow-[0_0_8px_rgba(191,155,48,0.5)]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};
