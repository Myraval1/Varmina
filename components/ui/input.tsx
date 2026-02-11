
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={generatedId}
                    className="block text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-stone-400 mb-2"
                >
                    {label}
                </label>
            )}
            <input
                id={generatedId}
                name={props.name || generatedId}
                className={`w-full bg-transparent border-b border-stone-300 py-2.5 text-stone-900 font-serif text-lg focus:border-gold-400 focus:outline-none transition-colors dark:border-stone-700 dark:text-stone-100 ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <span className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">{error}</span>}
        </div>
    );
};
