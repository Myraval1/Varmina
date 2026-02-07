import { supabase } from '../lib/supabase';
import { Product, ProductStatus } from '../types';

export interface CreateProductInput {
    name: string;
    description?: string | null;
    price: number;
    images?: string[];
    status?: ProductStatus;
}

export interface UpdateProductInput {
    name?: string;
    description?: string | null;
    price?: number;
    images?: string[];
    status?: ProductStatus;
}

export const supabaseProductService = {
    // Get all products
    getAll: async (): Promise<Product[]> => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products. Please try again later.');
        }

        return data || [];
    },

    // Get single product by ID
    getById: async (id: string): Promise<Product | null> => {
        if (!id) return null;

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            return null;
        }

        return data;
    },

    // Create new product
    create: async (input: CreateProductInput): Promise<Product> => {
        // Validation & Sanitization
        if (!input.name || input.name.trim().length === 0) throw new Error('El nombre es obligatorio');
        if (typeof input.price !== 'number' || input.price < 0) throw new Error('El precio debe ser un número positivo');

        const sanitizedData = {
            name: input.name.trim().slice(0, 100), // Limit name length
            description: input.description?.trim().slice(0, 2000) || null,
            price: Math.max(0, input.price),
            images: input.images || [],
            status: input.status || ProductStatus.IN_STOCK,
        };

        const { data, error } = await supabase
            .from('products')
            .insert(sanitizedData)
            .select()
            .single();

        if (error) {
            console.error('Error creating product:', error);
            throw new Error('No se pudo crear el producto. Verifique su conexión.');
        }

        return data;
    },

    // Update existing product
    update: async (id: string, updates: UpdateProductInput): Promise<Product> => {
        if (!id) throw new Error('ID de producto no proporcionado');

        // Validation & Sanitization
        const sanitizedUpdates: any = {};
        if (updates.name) sanitizedUpdates.name = updates.name.trim().slice(0, 100);
        if (updates.description !== undefined) sanitizedUpdates.description = updates.description?.trim().slice(0, 2000) || null;
        if (updates.price !== undefined) sanitizedUpdates.price = Math.max(0, updates.price);
        if (updates.images) sanitizedUpdates.images = updates.images;
        if (updates.status) sanitizedUpdates.status = updates.status;

        const { data, error } = await supabase
            .from('products')
            .update(sanitizedUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating product:', error);
            throw new Error('No se pudo actualizar el producto.');
        }

        return data;
    },

    // Delete product
    delete: async (id: string): Promise<void> => {
        if (!id) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            throw new Error('Error al eliminar el producto.');
        }
    },

    // Upload image to Supabase Storage
    uploadImage: async (file: File): Promise<string> => {
        // Strict Validation
        if (!file.type.startsWith('image/')) {
            throw new Error('Solo se permiten archivos de imagen.');
        }

        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_SIZE) {
            throw new Error('La imagen es demasiado grande. Máximo 10MB.');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error('Error al subir la imagen. Intente de nuevo.');
        }

        // Get public URL
        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    // Delete image from Supabase Storage
    deleteImage: async (imageUrl: string): Promise<void> => {
        if (!imageUrl || !imageUrl.includes('/product-images/')) return;

        const urlParts = imageUrl.split('/product-images/');
        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from('product-images')
            .remove([filePath]);

        if (error) {
            console.error('Error deleting image from storage:', error);
        }
    },
};
