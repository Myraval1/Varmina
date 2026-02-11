import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Product } from '@/types';

export const usePublicProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        let mounted = true;

        const fetchProducts = async () => {
            try {
                // Fetch directly from supabase, bypassing any auth context logic
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!mounted) return;

                if (error) throw error;
                // Cast data to Product[] assuming it matches
                setProducts((data as any[])?.map(p => ({
                    ...p,
                    price: Number(p.price), // Ensure price is number
                    stock: Number(p.stock)  // Ensure stock is number
                })) || []);
            } catch (err: any) {
                console.error('Public fetch error:', err);
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            mounted = false;
        };
    }, []);

    return { products, loading, error };
};
