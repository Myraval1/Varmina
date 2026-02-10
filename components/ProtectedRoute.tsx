import React from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { LoadingScreen } from './UI';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAdmin, loading } = useAdmin();
    const location = useLocation();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!isAdmin) {
        // Redirect to login page, saving the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
