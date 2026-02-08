import React, { useState } from 'react';
import { Product, ProductStatus } from '../types';
import { Button, StatusBadge } from './UI';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const formatPrice = (price: number, currency: 'CLP' | 'USD') => {
    if (currency === 'CLP') {
        return `$${price.toLocaleString('es-CL')}`;
    }
    return `USD $${price.toLocaleString('en-US')}`;
};

export const ProductCard: React.FC<{
    product: Product;
    currency: 'CLP' | 'USD';
    layout: 'grid' | 'list';
    onClick: (p: Product) => void
}> = ({ product, currency, layout, onClick }) => {
    const displayPrice = currency === 'CLP' ? product.price : Math.round(product.price / 950);

    return (
        <div
            className={`group cursor-pointer mb-6 md:mb-8 transition-all duration-300 ${layout === 'list' ? 'flex flex-col md:flex-row gap-4 md:gap-6 items-center border-b border-stone-100 dark:border-stone-800 pb-6 md:pb-8' : ''}`}
            onClick={() => onClick(product)}
        >
            <div className={`relative overflow-hidden bg-stone-100 aspect-[4/5] ${layout === 'list' ? 'w-full md:w-1/3 mb-0' : 'w-full mb-3 md:mb-4'}`}>
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                />
                <img
                    src={product.images[1] || product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden md:flex">
                    <span className="bg-white text-stone-900 px-6 py-2 uppercase text-xs tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        Ver Detalles
                    </span>
                </div>
            </div>

            <div className={`space-y-1 ${layout === 'list' ? 'flex-1 w-full text-left' : 'text-left'}`}>
                <div className="flex justify-between items-start gap-2">
                    <h3 className={`font-serif text-stone-900 dark:text-white leading-tight group-hover:text-gold-600 transition-colors ${layout === 'grid' ? 'text-sm md:text-lg' : 'text-lg md:text-xl'}`}>
                        {product.name}
                    </h3>
                    <span className={`font-sans font-bold text-stone-500 dark:text-gold-200 whitespace-nowrap ${layout === 'grid' ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>
                        {formatPrice(displayPrice, currency)}
                    </span>
                </div>
                <p className={`text-stone-500 dark:text-stone-400 ${layout === 'list' ? 'line-clamp-3 my-2 md:my-4 text-xs md:text-sm leading-relaxed' : 'text-[10px] md:text-xs line-clamp-1'}`}>
                    {product.description}
                </p>
                <div className="pt-1 md:pt-2">
                    <StatusBadge status={product.status} />
                </div>
            </div>
        </div>
    );
};

export const ProductDetail: React.FC<{
    product: Product;
    currency: 'CLP' | 'USD';
    onClose: () => void;
}> = ({ product, currency, onClose }) => {
    const displayPrice = currency === 'CLP' ? product.price : Math.round(product.price / 950);
    const [activeImg, setActiveImg] = useState(0);

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="md:w-1/2 space-y-4">
                <div className="aspect-square bg-stone-100 overflow-hidden relative rounded-sm">
                    <img
                        src={product.images[activeImg]}
                        className="w-full h-full object-cover animate-in fade-in duration-500"
                        alt={product.name}
                    />
                    {product.images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === 0 ? product.images.length - 1 : prev - 1); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white/90 shadow-sm text-stone-900 rounded-full"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === product.images.length - 1 ? 0 : prev + 1); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white/90 shadow-sm text-stone-900 rounded-full"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {product.images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImg(idx)}
                            className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 transition-all ${activeImg === idx ? 'border-gold-400 opacity-100' : 'border-transparent opacity-60'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="md:w-1/2 flex flex-col justify-center">
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 dark:text-white mb-2">{product.name}</h2>
                <div className="text-xl md:text-2xl font-light text-gold-600 mb-4 md:mb-6">
                    {formatPrice(displayPrice, currency)}
                </div>

                <div className="prose prose-stone dark:prose-invert mb-6 md:mb-8 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                    {product.description}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-stone-400">Estado:</span>
                        <StatusBadge status={product.status} />
                    </div>

                    <div className="pt-6 md:pt-8 border-t border-stone-100 dark:border-stone-800">
                        <Button
                            className="w-full py-4 text-base md:text-lg"
                            disabled={product.status === ProductStatus.SOLD_OUT}
                        >
                            {product.status === ProductStatus.IN_STOCK ? 'Consultar' :
                                product.status === ProductStatus.MADE_TO_ORDER ? 'Solicitar Encargo' : 'Agotado'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
