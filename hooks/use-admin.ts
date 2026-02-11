import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';

const supabase = createClient();

export function useAdmin() {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const lastCheckedId = useRef<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const checkAdmin = async () => {
            // Wait for global auth initialization
            if (authLoading) return;

            // Case 1: No user (logged out)
            if (!user) {
                if (mounted) {
                    setIsAdmin(false);
                    setLoading(false);
                    lastCheckedId.current = null;
                }
                return;
            }

            // Case 2: Same user already checked.
            if (user.id === lastCheckedId.current && isAdmin !== null) {
                if (mounted) setLoading(false);
                return;
            }

            // Case 3: New check required
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (mounted) {
                    const hasAdminRole = !error && data?.role === 'admin';
                    setIsAdmin(hasAdminRole);
                    lastCheckedId.current = user.id;
                }
            } catch (err) {
                console.error("Admin check failed", err);
                if (mounted) setIsAdmin(false);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        checkAdmin();

        return () => {
            mounted = false;
        };
    }, [user, authLoading, isAdmin]);

    // Return loading if either internal check or global auth is loading
    return { isAdmin, loading: loading || authLoading };
}
