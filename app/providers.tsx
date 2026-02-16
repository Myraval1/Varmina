'use client';

import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <StoreProvider>
                <ThemeProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </ThemeProvider>
            </StoreProvider>
        </AuthProvider>
    );
}
