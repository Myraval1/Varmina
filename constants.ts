import { Product, ProductStatus } from './types';

// Luxury jewelry mock data (Prices in CLP)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Collar Luz de Luna',
    description: 'Un impresionante collar de oro blanco de 18k con una cascada de diamantes pavé, inspirado en el reflejo de la luna sobre el Sena.',
    price: 11875000,
    images: [
      'https://picsum.photos/id/1/800/800', 
      'https://picsum.photos/id/2/800/800'
    ],
    status: ProductStatus.IN_STOCK,
    createdAt: 1625000000000,
  },
  {
    id: '2',
    name: 'Anillo Sol Real',
    description: 'Anillo de sello forjado a mano en oro de 24k con incrustación de ónix profundo. Un símbolo de poder y elegancia.',
    price: 3990000,
    images: [
      'https://picsum.photos/id/3/800/800',
      'https://picsum.photos/id/4/800/800'
    ],
    status: ProductStatus.MADE_TO_ORDER,
    createdAt: 1625100000000,
  },
  {
    id: '3',
    name: 'Pendientes Jardín Secreto',
    description: 'Delicados pendientes de esmeralda y diamantes en forma de hojas de hiedra. Engastados en platino.',
    price: 8455000,
    images: [
      'https://picsum.photos/id/5/800/800',
      'https://picsum.photos/id/6/800/800'
    ],
    status: ProductStatus.IN_STOCK,
    createdAt: 1625200000000,
  },
  {
    id: '4',
    name: 'Pulsera Zafiro Océano',
    description: 'Una pulsera fluida de zafiros talla cojín y diamantes brillantes, evocando la profundidad del océano.',
    price: 23750000,
    images: [
      'https://picsum.photos/id/7/800/800',
      'https://picsum.photos/id/8/800/800'
    ],
    status: ProductStatus.SOLD_OUT,
    createdAt: 1625300000000,
  },
  {
    id: '5',
    name: 'Colgante Celestial',
    description: 'Una perla de Tahití perfecta suspendida de una cadena de oro con un engaste de diamantes.',
    price: 2945000,
    images: [
      'https://picsum.photos/id/9/800/800',
      'https://picsum.photos/id/10/800/800'
    ],
    status: ProductStatus.IN_STOCK,
    createdAt: 1625400000000,
  },
  {
    id: '6',
    name: 'Alianza Negro Eterno',
    description: 'Alianza de oro ennegrecido con diamantes negros. Moderna, discreta y sofisticada.',
    price: 1710000,
    images: [
      'https://picsum.photos/id/11/800/800',
      'https://picsum.photos/id/12/800/800'
    ],
    status: ProductStatus.MADE_TO_ORDER,
    createdAt: 1625500000000,
  }
];

export const APP_NAME = "Varmina Joyas";
export const CURRENCY_SYMBOL = {
  CLP: '$',
  USD: 'USD $'
};