import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Product } from '@/types';

export const usePublicProducts = () => {
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
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!mounted) return;
                if (error) throw error;

                const parsed = (data as Record<string, unknown>[])?.map(p => ({
                    ...p,
                    price: Number(p.price),
                    stock: Number(p.stock)
                })) as Product[] || [];

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
    }, []);

    return { products, loading, error };
};
