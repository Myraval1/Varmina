import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

export const usePublicProducts = (options?: { shuffle?: boolean }) => {
    const { products, loading, error } = useStore();

    const processedProducts = useMemo(() => {
        if (!products || products.length === 0) return [];
        
        let result = [...products];

        // Simple Fisher-Yates Shuffle if requested
        if (options?.shuffle) {
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
        } else {
            // Default to newest first (although StoreContext might already do this)
            result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        }

        return result;
    }, [products, options?.shuffle]);

    return { 
        products: processedProducts, 
        loading, 
        error 
    };
};

