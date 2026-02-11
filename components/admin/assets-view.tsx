'use client';

import React, { useState, useEffect } from 'react';
import { internalAssetService, CreateAssetInput } from '@/services/internalAssetService';
import { supabaseProductService } from '@/services/supabaseProductService';
import { attributeService, ProductAttribute } from '@/services/attributeService';
import { InternalAsset, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { useStore } from '@/context/StoreContext';
import {
    Package,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Box,
    ShoppingBag,
    Check,
    X,
    List,
    Warehouse,
    AlertCircle
} from 'lucide-react';
import { AttributeManagerSection } from './attribute-manager';

export const AssetsView: React.FC = () => {
    const { addToast } = useStore();

    // TABS
    const [activeTab, setActiveTab] = useState<'internal' | 'store' | 'attributes'>('internal');

    // DATA STATE
    const [assets, setAssets] = useState<InternalAsset[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [erpCategories, setErpCategories] = useState<ProductAttribute[]>([]);
    const [assetCategories, setAssetCategories] = useState<ProductAttribute[]>([]);

    // UI STATE
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // MODAL / EDIT STATE (Internal Assets)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<InternalAsset | null>(null);
    const [assetFormData, setAssetFormData] = useState<CreateAssetInput>({
        name: '', category: 'Insumos', stock: 0, min_stock: 5, unit_cost: 0, location: '', description: ''
    });

    // INLINE EDIT STATE (Store Products)
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ unit_cost: number; location: string; erp_category: string }>({
        unit_cost: 0, location: '', erp_category: ''
    });

    // const internalCategories = ['Insumos', 'Packaging', 'Transporte', 'Almacenamiento', 'Mobiliario', 'Herramientas'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [assetsData, productsData, erpCats, assetCats] = await Promise.all([
                internalAssetService.getAll(),
                supabaseProductService.getAll(),
                attributeService.getByType('erp_category'),
                attributeService.getByType('asset_category')
            ]);
            setAssets(assetsData);
            setProducts(productsData);
            setErpCategories(erpCats);
            setAssetCategories(assetCats);
        } catch (error) {
            console.error(error);
            addToast('error', 'Error al cargar datos de inventario');
        } finally {
            setLoading(false);
        }
    };

    // --- INTERNAL ASSETS LOGIC ---
    const handleAssetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAsset) {
                await internalAssetService.update(editingAsset.id, assetFormData);
                addToast('success', 'Activo actualizado');
            } else {
                await internalAssetService.create(assetFormData);
                addToast('success', 'Activo registrado');
            }
            setIsModalOpen(false);
            setEditingAsset(null);
            resetAssetForm();
            loadData();
        } catch (error) {
            addToast('error', 'Error al guardar');
        }
    };

    const resetAssetForm = () => {
        setAssetFormData({
            name: '', category: 'Insumos', stock: 0, min_stock: 5, unit_cost: 0, location: '', description: ''
        });
    };

    const prepareEditAsset = (asset: InternalAsset) => {
        setEditingAsset(asset);
        setAssetFormData({
            name: asset.name,
            category: asset.category,
            stock: asset.stock,
            min_stock: asset.min_stock,
            unit_cost: asset.unit_cost,
            location: asset.location || '',
            description: asset.description || ''
        });
        setIsModalOpen(true);
    };

    const deleteAsset = async (id: string) => {
        if (!confirm('¿Eliminar este activo del inventario?')) return;
        try {
            await internalAssetService.delete(id);
            setAssets(assets.filter(a => a.id !== id));
            addToast('success', 'Activo eliminado');
        } catch (error) {
            addToast('error', 'Error al eliminar');
        }
    };

    // --- STORE PRODUCTS LOGIC ---
    const startEditingProduct = (product: Product) => {
        setEditingProductId(product.id);
        setEditForm({
            unit_cost: product.unit_cost || 0,
            location: product.location || '',
            erp_category: product.erp_category || ''
        });
    };

    const saveProductEdit = async (id: string) => {
        try {
            await supabaseProductService.update(id, {
                unit_cost: editForm.unit_cost,
                location: editForm.location,
                erp_category: editForm.erp_category
            });

            // Optimistic update
            setProducts(products.map(p => p.id === id ? {
                ...p,
                unit_cost: editForm.unit_cost,
                location: editForm.location,
                erp_category: editForm.erp_category
            } : p));

            setEditingProductId(null);
            addToast('success', 'Datos ERP actualizados');
        } catch (error) {
            addToast('error', 'Error al actualizar producto');
        }
    };

    // --- FILTERS & STATS ---
    const filteredAssets = assets.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.erp_category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.erp_category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Calculate Totals based on ACTIVE TAB content primarily, or summary of both?
    // Let's show summary of the ACTIVE VIEW to be specific.

    const currentList = activeTab === 'internal' ? filteredAssets : filteredProducts;

    // For products, stock might be undefined in some types but we defaulting it to 0
    const totalValue = activeTab === 'internal'
        ? assets.reduce((acc, curr) => acc + (curr.stock * curr.unit_cost), 0)
        : products.reduce((acc, curr) => acc + ((curr.stock || 0) * (curr.unit_cost || 0)), 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
                <div>
                    <h2 className="text-xl md:text-2xl font-serif text-stone-900 dark:text-white uppercase tracking-widest">Operaciones & Logística</h2>
                    <p className="text-stone-500 text-[10px] md:text-sm uppercase tracking-widest">Control de inventario, costos y ubicación física de piezas.</p>
                </div>

                {activeTab === 'internal' && (
                    <Button
                        onClick={() => { resetAssetForm(); setEditingAsset(null); setIsModalOpen(true); }}
                        className="bg-stone-900 text-white dark:bg-gold-500 dark:text-stone-900 flex items-center gap-2 px-6 rounded-full shadow-lg"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Activo
                    </Button>
                )}
            </div>

            {/* TAB SWITCHER */}
            <div className="flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl w-full md:w-fit overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => { setActiveTab('internal'); setSelectedCategory('All'); }}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === 'internal' ? 'bg-white dark:bg-stone-700 shadow-md text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Box className="w-3.5 h-3.5" /> Activos Internos
                </button>
                <button
                    onClick={() => { setActiveTab('store'); setSelectedCategory('All'); }}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === 'store' ? 'bg-white dark:bg-stone-700 shadow-md text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <ShoppingBag className="w-3.5 h-3.5" /> Inventario Tienda
                </button>
                <button
                    onClick={() => { setActiveTab('attributes'); setSelectedCategory('All'); }}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === 'attributes' ? 'bg-white dark:bg-stone-700 shadow-md text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <List className="w-3.5 h-3.5" /> Listado Maestros
                </button>
            </div>


            {
                activeTab === 'attributes' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AttributeManagerSection />
                    </div>
                ) : (
                    <>
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm relative overflow-hidden">
                                <div className="absolute right-[-10px] top-[-10px] opacity-5">
                                    <Warehouse className="w-24 h-24" />
                                </div>
                                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                    Valor {activeTab === 'internal' ? 'Insumos' : 'Piezas'}
                                </p>
                                <h4 className="text-2xl md:text-3xl font-serif text-stone-900 dark:text-gold-200">{formatCurrency(totalValue)}</h4>
                                <p className="text-[10px] text-stone-400 mt-2 font-medium uppercase tracking-wide">Inversión en {activeTab === 'internal' ? 'Stock' : 'Joyas'}</p>
                            </div>

                            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm relative overflow-hidden">
                                <div className="absolute right-[-10px] top-[-10px] opacity-5">
                                    <Package className="w-24 h-24" />
                                </div>
                                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">Items Únicos</p>
                                <h4 className="text-2xl md:text-3xl font-serif text-stone-900 dark:text-white">
                                    {activeTab === 'internal' ? assets.length : products.length}
                                </h4>
                                <p className="text-[10px] text-stone-400 mt-2 font-medium uppercase tracking-wide">Variedad Registrada</p>
                            </div>

                            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm relative overflow-hidden">
                                <div className="absolute right-[-10px] top-[-10px] opacity-5">
                                    <Box className="w-24 h-24" />
                                </div>
                                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">Unidades Totales</p>
                                <h4 className="text-2xl md:text-3xl font-serif text-stone-900 dark:text-white">
                                    {activeTab === 'internal'
                                        ? assets.reduce((acc, curr) => acc + curr.stock, 0)
                                        : products.reduce((acc, curr) => acc + (curr.stock || 0), 0)
                                    }
                                </h4>
                                <p className="text-[10px] text-stone-400 mt-2 font-medium uppercase tracking-wide">Físico Disponible</p>
                            </div>

                            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm relative overflow-hidden">
                                <div className="absolute right-[-10px] top-[-10px] opacity-5">
                                    <AlertCircle className={`w-24 h-24 ${activeTab === 'internal' && assets.some(a => a.stock <= a.min_stock) ? 'text-red-500 opacity-20' : ''}`} />
                                </div>
                                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">Alertas Stock</p>
                                <h4 className={`text-2xl md:text-3xl font-serif ${activeTab === 'internal' && assets.filter(a => a.stock <= a.min_stock).length > 0 ? 'text-red-500' : 'text-stone-900 dark:text-white'}`}>
                                    {activeTab === 'internal'
                                        ? assets.filter(a => a.stock <= a.min_stock).length
                                        : products.filter(p => (p.stock || 0) <= 2).length
                                    }
                                </h4>
                                <p className="text-[10px] text-stone-400 mt-2 font-medium uppercase tracking-wide">Items por Reponer</p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden">
                            {/* Filters */}
                            <div className="p-3 md:p-4 border-b border-stone-100 dark:border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-md w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                                    <div className="p-2 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-100 dark:border-stone-700 shrink-0">
                                        <Filter className="w-3 h-3 text-stone-400" />
                                    </div>
                                    <button onClick={() => setSelectedCategory('All')} className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${selectedCategory === 'All' ? 'bg-stone-900 text-white border-stone-900 shadow-sm' : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800'}`}>Todos</button>

                                    {activeTab === 'internal' ? (
                                        assetCategories.map(cat => (
                                            <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === cat.name ? 'bg-gold-500 text-stone-900 border-gold-600 shadow-sm' : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800'}`}>{cat.name}</button>
                                        ))
                                    ) : (
                                        erpCategories.map(cat => (
                                            <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === cat.name ? 'bg-gold-500 text-stone-900 border-gold-600 shadow-sm' : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800'}`}>{cat.name}</button>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-stone-50/50 dark:bg-stone-950/30 text-[10px] uppercase tracking-[0.2em] text-stone-400 border-b border-stone-100 dark:border-stone-800">
                                            <th className="p-5 font-bold">Ítem / Nombre</th>
                                            <th className="p-5 font-bold">Ubicación</th>
                                            <th className="p-5 font-bold">Categoría ERP</th>
                                            <th className="p-5 font-bold text-center">Stock</th>
                                            <th className="p-5 font-bold text-right">Costo Unit.</th>
                                            <th className="p-5 font-bold text-right">Valor Total</th>
                                            <th className="p-5 font-bold text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50 dark:divide-stone-800/50">
                                        {activeTab === 'internal' ? (
                                            // INTERNAL ASSETS ROW
                                            filteredAssets.map(asset => (
                                                <tr key={asset.id} className="hover:bg-stone-50/30 dark:hover:bg-stone-800/30 transition-colors">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-medium text-xs uppercase text-stone-900 dark:text-white">{asset.name}</div>
                                                            {asset.stock <= (asset.min_stock || 0) && (
                                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Bajo Stock" />
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-stone-400">{asset.category}</div>
                                                    </td>
                                                    <td className="p-5 text-xs text-stone-500">{asset.location || '-'}</td>
                                                    <td className="p-5">
                                                        <span className={`px-2 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${asset.stock <= (asset.min_stock || 0) ? 'bg-red-50 text-red-600 dark:bg-red-900/10' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}>
                                                            {asset.category}
                                                        </span>
                                                    </td>
                                                    <td className={`p-5 text-center text-xs font-mono font-bold ${asset.stock <= (asset.min_stock || 0) ? 'text-red-500' : ''}`}>{asset.stock}</td>
                                                    <td className="p-5 text-right text-xs font-mono text-stone-500">{formatCurrency(asset.unit_cost)}</td>
                                                    <td className="p-5 text-right text-xs font-mono font-bold text-stone-900 dark:text-white">{formatCurrency(asset.stock * asset.unit_cost)}</td>
                                                    <td className="p-5 text-center flex justify-center gap-2">
                                                        <button onClick={() => prepareEditAsset(asset)} className="p-2 text-stone-400 hover:text-stone-900"><Edit2 className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => deleteAsset(asset.id)} className="p-2 text-stone-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            // STORE PRODUCTS ROW
                                            filteredProducts.map(product => {
                                                const isEditing = editingProductId === product.id;
                                                return (
                                                    <tr key={product.id} className="hover:bg-stone-50/30 dark:hover:bg-stone-800/30 transition-colors">
                                                        <td className="p-5">
                                                            <div className="flex items-center gap-3">
                                                                <img src={product.images[0]} className="w-8 h-8 rounded object-cover bg-stone-100" />
                                                                <div>
                                                                    <div className="font-medium text-xs uppercase text-stone-900 dark:text-white max-w-[150px] truncate" title={product.name}>{product.name}</div>
                                                                    <div className="text-[9px] text-stone-400">SKU: {product.id.slice(0, 6)}</div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Location */}
                                                        <td className="p-5">
                                                            {isEditing ? (
                                                                <input
                                                                    className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded p-1"
                                                                    value={editForm.location}
                                                                    onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                                                    placeholder="Ubicación..."
                                                                />
                                                            ) : (
                                                                <span className="text-xs text-stone-500">{product.location || '-'}</span>
                                                            )}
                                                        </td>

                                                        {/* ERP Category */}
                                                        <td className="p-5">
                                                            {isEditing ? (
                                                                <select
                                                                    className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded p-1"
                                                                    value={editForm.erp_category}
                                                                    onChange={e => setEditForm({ ...editForm, erp_category: e.target.value })}
                                                                >
                                                                    <option value="">Seleccionar...</option>
                                                                    {erpCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                                </select>
                                                            ) : (
                                                                <span className={`px-2 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${product.erp_category ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/10' : 'bg-stone-100 text-stone-400'}`}>
                                                                    {product.erp_category || 'Sin Clasificar'}
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Stock (Read Only here, managed in Inventory) */}
                                                        <td className="p-5 text-center text-xs font-mono font-bold bg-stone-50/50 dark:bg-stone-900/50">
                                                            {product.stock || 0}
                                                        </td>

                                                        {/* Unit Cost */}
                                                        <td className="p-5 text-right">
                                                            {isEditing ? (
                                                                <input
                                                                    type="number"
                                                                    className="w-20 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded p-1 text-right"
                                                                    value={editForm.unit_cost}
                                                                    onChange={e => setEditForm({ ...editForm, unit_cost: Number(e.target.value) })}
                                                                />
                                                            ) : (
                                                                <span className="text-xs font-mono text-stone-500">{formatCurrency(product.unit_cost || 0)}</span>
                                                            )}
                                                        </td>

                                                        {/* Total */}
                                                        <td className="p-5 text-right text-xs font-mono font-bold text-stone-900 dark:text-white">
                                                            {formatCurrency((product.stock || 0) * (editForm.unit_cost || product.unit_cost || 0))}
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="p-5 text-center">
                                                            {isEditing ? (
                                                                <div className="flex justify-center gap-1">
                                                                    <button onClick={() => saveProductEdit(product.id)} className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100"><Check className="w-3.5 h-3.5" /></button>
                                                                    <button onClick={() => setEditingProductId(null)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><X className="w-3.5 h-3.5" /></button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => startEditingProduct(product)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                                                                    <Edit2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            }

            {/* Asset Modal (Internal Only) */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAsset ? 'Editar Activo' : 'Registrar Nuevo Activo'}
                size="lg"
            >
                <form onSubmit={handleAssetSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Input label="Nombre" value={assetFormData.name} onChange={e => setAssetFormData({ ...assetFormData, name: e.target.value })} required />
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Categoría</label>
                                <select className="w-full bg-stone-50 dark:bg-stone-950 p-3 rounded-lg border border-stone-200 dark:border-stone-800 text-sm" value={assetFormData.category} onChange={e => setAssetFormData({ ...assetFormData, category: e.target.value })}>
                                    <option value="">Seleccionar...</option>
                                    {assetCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Stock" type="number" value={assetFormData.stock} onChange={e => setAssetFormData({ ...assetFormData, stock: Number(e.target.value) })} required />
                                <Input label="Mínimo" type="number" value={assetFormData.min_stock} onChange={e => setAssetFormData({ ...assetFormData, min_stock: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Input label="Costo Unitario" type="number" value={assetFormData.unit_cost} onChange={e => setAssetFormData({ ...assetFormData, unit_cost: Number(e.target.value) })} />
                            <Input label="Ubicación" value={assetFormData.location} onChange={e => setAssetFormData({ ...assetFormData, location: e.target.value })} />
                            <textarea className="w-full p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm h-24" placeholder="Notas..." value={assetFormData.description} onChange={e => setAssetFormData({ ...assetFormData, description: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="bg-stone-900 text-white dark:bg-gold-500 dark:text-stone-900">Guardar</Button>
                    </div>
                </form>
            </Modal>
        </div >
    );
};
