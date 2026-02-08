import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Button, StatusBadge, Modal } from '../components/UI';
import { supabaseProductService } from '../services/supabaseProductService';
import { Plus, Edit2, Trash2, AlertCircle, Package } from 'lucide-react';
import { ProductForm } from '../components/admin/ProductForm';

// --- MAIN ADMIN COMPONENT ---
export const AdminDashboard = () => {
  const { products, refreshProducts, addToast } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await supabaseProductService.delete(id);
      addToast('success', 'Producto eliminado');
      refreshProducts();
      setDeleteConfirm(null);
    } catch (e) {
      addToast('error', 'No se pudo eliminar el producto');
    }
  };

  const handleSave = () => {
    refreshProducts();
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

      {/* Product List Table */}
      <div className="w-full">
        <div className="grid grid-cols-12 px-6 py-4 border-b border-stone-100 dark:border-stone-800 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stone-400 hidden md:grid">
          <div className="col-span-6">Producto</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {products.map(product => (
            <div key={product.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-8 hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-all group">

              {/* Product Info */}
              <div className="col-span-1 md:col-span-6 flex items-center gap-6 mb-4 md:mb-0">
                <div className="relative w-20 h-24 overflow-hidden bg-stone-100 border border-stone-200 dark:border-stone-800 flex-shrink-0">
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-stone-900 dark:text-white leading-tight uppercase tracking-widest">{product.name}</h3>
                  <p className="text-[10px] font-mono text-stone-400 uppercase">{product.id.slice(0, 8)}...</p>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 mb-4 md:mb-0">
                <span className="font-serif text-lg md:text-base text-stone-600 dark:text-stone-300">
                  ${product.price.toLocaleString('es-CL')}
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
                  onClick={() => setDeleteConfirm(product.id)}
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
          <p className="text-stone-600 dark:text-stone-300 mb-8 font-serif leading-relaxed">
            ¿Estás seguro de que deseas eliminar esta pieza de lujo?<br />Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>No, Conservar</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Sí, Eliminar</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};