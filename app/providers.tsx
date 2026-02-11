'use client';

import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';

// Wait, the old one used a custom ToastContainer in PublicLayout.
// I should probably check if I need to migrate ToastContainer or use a library.
// The StoreContext has `toasts` state.
// Let's stick to the existing custom implementation for now to minimize changes.
// But I need to migrate UI components first to usage them here?
// Actually, providers just hold state. The ToastContainer is usually placed in the layout.
// I'll place ToastContainer in the layout.

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
