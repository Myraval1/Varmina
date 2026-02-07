import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-stone-200">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h1 className="font-serif text-2xl text-stone-900 mb-4">Algo no salió como esperábamos</h1>
                        <p className="text-stone-500 mb-8 text-sm leading-relaxed">
                            Lo sentimos, ha ocurrido un error inesperado en la aplicación.
                            Estamos trabajando para que todo vuelva a la normalidad.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-3 px-6 rounded hover:bg-stone-800 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" /> Recargar Aplicación
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
