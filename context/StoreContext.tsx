import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, ToastMessage } from '../types';
import { supabaseProductService } from '../services/supabaseProductService';
import { authService } from '../services/authService';
import { User } from '@supabase/supabase-js';
import { settingsService, BrandSettings } from '../services/settingsService';

interface StoreContextType {
  products: Product[];
  loading: boolean;
  currency: 'CLP' | 'USD';
  toggleCurrency: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  refreshProducts: (force?: boolean, silent?: boolean) => Promise<void>;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  settings: BrandSettings | null;
  refreshSettings: () => Promise<void>;
  activeAdminTab: 'inventory' | 'brand';
  setActiveAdminTab: (tab: 'inventory' | 'brand') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

/**
 * Valid TSX Generic Helper to avoid parsing as JSX
 */
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'CLP' | 'USD'>('CLP');
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<'inventory' | 'brand'>('inventory');
  const [lastRefresh, setLastRefresh] = useState(0);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const refreshSettings = useCallback(async () => {
    try {
      console.log('Store: Fetching settings...');
      const data = await withTimeout(settingsService.getSettings(), 5000, null);
      if (data) setSettings(data);
      console.log('Store: Settings loaded');
    } catch (error) {
      console.error('Store: Settings Refresh Error:', error);
    }
  }, []);

  const refreshProducts = useCallback(async (force = false, silent = false) => {
    const now = Date.now();

    if (!force && now - lastRefresh < 3000) {
      if (!silent) setLoading(false);
      return;
    }

    if (!silent) setLoading(true);

    try {
      console.log('Store: Fetching products...');
      const data = await withTimeout(supabaseProductService.getAll(), 5000, []);
      setProducts(data);
      setLastRefresh(now);
      console.log(`Store: ${data.length} products loaded`);
    } catch (error) {
      console.error('Store: Product Refresh Error:', error);
      if (!silent) addToast('error', 'Error al sincronizar inventario');
    } finally {
      setLoading(false);
    }
  }, [lastRefresh, addToast]);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      console.log('--- VARMINA CORE INITIALIZATION START ---');
      setLoading(true);

      try {
        console.log('1. Checking Auth...');
        const session = await withTimeout(authService.getCurrentSession(), 4000, null);
        const currentUser = session?.user || null;

        if (isMounted) {
          setUser(currentUser);
          console.log('User status:', currentUser ? 'Logged In' : 'Guest');
        }

        console.log('2. Fetching Data...');
        const promises: Promise<any>[] = [
          refreshSettings(),
          refreshProducts(true, true)
        ];

        if (currentUser && isMounted) {
          promises.push(
            withTimeout(authService.isAdmin(currentUser.id), 3000, false)
              .then(res => { if (isMounted) setIsAuthenticated(res); })
          );
        }

        await Promise.all(promises);

      } catch (error) {
        console.error('Varmina: Initialization failed partially', error);
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('--- VARMINA CORE INITIALIZATION END ---');
        }
      }
    };

    initialize();

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const isAuthorized = await withTimeout(authService.isAdmin(currentUser.id), 3000, false);
        if (isMounted) setIsAuthenticated(isAuthorized);

        if (event === 'SIGNED_IN' && !isAuthorized) {
          addToast('error', 'Acceso denegado: Se requiere administrador');
          await authService.signOut();
        }
      } else {
        if (isMounted) setIsAuthenticated(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [refreshProducts, refreshSettings, addToast]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleCurrency = useCallback(() => {
    setCurrency(prev => prev === 'CLP' ? 'USD' : 'CLP');
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await authService.signIn(email, password);
    if (error) {
      addToast('error', error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  const logout = async () => {
    await authService.signOut();
  };

  return (
    <StoreContext.Provider value={{
      products,
      loading,
      currency,
      toggleCurrency,
      darkMode,
      toggleDarkMode,
      refreshProducts,
      toasts,
      addToast,
      removeToast,
      isAuthenticated,
      user,
      login,
      logout,
      settings,
      refreshSettings,
      activeAdminTab,
      setActiveAdminTab
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
