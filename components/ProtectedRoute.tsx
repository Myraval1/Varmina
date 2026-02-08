import React from 'react';
import { useStore } from '../context/StoreContext';
import { LoadingScreen } from './UI';
import { LoginPage } from '../pages/LoginPage';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useStore();

    if (loading) return <LoadingScreen />;

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return <>{children}</>;
};
