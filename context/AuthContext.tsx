import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isAdmin: boolean;
    loading: boolean;
    signIn: typeof authService.signIn;
    signOut: typeof authService.signOut;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Helper to fetch admin status
    const checkAdminStatus = async (userId: string) => {
        try {
            const isAdm = await authService.isAdmin(userId);
            setIsAdmin(isAdm);
            return isAdm;
        } catch (err) {
            console.error('Error checking admin status:', err);
            setIsAdmin(false);
            return false;
        }
    };

    useEffect(() => {
        let mounted = true;

        // 1. Initial Session Check
        const initAuth = async () => {
            try {
                const currentSession = await authService.getCurrentSession();
                if (mounted) {
                    setSession(currentSession);
                    setUser(currentSession?.user ?? null);

                    if (currentSession?.user) {
                        await checkAdminStatus(currentSession.user.id);
                    }
                }
            } catch (error) {
                console.error('Auth init error:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        // 2. Auth State Listener
        const { data: { subscription } } = authService.onAuthStateChange(async (event, newSession) => {
            if (!mounted) return;

            console.log('Auth event:', event);
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (newSession?.user) {
                // Only re-check admin on relevant events to avoid noise
                if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                    await checkAdminStatus(newSession.user.id);
                } else if (event === 'SIGNED_OUT') {
                    setIsAdmin(false);
                }
                // TOKEN_REFRESHED usually doesn't change admin status, so we skip it or assume state is preserved
            } else {
                setIsAdmin(false);
            }

            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        session,
        isAdmin,
        loading,
        signIn: authService.signIn,
        signOut: async () => {
            await authService.signOut();
            setIsAdmin(false);
            setUser(null);
            setSession(null);
        }
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
