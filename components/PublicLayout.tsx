import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { APP_NAME } from '../constants';
import { Sun, Moon } from 'lucide-react';
import { ToastContainer } from './UI';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { darkMode, toggleDarkMode, currency, toggleCurrency } = useStore();
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'dark bg-stone-950' : 'bg-stone-50'}`}>

            {/* Public Header */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-stone-200 dark:border-stone-800 h-16 flex items-center justify-between px-4 md:px-6 transition-colors">

                {/* Logo Area */}
                <div className="flex items-center gap-4 md:gap-8">
                    <h1
                        className="font-serif text-lg md:text-2xl tracking-widest text-stone-900 dark:text-gold-200 cursor-pointer select-none"
                        onClick={() => navigate('/')}
                    >
                        {APP_NAME}
                    </h1>
                </div>

                {/* Public Actions */}
                <div className="flex items-center gap-1 md:gap-2">
                    <button onClick={toggleCurrency} className="p-2 md:p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-600 dark:text-stone-400 transition-colors" title="Cambiar Moneda">
                        <span className="font-serif font-bold text-xs">{currency}</span>
                    </button>
                    <button onClick={toggleDarkMode} className="p-2 md:p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-600 dark:text-stone-400 transition-colors" title="Cambiar Tema">
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => navigate('/admin')}
                        className="ml-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-gold-400 border border-transparent hover:border-stone-200 dark:hover:border-stone-800 rounded-sm transition-all"
                    >
                        Admin
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full flex flex-col items-center justify-start">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-stone-100 dark:border-stone-800 py-12 text-center text-[9px] text-stone-400 uppercase tracking-[0.3em] bg-white dark:bg-[#0A0A0A]">
                &copy; {new Date().getFullYear()} {APP_NAME}
            </footer>

            <ToastContainer />
        </div>
    );
};
