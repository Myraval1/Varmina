'use client';

import React from 'react';
import { Product, ProductStatus } from '@/types';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
    product: Product;
    currency: 'CLP' | 'USD';
    layout: 'grid' | 'list';
    onClick: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, currency, layout, onClick }) => {
    const { settings } = useStore();
    const exchangeRate = settings?.usd_exchange_rate || 950;
    const displayPrice = currency === 'CLP' ? product.price : Math.round(product.price / exchangeRate);

    const isList = layout === 'list';
    const isNew = product.badge?.toLowerCase() === 'nuevo';

    return (
        <div
            className={`group cursor-pointer relative md:bg-transparent product-card-hover ${isList
                ? 'flex gap-4 p-3 md:p-0 border-b border-stone-100 dark:border-stone-800 md:border-none'
                : 'flex flex-col gap-3'
                }`}
            onClick={() => onClick(product)}
        >
            {/* Image Container */}
            <div className={`relative overflow-hidden bg-stone-100 dark:bg-stone-800 rounded-sm ${isList
                ? 'w-24 h-32 md:w-48 md:h-64 aspect-[3/4] shrink-0'
                : 'w-full aspect-[3/4]'
                }`}>
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                />
                {product.images[1] && (
                    <img
                        src={product.images[1]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 scale-105"
                    />
                )}

                {/* Badge */}
                {product.badge && (
                    <div className="absolute top-0 left-0 z-10">
                        <span className="bg-stone-900 text-white text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 backdrop-blur-md">
                            {product.badge}
                        </span>
                    </div>
                )}

                {/* Sold Out Overlay */}
                {product.status === ProductStatus.SOLD_OUT && (
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-grayscale flex items-center justify-center">
                        <span className="bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 -rotate-6 shadow-xl border border-white/20">Agotado</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={`flex flex-col ${isList ? 'justify-center py-2 items-start' : 'items-start'}`}>
                {product.collection && (
                    <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1.5">{product.collection}</p>
                )}

                <h3 className={`font-serif text-stone-900 dark:text-white leading-tight mb-1 group-hover:text-gold-600 transition-colors duration-300 uppercase tracking-wide ${isList ? 'text-sm' : 'text-xs md:text-sm'}`}>
                    {product.name}
                </h3>

                <p className={`font-medium text-stone-600 dark:text-stone-300 ${isList ? 'text-sm' : 'text-xs md:text-sm'}`}>
                    {formatPrice(displayPrice, currency)}
                </p>

                {isList && (
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 hidden md:block">{product.description}</p>
                )}
            </div>
        </div>
    );
};
