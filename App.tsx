
import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { PublicCatalog } from './pages/PublicCatalog';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { ToastContainer } from './components/UI';
import { APP_NAME } from './constants';
import { LayoutGrid, Sun, Moon, Store, ShoppingBag, LogOut } from 'lucide-react';

const Layout: React.FC<{ 
  children: React.ReactNode, 
  view: 'public' | 'admin', 
  navigate: (path: string) => void 
}> = ({ children, view, navigate }) => {
  const { darkMode, toggleDarkMode, currency, toggleCurrency, isAuthenticated, logout } = useStore();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'dark bg-stone-950' : 'bg-stone-50'}`}>
      
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-stone-200 dark:border-stone-800 h-16 flex items-center justify-between px-4 md:px-6 transition-colors">
        
        {/* Logo Area */}
        <div className="flex items-center gap-4 md:gap-8">
            <h1 
              className="font-serif text-lg md:text-2xl tracking-widest text-stone-900 dark:text-gold-200 cursor-pointer select-none" 
              onClick={() => navigate('/')}
            >
                {APP_NAME}
            </h1>
            
            {/* Nav Links - Admin Indicator Only */}
            {view === 'admin' && (
              <nav className="flex gap-3 md:gap-6 text-[10px] md:text-xs uppercase tracking-widest font-bold text-stone-500">
                  <span className="text-gold-500 py-2 px-1 border-b-2 border-gold-500 md:border-none">
                    Administración
                  </span>
              </nav>
            )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2">
            <button onClick={toggleCurrency} className="p-2 md:p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-600 dark:text-stone-400 transition-colors" title="Cambiar Moneda">
                <span className="font-serif font-bold text-xs">{currency}</span>
            </button>
            <button onClick={toggleDarkMode} className="p-2 md:p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-600 dark:text-stone-400 transition-colors" title="Cambiar Tema">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col">
        {view === 'admin' ? (
            isAuthenticated ? (
                <div className="flex flex-1 min-h-[calc(100vh-64px)]">
                    <aside className="w-64 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hidden lg:flex flex-col justify-between">
                        <div className="p-6">
                            <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Gestión</div>
                            <ul className="space-y-2">
                                <li>
                                    <button className="w-full flex items-center gap-3 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white rounded text-sm font-medium">
                                        <LayoutGrid className="w-4 h-4" /> Inventario
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded text-sm font-medium transition-colors">
                                        <ShoppingBag className="w-4 h-4" /> Pedidos
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => navigate('/')}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded text-sm font-medium transition-colors"
                                    >
                                        <Store className="w-4 h-4" /> Ver Tienda Pública
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="p-6 border-t border-stone-100 dark:border-stone-800">
                             <button 
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm font-medium transition-colors"
                            >
                                <LogOut className="w-4 h-4" /> Cerrar Sesión
                            </button>
                        </div>
                    </aside>
                    <div className="flex-1 bg-stone-50 dark:bg-stone-950">
                        {children}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-4">
                    {children}
                </div>
            )
        ) : (
            children
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-8 text-center text-[10px] md:text-xs text-stone-400 uppercase tracking-widest bg-white dark:bg-stone-900">
        &copy; {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.
      </footer>
      
      <ToastContainer />
    </div>
  );
};

const AppContent = () => {
  // Simple path-based routing
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isAuthenticated } = useStore();

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const isViewAdmin = currentPath.includes('/admin');
  const view = isViewAdmin ? 'admin' : 'public';

  return (
    <Layout view={view} navigate={navigate}>
        {view === 'public' ? (
            <PublicCatalog />
        ) : (
            isAuthenticated ? <AdminDashboard /> : <LoginPage />
        )}
    </Layout>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
