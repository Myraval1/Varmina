export enum ProductStatus {
  IN_STOCK = 'Disponible',
  MADE_TO_ORDER = 'Por Encargo',
  SOLD_OUT = 'Agotado',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  status: ProductStatus;
  createdAt: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export interface FilterState {
  search: string;
  minPrice: number;
  maxPrice: number;
  status: ProductStatus | 'All';
  sort: SortOption;
}