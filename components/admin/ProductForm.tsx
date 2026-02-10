import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductStatus } from '../../types';
import { Button, Input } from '../UI';
import { supabaseProductService } from '../../services/supabaseProductService';
import { Upload, X, GripVertical, Star, Check } from 'lucide-react';

interface ProductFormProps {
    initialData?: Product;
    onSave: () => void;
    onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
    const { addToast } = useStore();
    const [formData, setFormData] = useState<Partial<Product>>(initialData || {
        name: '',
        description: '',
        price: 0,
        status: ProductStatus.IN_STOCK,
        images: [],
        category: '',
        collection: '',
        badge: '',
        variants: []
    });
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "El nombre es obligatorio";
        if (formData.price === undefined || formData.price < 0) newErrors.price = "Se requiere un precio válido";
        if ((formData.images?.length || 0) === 0) newErrors.images = "Se requiere al menos una imagen";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addVariant = () => {
        const newVariant = { id: crypto.randomUUID(), name: '', price: formData.price || 0, images: [], isPrimary: false };
        setFormData(prev => ({ ...prev, variants: [...(prev.variants || []), newVariant] }));
    };

    const updateVariant = (id: string, field: string, value: any) => {
        setFormData(prev => {
            let nextVariants = prev.variants?.map(v => {
                if (v.id === id) {
                    const updated = { ...v, [field]: value };
                    return updated;
                }
                // If setting this one to primary, unset others
                if (field === 'isPrimary' && value === true) {
                    return { ...v, isPrimary: false };
                }
                return v;
            });
            return { ...prev, variants: nextVariants };
        });
    };

    const toggleVariantImage = (variantId: string, imageUrl: string) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants?.map(v => {
                if (v.id === variantId) {
                    const images = v.images || [];
                    const nextImages = images.includes(imageUrl)
                        ? images.filter((i: string) => i !== imageUrl)
                        : [...images, imageUrl];
                    return { ...v, images: nextImages };
                }
                return v;
            })
        }));
    };

    const removeVariant = (id: string) => {
        setFormData(prev => ({ ...prev, variants: prev.variants?.filter(v => v.id !== id) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const dataToSave = {
                name: formData.name!,
                description: formData.description,
                price: formData.price!,
                images: formData.images,
                status: formData.status,
                category: formData.category,
                collection: formData.collection,
                badge: formData.badge,
                variants: formData.variants,
            };

            if (initialData) {
                await supabaseProductService.update(initialData.id, dataToSave);
                addToast('success', 'Producto actualizado con éxito');
            } else {
                await supabaseProductService.create(dataToSave);
                addToast('success', 'Producto creado con éxito');
            }
            onSave();
        } catch (error) {
            console.error('Error saving product:', error);
            addToast('error', 'Error al guardar el producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            try {
                const uploadPromises = Array.from(e.target.files).map((file: File) =>
                    supabaseProductService.uploadImage(file)
                );

                const uploadedUrls = await Promise.all(uploadPromises);
                setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...uploadedUrls] }));
                addToast('success', `${uploadedUrls.length} imagen(es) subida(s)`);
            } catch (error) {
                console.error('Error uploading images:', error);
                addToast('error', 'Error al subir imágenes');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemoveImage = async (imageUrl: string, index: number) => {
        try {
            if (imageUrl.includes('supabase')) {
                await supabaseProductService.deleteImage(imageUrl);
            }
            setFormData(prev => ({
                ...prev,
                images: prev.images?.filter((_, i) => i !== index),
                variants: prev.variants?.map(v => ({
                    ...v,
                    images: v.images?.filter((i: string) => i !== imageUrl)
                }))
            }));
        } catch (error) {
            console.error('Error removing image:', error);
            addToast('error', 'Error al eliminar imagen');
        }
    };

    const handleDragStart = (idx: number) => setDraggedIdx(idx);
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (idx: number) => {
        if (draggedIdx === null) return;
        const nextImages = [...(formData.images || [])];
        const draggedItem = nextImages[draggedIdx];
        nextImages.splice(draggedIdx, 1);
        nextImages.splice(idx, 0, draggedItem);
        setFormData({ ...formData, images: nextImages });
        setDraggedIdx(null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto px-2 hide-scrollbar pb-8">

            {/* 1. Información Principal */}
            <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-2">Información Principal</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Input
                            label="Nombre del Producto"
                            placeholder="Ej: Collar Luz de Luna"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            error={errors.name}
                        />
                    </div>
                    <div>
                        <Input
                            label="Precio Base (CLP)"
                            type="number"
                            placeholder="0"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            error={errors.price}
                            className="font-serif text-lg"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-stone-400 mb-2">Descripción</label>
                    <textarea
                        className="w-full bg-stone-50 md:bg-transparent border border-stone-200 p-4 text-stone-900 font-sans text-sm focus:border-gold-400 focus:outline-none min-h-[120px] dark:border-stone-700 dark:text-stone-100 transition-colors resize-none leading-relaxed rounded-sm"
                        placeholder="Escribe la historia o detalles técnicos de la pieza..."
                        value={formData.description || ''}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            </div>

            {/* 2. Categorización */}
            <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-2">Clasificación</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                        label="Categoría"
                        placeholder="Anillos, Aros..."
                        value={formData.category || ''}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    />
                    <Input
                        label="Colección"
                        placeholder="Invierno 2024..."
                        value={formData.collection || ''}
                        onChange={e => setFormData({ ...formData, collection: e.target.value })}
                    />
                    <Input
                        label="Badge / Etiqueta"
                        placeholder="Más Vendido, Único..."
                        value={formData.badge || ''}
                        onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    />
                </div>
            </div>

            {/* 3. Multimedia */}
            <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-2">Multimedia</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {formData.images?.map((img, idx) => (
                        <div
                            key={idx}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(idx)}
                            className={`relative aspect-[3/4] group overflow-hidden bg-stone-50 border border-stone-100 rounded-sm cursor-move transition-transform ${draggedIdx === idx ? 'opacity-30' : ''}`}
                        >
                            <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="upload" />
                            <div className="absolute top-2 left-2 bg-stone-900/60 p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <GripVertical className="w-3 h-3 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(img, idx)}
                                    className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 bg-stone-900/50 text-white text-[9px] text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {idx === 0 ? 'Portada' : `Imagen ${idx + 1}`}
                            </div>
                        </div>
                    ))}
                    <label className={`
                        border-2 border-dashed border-stone-200 rounded-sm flex flex-col items-center justify-center aspect-[3/4] cursor-pointer transition-all hover:border-gold-400 hover:bg-stone-50 group
                        ${isUploading ? 'opacity-50 cursor-wait' : ''}
                    `}>
                        <div className="flex flex-col items-center gap-2 group-hover:translate-y-[-2px] transition-transform">
                            <Upload className="w-6 h-6 text-stone-300 group-hover:text-gold-500" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-gold-600">
                                {isUploading ? '...' : 'Subir'}
                            </span>
                        </div>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                </div>
                {errors.images && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 p-2 rounded-sm inline-block">{errors.images}</p>}
            </div>

            {/* 4. Variantes */}
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white">Variantes</h3>
                    <button type="button" onClick={addVariant} className="flex items-center gap-1 text-[10px] font-bold text-gold-600 uppercase tracking-widest hover:text-gold-700 bg-gold-50 px-3 py-1.5 rounded-full transition-colors">
                        <span className="text-lg leading-none mb-0.5">+</span> Añadir
                    </button>
                </div>

                <div className="space-y-4">
                    {formData.variants?.map((v) => (
                        <div key={v.id} className="p-4 bg-white md:bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 rounded-sm shadow-sm">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end mb-4">
                                <div className="flex-1 w-full">
                                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1 block">Nombre</label>
                                    <input
                                        placeholder="Ej: Oro Rosa"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-2.5 text-xs focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none rounded-sm"
                                        value={v.name}
                                        onChange={e => updateVariant(v.id, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-32">
                                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1 block">Precio</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-2.5 text-xs focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none rounded-sm"
                                        value={v.price}
                                        onChange={e => updateVariant(v.id, 'price', Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                                    <button
                                        type="button"
                                        onClick={() => updateVariant(v.id, 'isPrimary', !v.isPrimary)}
                                        className={`flex-1 md:flex-none p-2.5 rounded-sm transition-all border ${v.isPrimary ? 'border-gold-200 bg-gold-50 text-gold-600' : 'border-stone-200 text-stone-300 hover:text-stone-500'}`}
                                        title="Marcar como Principal"
                                    >
                                        <Star className={`w-4 h-4 mx-auto ${v.isPrimary ? 'fill-current' : ''}`} />
                                    </button>
                                    <button type="button" onClick={() => removeVariant(v.id)} className="flex-1 md:flex-none p-2.5 text-red-400 hover:text-red-600 bg-red-50 border border-red-100 rounded-sm">
                                        <X className="w-4 h-4 mx-auto" />
                                    </button>
                                </div>
                            </div>

                            {/* Images for this variant */}
                            <div className="pt-3 border-t border-stone-100 dark:border-stone-800/50">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2">Imágenes Específicas:</p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.images?.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => toggleVariantImage(v.id, img)}
                                            className={`relative w-10 h-14 border-2 transition-all rounded-sm overflow-hidden ${v.images?.includes(img) ? 'border-gold-500 scale-105 opacity-100' : 'border-transparent opacity-30 hover:opacity-80'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" />
                                            {v.images?.includes(img) && (
                                                <div className="absolute top-0 right-0 bg-gold-500 text-white p-0.5 rounded-bl-sm">
                                                    <Check className="w-2 h-2" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    {(!formData.images || formData.images.length === 0) && (
                                        <p className="text-[9px] italic text-stone-400">Sube imágenes generales primero</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {formData.variants?.length === 0 && (
                        <div className="text-center py-6 bg-stone-50 dark:bg-stone-900 rounded-sm border border-dashed border-stone-200">
                            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Sin variantes (Producto Único)</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 5. Estado */}
            <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-stone-400">Disponibilidad Actual</label>
                <div className="flex flex-wrap gap-4">
                    {[
                        { id: ProductStatus.IN_STOCK, label: 'Disponible', color: 'bg-green-500' },
                        { id: ProductStatus.MADE_TO_ORDER, label: 'Por Encargo', color: 'bg-blue-500' },
                        { id: ProductStatus.SOLD_OUT, label: 'Agotado', color: 'bg-stone-900' }
                    ].map(s => (
                        <label key={s.id} className={`
                            flex items-center gap-3 cursor-pointer group px-4 py-3 rounded-sm border transition-all
                            ${formData.status === s.id ? 'border-stone-300 bg-stone-50 dark:bg-stone-800' : 'border-stone-100 bg-white dark:bg-transparent hover:border-stone-300'}
                        `}>
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="status"
                                    checked={formData.status === s.id}
                                    onChange={() => setFormData({ ...formData, status: s.id as ProductStatus })}
                                    className="peer appearance-none w-4 h-4 border-2 border-stone-300 rounded-full checked:border-stone-900 transition-all cursor-pointer"
                                />
                                <div className={`absolute w-2 h-2 rounded-full scale-0 peer-checked:scale-100 transition-transform ${s.color}`} />
                            </div>
                            <span className={`text-xs uppercase tracking-wider font-bold transition-colors ${formData.status === s.id ? 'text-stone-900 dark:text-white' : 'text-stone-400 group-hover:text-stone-600'}`}>
                                {s.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 dark:bg-stone-950/95 backdrop-blur-sm -mx-2 px-2 py-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3 z-10">
                <Button type="button" variant="ghost" onClick={onCancel} className='uppercase tracking-widest text-[10px]'>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting} size="lg" className='uppercase tracking-widest text-[10px] px-8 bg-stone-900 text-white hover:bg-gold-600 border-none'>
                    {initialData ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
            </div>
        </form>
    );
};
