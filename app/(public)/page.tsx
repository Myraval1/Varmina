import { Suspense } from 'react';
import { SectionRenderer } from '@/components/public/section-renderer';
import { PublicCatalog } from '@/components/public/public-catalog';
import { pageLayoutService } from '@/services/pageLayoutService';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
    // Fetch sections on the server
    const supabase = await createClient();
    const sections = await pageLayoutService.getSections('home', supabase);
    
    // Check if the sections explicitly include a catalog block
    const hasCatalogSection = sections?.some(s => s.section_type === 'catalog') ?? false;

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
