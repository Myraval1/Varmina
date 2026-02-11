'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { supabaseProductService } from '@/services/supabaseProductService';
import { financeService } from '@/services/financeService';
import { Product, ProductStatus } from '@/types';
import { Button } from '@/components/ui/button'; // Adjust import if needed
import { Input } from '@/components/ui/input';
import { Search, Plus, Trash2, ShoppingCart, User, CreditCard, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export const OrdersView: React.FC = () => {
    const { addToast, settings } = useStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Cart State
    interface OrderItem {
        product: Product;
        quantity: number;
        variant?: any;
    }
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Transferencia');

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await supabaseProductService.getAll();
            setProducts(data);
        } catch (error) {
            addToast('error', 'Error al cargar inventario');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product, variant?: any) => {
        setCart(prev => {
            const existing = prev.find(i => i.product.id === product.id && i.variant?.name === variant?.name);
            if (existing) {
                // Check stock limit
                const maxStock = variant ? variant.stock : product.stock;
                if (existing.quantity >= maxStock) {
                    addToast('error', 'No hay más stock disponible');
                    return prev;
                }
                return prev.map(i => (i === existing ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [...prev, { product, quantity: 1, variant }];
        });
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return cart.reduce((acc, item) => {
            const price = item.variant ? item.variant.price : item.product.price;
            return acc + (price * item.quantity);
        }, 0);
    };

    const handleSubmitOrder = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);

        try {
            // 1. Deduct Stock for each item
            for (const item of cart) {
                await supabaseProductService.updateStock(
                    item.product.id,
                    item.quantity,
                    item.variant?.name
                );
            }

            // 2. Create Finance Record
            const totalAmount = calculateTotal();
            const description = `Venta: ${customerName || 'Cliente Mostrador'} - ${cart.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}`;

            await financeService.create({
                description: description.slice(0, 100), // Limit length
                amount: totalAmount,
                type: 'income',
                category: 'Ventas',
                date: new Date().toISOString().split('T')[0]
            });

            addToast('success', 'Venta registrada y stock actualizado');
            setCart([]);
            setCustomerName('');
            loadProducts(); // Refresh inventory

        } catch (error) {
            console.error(error);
            addToast('error', 'Error al procesar la venta');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter Products
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.collection && p.collection.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-100px)]">
            {/* Left Col: Product Selector */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-serif text-stone-900 dark:text-white">Nueva Orden</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <Input
                            placeholder="Buscar en inventario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-lg p-3 flex flex-col gap-2 group hover:border-gold-400 transition-colors">
                            <div className="aspect-square bg-stone-100 dark:bg-stone-800 rounded-md overflow-hidden relative">
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                {product.status === ProductStatus.SOLD_OUT && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-white uppercase bg-red-500 px-2 py-1 rounded">Agotado</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">{product.name}</h4>
                                <p className="text-xs text-stone-500">{formatPrice(product.price, 'CLP')}</p>
                            </div>

                            {/* Actions / Variants */}
                            {product.variants && product.variants.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {product.variants.map((v: any) => (
                                        <button
                                            key={v.name}
                                            disabled={v.stock <= 0}
                                            onClick={() => addToCart(product, v)}
                                            className="text-[9px] px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-gold-500 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-stone-100"
                                            title={`Stock: ${v.stock}`}
                                        >
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="w-full text-xs h-7"
                                    disabled={product.status === ProductStatus.SOLD_OUT || (product.stock !== undefined && product.stock <= 0)}
                                    onClick={() => addToCart(product)}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Agregar
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Col: Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 sticky top-6 shadow-xl flex flex-col h-[calc(100vh-140px)]">
                    <div className="flex items-center gap-2 mb-6 text-gold-600">
                        <ShoppingCart className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-widest text-sm">Resumen de Venta</h3>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4 mb-6 border-b border-stone-200 dark:border-stone-800 pb-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Cliente</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <Input
                                    placeholder="Nombre del cliente"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="pl-9 h-9 text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Método de Pago</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <select
                                    className="w-full h-9 pl-9 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-md text-sm outline-none focus:border-gold-400"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Tarjeta">Tarjeta Débito/Crédito</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center">
                                <p className="text-xs italic">La orden está vacía</p>
                            </div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={idx} className="flex gap-3 bg-white dark:bg-stone-950 p-2 rounded-lg border border-stone-100 dark:border-stone-800">
                                    <img src={item.product.images[0]} className="w-10 h-10 object-cover rounded bg-stone-100" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate">{item.product.name}</p>
                                        <p className="text-[10px] text-stone-500">{item.variant ? item.variant.name : 'Standard'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold">{formatPrice((item.variant ? item.variant.price : item.product.price) * item.quantity, 'CLP')}</p>
                                        <div className="flex items-center justify-end gap-2 mt-1">
                                            <span className="text-[10px]">x{item.quantity}</span>
                                            <button onClick={() => removeFromCart(idx)} className="text-stone-400 hover:text-red-500">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold uppercase text-stone-500">Total a Pagar</span>
                            <span className="text-xl font-bold font-serif text-stone-900 dark:text-white">{formatPrice(calculateTotal(), 'CLP')}</span>
                        </div>
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold tracking-widest uppercase gap-2"
                            disabled={cart.length === 0 || isSubmitting}
                            onClick={handleSubmitOrder}
                        >
                            {isSubmitting ? 'Procesando...' : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" /> Confirmar Venta
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
