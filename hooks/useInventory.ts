import { useState, useEffect } from 'react';
import { supabaseProductService } from '../services/supabaseProductService';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

export function useInventory() {
    const { addToast } = useStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchInventory = async () => {
            setLoading(true);
            try {
                const data = await supabaseProductService.getAll();
                if (mounted) setProducts(data);
            } catch (error) {
                console.error("Failed to load inventory:", error);
                if (mounted) addToast('error', 'Error al cargar inventario');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchInventory();

        return () => {
            mounted = false;
        };
    }, []);

    const refreshInventory = async () => {
        setLoading(true);
        try {
            const data = await supabaseProductService.getAll();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load inventory:", error);
            addToast('error', 'Error al cargar inventario');
        } finally {
            setLoading(false);
        }
    };

    return { products, loading, refreshInventory };
}
