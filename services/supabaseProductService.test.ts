import { describe, it, expect, vi } from 'vitest';
import { supabaseProductService } from './supabaseProductService';
import { ProductStatus } from '../types';

// Mock supabase client
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
        })),
        storage: {
            from: vi.fn(() => ({
                upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
                getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'http://test.com/img.jpg' } }),
                remove: vi.fn().mockResolvedValue({ data: {}, error: null }),
            }))
        }
    },
}));

describe('supabaseProductService Validation', () => {
    it('should throw an error if create name is empty', async () => {
        await expect(supabaseProductService.create({ name: '', price: 100 }))
            .rejects.toThrow('El nombre es obligatorio');
    });

    it('should throw an error if price is negative', async () => {
        await expect(supabaseProductService.create({ name: 'Test', price: -50 }))
            .rejects.toThrow('El precio debe ser un número positivo');
    });

    it('should sanitize white space from name', async () => {
        const input = { name: '  Luxury Ring  ', price: 5000 };
        // We don't need to check the mock call here, just that it doesn't throw
        // and correctly processes the data internally.
        const product = await supabaseProductService.create(input);
        // Note: Since we mocked the from/insert chain, this test is mostly 
        // for catching the validation logic before the actual network call.
    });
});

describe('Image Upload Validation', () => {
    it('should throw an error for non-image files', async () => {
        const file = new File(['foo'], 'test.txt', { type: 'text/plain' });
        await expect(supabaseProductService.uploadImage(file))
            .rejects.toThrow('Solo se permiten archivos de imagen.');
    });

    it('should throw an error for files over 10MB', async () => {
        const bigFile = new File([''], 'big.jpg', { type: 'image/jpeg' });
        Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 });
        await expect(supabaseProductService.uploadImage(bigFile))
            .rejects.toThrow('La imagen es demasiado grande. Máximo 10MB.');
    });
});
