import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button, Input } from '../components/UI';
import { Shield } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login - accepts any input for now
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 rounded-lg animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-500 border border-stone-200 dark:border-stone-700">
            <Shield className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-stone-900 dark:text-white uppercase tracking-wider">Acceso Admin</h2>
        <p className="text-sm text-stone-500 mt-2">Gestión exclusiva para personal autorizado.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder=""
            required
        />
        <Input 
            label="Contraseña" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
        />
        <Button type="submit" className="w-full py-3" isLoading={isLoading}>
            Ingresar al Sistema
        </Button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
        <p className="text-[10px] text-stone-400 uppercase tracking-widest">
            Varmina Joyas • Secure System
        </p>
      </div>
    </div>
  );
};