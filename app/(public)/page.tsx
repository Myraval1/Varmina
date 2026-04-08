'use client';

import { Suspense, useState, useEffect } from 'react';
import { SectionRenderer } from '@/components/public/section-renderer';
import { PublicCatalog } from '@/components/public/public-catalog';
import { pageLayoutService, PageSection } from '@/services/pageLayoutService';

// Module-level cache for sections (survives component re-mounts)
let sectionsCache: { data: PageSection[]; timestamp: number } | null = null;
const SECTIONS_CACHE_TTL = 120000; // 2 minutes

export default function Page() {
    const [sections, setSections] = useState<PageSection[] | null>(() => {
        // Initialize from cache instantly
        if (sectionsCache && Date.now() - sectionsCache.timestamp < SECTIONS_CACHE_TTL) {
            return sectionsCache.data;
        }
        return null;
    });

    useEffect(() => {
        // If cache is fresh, skip fetch
        if (sectionsCache && Date.now() - sectionsCache.timestamp < SECTIONS_CACHE_TTL) {
            return;
        }

        const fetch = async () => {
            try {
                const data = await pageLayoutService.getSections('home');
                setSections(data);
                sectionsCache = { data, timestamp: Date.now() };
            } catch {
                setSections([]);
            }
        };
        fetch();
    }, []);

    // Loading state
    if (sections === null) {
        return (
            <div className="w-full min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Check if the sections explicitly include a catalog block
    const hasCatalogSection = sections?.some(s => s.section_type === 'catalog') ?? false;

    // Section-based rendering — pass sections to avoid double fetch
    if (sections && sections.length > 0) {
        return (
            <div className="flex flex-col min-h-screen bg-white dark:bg-stone-950">
                <Suspense fallback={
                    <div className="w-full min-h-screen flex items-center justify-center">
                        <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                }>
                    <SectionRenderer prefetchedSections={sections} />
                    {!hasCatalogSection && <PublicCatalog />}
                </Suspense>
            </div>
        );
    }

    // Fallback to purely the original catalog if no page builder configuration exists
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <PublicCatalog />
        </Suspense>
    );
}
