import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ToastMessage } from '../types';
import { productService } from '../services/productService';

interface StoreContextType {
  products: Product[];
  loading: boolean;
  currency: 'CLP' | 'USD';
  toggleCurrency: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  refreshProducts: () => Promise<void>;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
  isAuthenticated: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'CLP' | 'USD'>('CLP');
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initial Load
  useEffect(() => {
    refreshProducts();
  }, []);

  // Dark Mode Side Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      addToast('error', 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const toggleCurrency = () => setCurrency(prev => prev === 'CLP' ? 'USD' : 'CLP');
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (u: string, p: string) => {
    return new Promise<void>(resolve => {
        // Mock API delay
        setTimeout(() => {
            setIsAuthenticated(true);
            addToast('success', 'Bienvenido, Admin');
            resolve();
        }, 1000);
    });
  };

  const logout = () => {
      setIsAuthenticated(false);
      addToast('info', 'Sesión cerrada');
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
      login,
      logout
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};