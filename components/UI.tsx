import React, { Fragment, ReactNode } from 'react';
import { ProductStatus } from '../types';
import { X, Check, Info, Loader2 } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, className = '', ...props 
}) => {
  const base = "inline-flex items-center justify-center font-serif tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-stone-900 text-white hover:bg-gold-500 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-gold-400",
    secondary: "bg-gold-400 text-white hover:bg-gold-500",
    outline: "border border-stone-300 text-stone-900 hover:border-gold-400 hover:text-gold-500 dark:border-stone-700 dark:text-stone-100",
    ghost: "text-stone-600 hover:text-gold-500 dark:text-stone-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-2 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-serif uppercase tracking-wider text-stone-500 mb-1">{label}</label>}
      <input 
        className={`w-full bg-transparent border-b border-stone-300 py-2 text-stone-900 focus:border-gold-400 focus:outline-none transition-colors dark:border-stone-700 dark:text-stone-100 ${error ? 'border-red-500' : ''} ${className}`}
        {...props} 
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

// --- BADGE ---
export const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
  const styles = {
    [ProductStatus.IN_STOCK]: "bg-green-100 text-green-800 border-green-200",
    [ProductStatus.MADE_TO_ORDER]: "bg-gold-100 text-gold-600 border-gold-200",
    [ProductStatus.SOLD_OUT]: "bg-stone-100 text-stone-500 border-stone-200",
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest border ${styles[status] || styles[ProductStatus.IN_STOCK]}`}>
      {status}
    </span>
  );
};

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-stone-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white dark:bg-stone-900 z-10">
          {title && <h3 className="font-serif text-xl text-stone-900 dark:text-white">{title}</h3>}
          <button onClick={onClose} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- TOAST CONTAINER ---
import { useStore } from '../context/StoreContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 shadow-lg min-w-[300px] border-l-4
            animate-in slide-in-from-right duration-300
            ${toast.type === 'success' ? 'bg-white border-green-500 text-stone-800' : ''}
            ${toast.type === 'error' ? 'bg-white border-red-500 text-stone-800' : ''}
            ${toast.type === 'info' ? 'bg-stone-900 border-gold-400 text-white' : ''}
          `}
        >
          {toast.type === 'success' && <Check className="w-4 h-4 text-green-500" />}
          {toast.type === 'error' && <X className="w-4 h-4 text-red-500" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-gold-400" />}
          <p className="text-sm font-medium">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="ml-auto text-current opacity-50 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- SKELETON ---
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-stone-200 dark:bg-stone-800 ${className}`} />
);