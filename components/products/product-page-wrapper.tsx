'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ProductDetail } from './product-detail';
import { Product } from '@/types';

interface ProductPageWrapperProps {
    product: Product;
}

export const ProductPageWrapper: React.FC<ProductPageWrapperProps> = ({ product }) => {
    const router = useRouter();
    const { currency } = useStore();

    return (
        <ProductDetail
            product={product}
            currency={currency}
            onClose={() => router.back()}
        />
    );
};
