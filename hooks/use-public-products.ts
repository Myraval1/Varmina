import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Product } from '@/types';

export const usePublicProducts = (options?: { shuffle?: boolean }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const supabase = createClient();

        async function fetchFresh() {
            if (mounted) setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*');
                // Removing default order to let shuffle work effectively or just fetch all

                if (!mounted) return;
                if (error) throw error;

                let parsed = (data as Record<string, unknown>[])?.map(p => ({
                    ...p,
                    price: Number(p.price),
                    stock: Number(p.stock)
                })) as Product[] || [];

                // Simple Fisher-Yates Shuffle if requested
                if (options?.shuffle) {
                    for (let i = parsed.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [parsed[i], parsed[j]] = [parsed[j], parsed[i]];
                    }
                } else {
                    // Default to newest first if not shuffled
                    parsed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                }

                setProducts(parsed);
            } catch (err: unknown) {
                console.error('Public fetch error:', err);
                if (mounted) setError(err instanceof Error ? err.message : String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchFresh();

        return () => {
            mounted = false;
        };
    }, [options?.shuffle]);

    return { products, loading, error };
};
