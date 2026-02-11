'use client';

import React, { useEffect } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useRouter } from 'next/navigation';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAdmin, loading } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/login');
        }
    }, [loading, isAdmin, router]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!isAdmin) {
        return null; // Or return loading screen while redirecting
    }

    return <>{children}</>;
};
