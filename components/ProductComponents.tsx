import React, { useState } from 'react';
import { Product, ProductStatus } from '../types';
import { Button, StatusBadge } from './UI';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabaseProductService } from '../services/supabaseProductService';
import { useStore } from '../context/StoreContext';

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
    const { settings } = useStore();
    const exchangeRate = settings?.usd_exchange_rate || 950;
    const displayPrice = currency === 'CLP' ? product.price : Math.round(product.price / exchangeRate);

    const isList = layout === 'list';

    return (
        <div
            className={`group cursor-pointer relative bg-white dark:bg-stone-900 md:bg-transparent ${isList
                ? 'flex gap-4 p-3 md:p-0 border border-stone-100 dark:border-stone-800 rounded-lg md:rounded-lg md:border-b md:pb-8 md:border-t-0 md:border-x-0'
                : 'flex flex-col gap-3'
                }`}
            onClick={() => onClick(product)}
        >
            {/* Image Container */}
            <div className={`relative overflow-hidden bg-stone-100 rounded-sm ${isList
                ? 'w-24 h-32 md:w-48 md:h-64 aspect-[3/4] shrink-0'
                : 'w-full aspect-[3/4]'
                }`}>
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                />
                {product.images[1] && (
                    <img
                        src={product.images[1]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                    />
                )}

                {/* Badge */}
                {product.badge && (
                    <div className="absolute top-2 left-2 z-10">
                        <span className="bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-sm shadow-sm backdrop-blur-sm">
                            {product.badge}
                        </span>
                    </div>
                )}

                {/* Sold Out Overlay */}
                {product.status === ProductStatus.SOLD_OUT && (
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-grayscale flex items-center justify-center">
                        <span className="bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 -rotate-6 shadow-xl border border-white/20">Agotado</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={`flex flex-col ${isList ? 'justify-center py-2 items-start' : ''}`}>
                {product.collection && (
                    <p className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">{product.collection}</p>
                )}

                <h3 className={`font-serif text-stone-900 dark:text-white leading-tight mb-1 group-hover:text-gold-600 transition-colors duration-300 ${isList ? 'text-base' : 'text-sm md:text-base'}`}>
                    {product.name}
                </h3>

                <p className={`font-bold text-stone-900 dark:text-gold-200 ${isList ? 'text-sm' : 'text-xs md:text-sm'}`}>
                    {formatPrice(displayPrice, currency)}
                </p>

                {isList && (
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 hidden md:block">{product.description}</p>
                )}
            </div>
        </div>
    );
};

export const ProductDetail: React.FC<{
    product: Product;
    currency: 'CLP' | 'USD';
    onClose: () => void;
}> = ({ product, currency, onClose }) => {
    const { settings } = useStore();
    const [activeImg, setActiveImg] = useState(0);
    const primaryVariant = product.variants?.find(v => v.isPrimary);
    const [selectedVariant, setSelectedVariant] = useState<any>(primaryVariant || null);

    const imagesToDisplay = (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0)
        ? selectedVariant.images
        : product.images;

    const exchangeRate = settings?.usd_exchange_rate || 950;
    const basePrice = currency === 'CLP' ? product.price : Math.round(product.price / exchangeRate);
    const currentPrice = selectedVariant
        ? (currency === 'CLP' ? selectedVariant.price : Math.round(selectedVariant.price / exchangeRate))
        : basePrice;

    const handleWhatsApp = async () => {
        await supabaseProductService.incrementWhatsappClicks(product.id);
        const number = settings?.whatsapp_number || '56927435294';
        const template = settings?.whatsapp_template || 'Hola Varmina, me interesa: {{product_name}} (ID: {{product_id}})';
        const message = template
            .replace('{{product_name}}', `${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''}`)
            .replace('{{product_id}}', product.id.slice(0, 8));
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="flex flex-col md:flex-row h-full md:h-auto overflow-hidden bg-white dark:bg-stone-950 md:rounded-lg max-w-5xl w-full mx-auto relative shadow-2xl animate-in slide-in-from-bottom-8 duration-500 ease-out">
            {/* Close Button Mobile/Desktop */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-stone-900/80 rounded-full text-stone-900 dark:text-white hover:bg-gold-500 hover:text-white transition-colors backdrop-blur-sm shadow-sm"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 bg-stone-50 dark:bg-stone-900 relative">
                <div className="w-full aspect-[3/4] md:h-[650px] relative">
                    <img
                        src={imagesToDisplay[activeImg] || product.images[0]}
                        className="w-full h-full object-cover"
                        alt={product.name}
                    />
                    {/* Navigation Arrows */}
                    {imagesToDisplay.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === 0 ? imagesToDisplay.length - 1 : prev - 1); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white text-stone-900 rounded-full transition-all shadow-sm backdrop-blur-md"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === imagesToDisplay.length - 1 ? 0 : prev + 1); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white text-stone-900 rounded-full transition-all shadow-sm backdrop-blur-md"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {imagesToDisplay.length > 1 && (
                    <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center gap-2 overflow-x-auto hide-scrollbar z-10">
                        {imagesToDisplay.map((img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImg(idx)}
                                className={`w-12 h-16 shrink-0 border rounded-sm overflow-hidden transition-all duration-300 ${activeImg === idx ? 'border-gold-500 shadow-md scale-110 opacity-100' : 'border-white/50 opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt="" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col h-auto md:max-h-[650px] overflow-y-auto bg-white dark:bg-stone-950">
                <div className="mb-auto">
                    {product.collection && (
                        <span className="text-[10px] font-bold text-gold-600 uppercase tracking-[0.25em] mb-3 block">{product.collection}</span>
                    )}
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-white mb-2 tracking-wide leading-tight">{product.name}</h2>
                    <div className="flex items-center gap-4 mb-8 border-b border-stone-100 dark:border-stone-800 pb-6">
                        <span className="text-xl md:text-2xl font-light text-stone-900 dark:text-gold-200">
                            {formatPrice(currentPrice, currency)}
                        </span>
                        <StatusBadge status={product.status} />
                    </div>

                    <div className="prose prose-sm prose-stone dark:prose-invert mb-8 text-stone-600 dark:text-stone-400 leading-relaxed font-sans text-sm md:text-base">
                        {product.description}
                    </div>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-8 animate-in fade-in duration-700">
                            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-3 block">Seleccionar Opción</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedVariant(null)}
                                    className={`px-5 py-2.5 text-xs font-medium border rounded-full transition-all duration-300 ${!selectedVariant ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-105' : 'bg-transparent text-stone-500 border-stone-200 hover:border-gold-500 hover:text-stone-900'}`}
                                >
                                    Estándar
                                </button>
                                {product.variants.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => { setSelectedVariant(v); setActiveImg(0); }}
                                        className={`px-5 py-2.5 text-xs font-medium border rounded-full transition-all duration-300 ${selectedVariant?.id === v.id ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-105' : 'bg-transparent text-stone-500 border-stone-200 hover:border-gold-500 hover:text-stone-900'}`}
                                    >
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-6 mt-8 md:mt-auto">
                    <Button
                        className="w-full py-4 text-xs md:text-sm font-bold uppercase tracking-[0.2em] bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                        disabled={product.status === ProductStatus.SOLD_OUT}
                        onClick={handleWhatsApp}
                    >
                        {product.status === ProductStatus.SOLD_OUT ? 'Agotado' : 'Consultar disponibilidad'}
                    </Button>
                    <div className="flex items-center justify-center mt-4 opacity-60">
                        <span className="text-[10px] uppercase tracking-widest text-stone-400">
                            Envíos disponibles a todo Chile
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
