'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { pageLayoutService } from '@/services/pageLayoutService';

// Lazy load both components — only the one used gets bundled for the client
const SectionRenderer = dynamic(() => import('@/components/public/section-renderer').then(m => ({ default: m.SectionRenderer })), {
    loading: () => (
        <div className="w-full min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
    ),
});

const PublicCatalog = dynamic(() => import('@/components/public/public-catalog').then(m => ({ default: m.PublicCatalog })), {
    loading: () => (
        <div className="w-full min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
    ),
});

export default function Page() {
    const [hasSections, setHasSections] = useState<boolean | null>(null);

    useEffect(() => {
        const check = async () => {
            try {
                const sections = await pageLayoutService.getSections('home');
                setHasSections(sections.length > 0);
            } catch {
                setHasSections(false);
            }
        };
        check();
    }, []);

    // Loading state
    if (hasSections === null) {
        return (
            <div className="w-full min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Section-based rendering if sections exist
    if (hasSections) {
        return <SectionRenderer />;
    }

    // Fallback to original hardcoded catalog
    return <PublicCatalog />;
}
