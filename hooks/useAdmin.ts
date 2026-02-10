import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useAdmin() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const lastCheckedId = useRef<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const checkAdmin = async () => {
            // Case 1: No user
            if (!user) {
                if (mounted) {
                    setIsAdmin(false);
                    setLoading(false);
                    lastCheckedId.current = null;
                }
                return;
            }

            // Case 2: Same user already checked.
            // If we have a cached result for this user ID, skip the "loading" flash.
            if (user.id === lastCheckedId.current && isAdmin !== null) {
                // We can optionally re-verify in background, but for UI stability, don't set loading=true
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
                    const hasAdminRole = !error && data && (data as any).role === 'admin';
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
    }, [user, isAdmin]); // user ref changes on focus, triggering this. Check inside handles logic.

    return { isAdmin, loading };
}
