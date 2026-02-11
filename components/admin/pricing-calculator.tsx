'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/format';
import { Calculator, DollarSign, TrendingUp, Percent, Package, Gem, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CostItem {
    id: string;
    label: string;
    value: number;
}

const DEFAULT_MARKUP = 2.5; // 250% markup as default for jewelry

export const PricingCalculator: React.FC = () => {
    const { addToast } = useStore();

    // Material costs
    const [costItems, setCostItems] = useState<CostItem[]>([
        { id: 'material', label: 'Material Principal (Oro/Plata)', value: 0 },
        { id: 'gems', label: 'Piedras / Gemas', value: 0 },
        { id: 'labor', label: 'Mano de Obra', value: 0 },
        { id: 'packaging', label: 'Empaque y Presentación', value: 0 },
        { id: 'shipping', label: 'Envío / Logística', value: 0 },
    ]);

    const [customCosts, setCustomCosts] = useState<CostItem[]>([]);
    const [markupMultiplier, setMarkupMultiplier] = useState(DEFAULT_MARKUP);
    const [targetPrice, setTargetPrice] = useState<number | ''>('');
    const [mode, setMode] = useState<'markup' | 'target'>('markup');

    const updateCostItem = (id: string, value: number) => {
        setCostItems(prev => prev.map(item => item.id === id ? { ...item, value } : item));
    };

    const addCustomCost = () => {
        setCustomCosts(prev => [...prev, {
            id: `custom-${Date.now()}`,
            label: 'Costo Adicional',
            value: 0
        }]);
    };

    const updateCustomCost = (id: string, field: 'label' | 'value', val: string | number) => {
        setCustomCosts(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: val } : item
        ));
    };

    const removeCustomCost = (id: string) => {
        setCustomCosts(prev => prev.filter(item => item.id !== id));
    };

    // Calculations
    const calculations = useMemo(() => {
        const totalCost = [...costItems, ...customCosts].reduce((sum, item) => sum + item.value, 0);

        if (mode === 'markup') {
            const suggestedPrice = Math.round(totalCost * markupMultiplier);
            const grossProfit = suggestedPrice - totalCost;
            const marginPercent = suggestedPrice > 0 ? (grossProfit / suggestedPrice) * 100 : 0;
            const roi = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;
            return { totalCost, suggestedPrice, grossProfit, marginPercent, roi };
        } else {
            const priceVal = typeof targetPrice === 'number' ? targetPrice : 0;
            const grossProfit = priceVal - totalCost;
            const marginPercent = priceVal > 0 ? (grossProfit / priceVal) * 100 : 0;
            const roi = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;
            const impliedMarkup = totalCost > 0 ? priceVal / totalCost : 0;
            return { totalCost, suggestedPrice: priceVal, grossProfit, marginPercent, roi, impliedMarkup };
        }
    }, [costItems, customCosts, markupMultiplier, targetPrice, mode]);

    const handleReset = () => {
        setCostItems(prev => prev.map(item => ({ ...item, value: 0 })));
        setCustomCosts([]);
        setMarkupMultiplier(DEFAULT_MARKUP);
        setTargetPrice('');
        addToast('success', 'Calculadora reiniciada');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif text-stone-900 dark:text-white flex items-center gap-3">
                        <Calculator className="w-6 h-6 text-gold-500" />
                        Calculadora de Precios
                    </h2>
                    <p className="text-stone-500 text-sm mt-1">Calcula el precio de venta y margen de ganancia de tus piezas</p>
                </div>
                <Button variant="ghost" onClick={handleReset} className="text-xs uppercase tracking-widest">
                    Reiniciar
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left: Cost Inputs */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Standard Costs */}
                    <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
                            <Package className="w-4 h-4" /> Desglose de Costos
                        </h3>

                        {costItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <label className="flex-1 text-xs font-medium text-stone-700 dark:text-stone-300">{item.label}</label>
                                <div className="relative w-40">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">$</span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={item.value || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCostItem(item.id, Number(e.target.value))}
                                        placeholder="0"
                                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg pl-7 pr-3 py-2 text-sm text-right outline-none focus:border-gold-400 transition-colors dark:text-white"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Custom costs */}
                        {customCosts.map(item => (
                            <div key={item.id} className="flex items-center gap-3 bg-stone-50 dark:bg-stone-950 p-3 rounded-lg border border-dashed border-stone-200 dark:border-stone-800">
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCustomCost(item.id, 'label', e.target.value)}
                                    className="flex-1 bg-transparent text-xs font-medium text-stone-700 dark:text-stone-300 outline-none"
                                />
                                <div className="relative w-32">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">$</span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={item.value || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCustomCost(item.id, 'value', Number(e.target.value))}
                                        placeholder="0"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg pl-7 pr-3 py-2 text-sm text-right outline-none focus:border-gold-400 dark:text-white"
                                    />
                                </div>
                                <button
                                    onClick={() => removeCustomCost(item.id)}
                                    className="text-stone-400 hover:text-red-500 text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addCustomCost}
                            className="w-full py-2 border border-dashed border-stone-300 dark:border-stone-700 rounded-lg text-xs text-stone-400 hover:text-gold-500 hover:border-gold-400 transition-colors"
                        >
                            + Agregar Costo Adicional
                        </button>
                    </div>

                    {/* Pricing Strategy */}
                    <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-6 space-y-5">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Estrategia de Precio
                        </h3>

                        {/* Mode toggle */}
                        <div className="flex bg-stone-50 dark:bg-stone-950 p-1 rounded-lg border border-stone-200 dark:border-stone-800">
                            <button
                                onClick={() => setMode('markup')}
                                className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'markup' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'text-stone-500'}`}
                            >
                                Por Multiplicador
                            </button>
                            <button
                                onClick={() => setMode('target')}
                                className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'target' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'text-stone-500'}`}
                            >
                                Precio Objetivo
                            </button>
                        </div>

                        {mode === 'markup' ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Multiplicador</label>
                                    <span className="text-lg font-serif font-bold text-gold-500">{markupMultiplier}x</span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={0.1}
                                    value={markupMultiplier}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMarkupMultiplier(Number(e.target.value))}
                                    className="w-full accent-gold-500"
                                />
                                <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-widest">
                                    <span>1x (Sin margen)</span>
                                    <span>10x (Premium)</span>
                                </div>
                                {/* Common presets */}
                                <div className="flex gap-2 pt-2">
                                    {[1.5, 2, 2.5, 3, 4, 5].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMarkupMultiplier(m)}
                                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold border transition-all ${markupMultiplier === m ? 'bg-gold-500 text-white border-gold-600' : 'border-stone-200 dark:border-stone-700 text-stone-500 hover:border-gold-400'}`}
                                        >
                                            {m}x
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Precio de Venta Deseado</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={targetPrice}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetPrice(e.target.value ? Number(e.target.value) : '')}
                                        placeholder="Ej: 250000"
                                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg pl-7 pr-4 py-3 text-lg font-serif text-right outline-none focus:border-gold-400 dark:text-white"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Helpful Info */}
                        <div className="flex items-start gap-2 p-3 bg-stone-50 dark:bg-stone-950 rounded-lg text-[10px] text-stone-400 italic">
                            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <p>En joyería artesanal, un multiplicador de 2.5x–4x es estándar. Para piezas de alta gama o exclusivas, 4x–8x es común.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Results Panel */}
                <div className="lg:col-span-2">
                    <div className="sticky top-6 space-y-6">
                        {/* Results Card */}
                        <div className="bg-stone-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Gem className="w-28 h-28" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">Resultado</h3>

                                {/* Total Cost */}
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Costo Total</p>
                                    <p className="text-2xl font-serif">{formatPrice(calculations.totalCost)}</p>
                                </div>

                                {/* Suggested Price */}
                                <div className="pt-4 border-t border-stone-800">
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">
                                        {mode === 'markup' ? 'Precio Sugerido' : 'Precio Objetivo'}
                                    </p>
                                    <p className="text-4xl font-serif text-gold-400">{formatPrice(calculations.suggestedPrice)}</p>
                                </div>

                                {/* Profit */}
                                <div className="pt-4 border-t border-stone-800">
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Ganancia Bruta</p>
                                    <p className={`text-xl font-serif ${calculations.grossProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {calculations.grossProfit >= 0 ? '+' : ''}{formatPrice(calculations.grossProfit)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-5 text-center">
                                <div className="inline-flex p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg mb-2">
                                    <Percent className="w-4 h-4" />
                                </div>
                                <p className="text-2xl font-serif font-bold text-stone-900 dark:text-white">{calculations.marginPercent.toFixed(1)}%</p>
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">Margen</p>
                            </div>
                            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-5 text-center">
                                <div className="inline-flex p-2 bg-gold-100 dark:bg-gold-500/10 text-gold-600 rounded-lg mb-2">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <p className="text-2xl font-serif font-bold text-stone-900 dark:text-white">{calculations.roi.toFixed(0)}%</p>
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">ROI</p>
                            </div>
                        </div>

                        {/* Target mode: Show implied markup */}
                        {mode === 'target' && calculations.totalCost > 0 && (
                            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-5 text-center">
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Multiplicador Implícito</p>
                                <p className="text-3xl font-serif font-bold text-gold-500">
                                    {((calculations as any).impliedMarkup || 0).toFixed(2)}x
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
