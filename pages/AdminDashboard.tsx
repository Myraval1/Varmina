import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductStatus } from '../types';
import { Button, Input, StatusBadge, Modal } from '../components/UI';
import { productService } from '../services/productService';
import { Plus, Edit2, Trash2, Upload, X, Save, AlertCircle, Package } from 'lucide-react';

// --- PRODUCT FORM ---
const ProductForm = ({ initialData, onSave, onCancel }: { 
  initialData?: Product, 
  onSave: () => void, 
  onCancel: () => void 
}) => {
  const { addToast } = useStore();
  const [formData, setFormData] = useState<Partial<Product>>(initialData || {
    name: '',
    description: '',
    price: 0,
    status: ProductStatus.IN_STOCK,
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.price || formData.price <= 0) newErrors.price = "Se requiere un precio válido";
    if ((formData.images?.length || 0) === 0) newErrors.images = "Se requiere al menos una imagen";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (initialData) {
        await productService.update(initialData.id, formData);
        addToast('success', 'Producto actualizado con éxito');
      } else {
        await productService.create(formData as Omit<Product, 'id' | 'createdAt'>);
        addToast('success', 'Producto creado con éxito');
      }
      onSave();
    } catch (error) {
      addToast('error', 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Create fake URLs for local preview
      const newImages = Array.from(e.target.files).map((file: File) => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Input 
          label="Nombre del Producto" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          error={errors.name}
        />
        <Input 
          label="Precio (CLP)" 
          type="number"
          value={formData.price} 
          onChange={e => setFormData({...formData, price: Number(e.target.value)})}
          error={errors.price}
        />
      </div>

      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-stone-500 mb-1">Descripción</label>
        <textarea 
          className="w-full bg-transparent border border-stone-300 p-3 text-stone-900 focus:border-gold-400 focus:outline-none min-h-[100px] dark:border-stone-700 dark:text-stone-100"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-stone-500 mb-1">Estado</label>
        <div className="flex gap-4">
          {Object.values(ProductStatus).map(s => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="status" 
                checked={formData.status === s}
                onChange={() => setFormData({...formData, status: s})}
                className="accent-gold-500"
              />
              <span className="text-sm">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-stone-500 mb-2">Imágenes</label>
        <div className="grid grid-cols-4 gap-4">
          {formData.images?.map((img, idx) => (
            <div key={idx} className="relative aspect-square group">
              <img src={img} className="w-full h-full object-cover rounded border border-stone-200" alt="upload" />
              <button 
                type="button"
                onClick={() => setFormData({...formData, images: formData.images?.filter((_, i) => i !== idx)})}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="border-2 border-dashed border-stone-300 hover:border-gold-400 flex flex-col items-center justify-center aspect-square cursor-pointer transition-colors dark:border-stone-700">
            <Upload className="w-6 h-6 text-stone-400 mb-2" />
            <span className="text-xs text-stone-500">Subir</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

// --- MAIN ADMIN COMPONENT ---
export const AdminDashboard = () => {
  const { products, refreshProducts, addToast } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id);
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
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl text-stone-900 dark:text-white mb-2">Inventario</h1>
          <p className="text-stone-500 text-sm">Gestiona tus productos</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" /> Agregar Producto
        </Button>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-stone-50 dark:bg-stone-900/50 text-xs uppercase tracking-wider text-stone-500 border-b border-stone-200 dark:border-stone-700">
            <tr>
              <th className="p-4 font-serif">Producto</th>
              <th className="p-4 font-serif">Precio</th>
              <th className="p-4 font-serif">Estado</th>
              <th className="p-4 font-serif text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded" />
                    <div>
                      <div className="font-medium text-stone-900 dark:text-white">{product.name}</div>
                      <div className="text-xs text-stone-400 truncate max-w-[200px]">{product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-stone-600 dark:text-stone-300 font-medium">
                  ${product.price.toLocaleString('es-CL')}
                </td>
                <td className="p-4">
                  <StatusBadge status={product.status} />
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-2 text-stone-400 hover:text-gold-500 hover:bg-stone-100 rounded-full dark:hover:bg-stone-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(product.id)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-12 text-center text-stone-400">
             <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
             <p>No hay productos en el inventario.</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal 
        isOpen={isCreating || !!editingProduct} 
        onClose={() => { setIsCreating(false); setEditingProduct(null); }}
        title={isCreating ? "Agregar Nueva Pieza" : "Editar Pieza"}
      >
        <ProductForm 
          initialData={editingProduct || undefined} 
          onSave={handleSave} 
          onCancel={() => { setIsCreating(false); setEditingProduct(null); }} 
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar Eliminación">
        <div className="text-center py-4">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-stone-600 mb-6">¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-3">
                <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
                <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Eliminar</Button>
            </div>
        </div>
      </Modal>

    </div>
  );
};