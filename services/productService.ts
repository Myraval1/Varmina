import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

// SIMULATED LATENCY
const DELAY = 800;

const getLocalProducts = (): Product[] => {
  const stored = localStorage.getItem('varmina_joyas_products');
  return stored ? JSON.parse(stored) : MOCK_PRODUCTS;
};

const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem('varmina_joyas_products', JSON.stringify(products));
};

export const productService = {
  // Simulate GET request
  getAll: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getLocalProducts());
      }, DELAY);
    });
  },

  // Simulate POST request
  create: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          ...product,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now(),
        };
        const current = getLocalProducts();
        saveLocalProducts([newProduct, ...current]);
        resolve(newProduct);
      }, DELAY);
    });
  },

  // Simulate PUT request
  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const current = getLocalProducts();
        const index = current.findIndex((p) => p.id === id);
        if (index === -1) {
          reject(new Error('Product not found'));
          return;
        }
        const updatedProduct = { ...current[index], ...updates };
        current[index] = updatedProduct;
        saveLocalProducts(current);
        resolve(updatedProduct);
      }, DELAY);
    });
  },

  // Simulate DELETE request
  delete: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getLocalProducts();
        const filtered = current.filter((p) => p.id !== id);
        saveLocalProducts(filtered);
        resolve();
      }, DELAY);
    });
  },
};