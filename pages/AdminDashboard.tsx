import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductStatus } from '../types';
import { Button, StatusBadge, Modal } from '../components/UI';
import { supabaseProductService } from '../services/supabaseProductService';
import { Plus, Edit2, Trash2, AlertCircle, Package } from 'lucide-react';
import { ProductForm } from '../components/admin/ProductForm';

// --- MAIN ADMIN COMPONENT ---
export const AdminDashboard = () => {
  const { products, refreshProducts, addToast } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) setSelectedIds([]);
    else setSelectedIds(products.map(p => p.id));
  };

  const handleDeleteBulk = async () => {
    if (!deleteConfirm) return;
    try {
      await supabaseProductService.deleteBulk(deleteConfirm);
      addToast('success', `${deleteConfirm.length} producto(s) eliminado(s)`);
      refreshProducts(true);
      setDeleteConfirm(null);
      setSelectedIds([]);
    } catch (e) {
      addToast('error', 'Error al eliminar productos');
    }
  };

  const handleBulkStatusChange = async (status: ProductStatus) => {
    try {
      await supabaseProductService.updateStatusBulk(selectedIds, status);
      addToast('success', 'Estado actualizado en lote');
      refreshProducts(true);
      setSelectedIds([]);
    } catch (e) {
      addToast('error', 'Error al actualizar estados');
    }
  };

  const handleSave = () => {
    refreshProducts(true);
    setEditingProduct(null);
    setIsCreating(false);
  };

  return (
    <div className="flex-1 px-6 py-12 md:px-12 bg-white dark:bg-stone-950 min-h-screen">

      {/* Dashboard Top Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <h1 className="font-serif text-4xl text-stone-900 dark:text-gold-200 tracking-wider mb-2 uppercase">Inventario</h1>
          <p className="text-stone-400 text-sm font-sans tracking-wide uppercase font-bold text-[10px]">Gestiona tus piezas exclusivas</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex gap-2">
          <Plus className="w-5 h-5" /> Agregar Producto
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-20 z-20 bg-stone-900 text-white p-4 mb-4 flex items-center justify-between rounded-sm shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest">{selectedIds.length} seleccionados</span>
            <div className="h-4 w-px bg-stone-700" />
            <button onClick={() => handleBulkStatusChange(ProductStatus.IN_STOCK)} className="text-[10px] uppercase font-bold tracking-widest hover:text-gold-400 transition-colors">Disponible</button>
            <button onClick={() => handleBulkStatusChange(ProductStatus.SOLD_OUT)} className="text-[10px] uppercase font-bold tracking-widest hover:text-gold-400 transition-colors">Agotado</button>
          </div>
          <button onClick={() => setDeleteConfirm(selectedIds)} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            Eliminar Lote
          </button>
        </div>
      )}

      {/* Product List Table */}
      <div className="w-full">
        <div className="grid grid-cols-12 px-6 py-4 border-b border-stone-100 dark:border-stone-800 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400 hidden md:grid">
          <div className="col-span-1 border-r border-stone-800/0">
            <input type="checkbox" checked={selectedIds.length === products.length && products.length > 0} onChange={toggleSelectAll} className="w-4 h-4 accent-gold-500 rounded-sm" />
          </div>
          <div className="col-span-5">Producto / Interés</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {products.map(product => (
            <div key={product.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-8 hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-all group">

              <div className="col-span-1 hidden md:block">
                <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelect(product.id)} className="w-4 h-4 accent-gold-500 rounded-sm" />
              </div>

              {/* Product Info */}
              <div className="col-span-1 md:col-span-5 flex items-center gap-6 mb-4 md:mb-0">
                <div className="relative w-20 h-24 overflow-hidden bg-stone-100 border border-stone-200 dark:border-stone-800 flex-shrink-0">
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg text-stone-900 dark:text-white leading-tight uppercase tracking-widest">{product.name}</h3>
                    {product.category && (
                      <span className="text-[8px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-stone-500 rounded-full font-bold">{product.category}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gold-600 bg-gold-50 dark:bg-gold-950/20 px-2 py-0.5 rounded-sm">
                      <span className="font-bold text-[10px]">{product.whatsapp_clicks || 0} Clicks</span>
                    </div>
                    <p className="text-[10px] font-mono text-stone-400 uppercase">{product.id.slice(0, 8)}...</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 mb-4 md:mb-0">
                <span className="font-serif text-lg md:text-base text-stone-600 dark:text-stone-300">
                  ${product.price ? product.price.toLocaleString('es-CL') : '0'}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2 mb-6 md:mb-0">
                <StatusBadge status={product.status} />
              </div>

              {/* Actions */}
              <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-3 md:opacity-0 group-hover:md:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="p-3 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full dark:hover:bg-stone-800 transition-all"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm([product.id])}
                  className="p-3 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full dark:hover:bg-red-900/30 transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-24 text-center">
            <Package className="w-16 h-16 mx-auto mb-6 text-stone-200" />
            <p className="font-serif text-xl text-stone-400 uppercase tracking-widest">No hay piezas en el inventario.</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isCreating || !!editingProduct}
        onClose={() => { setIsCreating(false); setEditingProduct(null); }}
        title={isCreating ? "Agregar Pieza" : "Editar Pieza"}
      >
        <ProductForm
          initialData={editingProduct || undefined}
          onSave={handleSave}
          onCancel={() => { setIsCreating(false); setEditingProduct(null); }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar Eliminación">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <p className="text-stone-600 dark:text-stone-300 mb-8 font-serif leading-relaxed px-4">
            ¿Estás seguro de que deseas eliminar {deleteConfirm && deleteConfirm.length > 1 ? 'estos productos' : 'esta pieza de lujo'}?<br />Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>No, Conservar</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteBulk}>Sí, Eliminar</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};