import { Suspense } from 'react';
import { PublicCatalog } from '@/components/public/public-catalog';

export const metadata = {
    title: 'Catálogo | Varmina',
    description: 'Explora nuestra colección exclusiva de joyas de alta calidad.',
};

export default function CatalogPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-stone-950">
            <Suspense fallback={
                <div className="w-full min-h-screen flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <PublicCatalog />
            </Suspense>
        </div>
    );
}
