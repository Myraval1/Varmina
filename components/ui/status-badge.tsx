
import React from 'react';
import { ProductStatus } from '@/types';

export const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
    const styles = {
        [ProductStatus.IN_STOCK]: "bg-[#E6F4EA] text-[#1E8E3E] border-[#CEEAD6]",
        [ProductStatus.MADE_TO_ORDER]: "bg-[#FFF4E5] text-[#B45D00] border-[#FFE5C2]",
        [ProductStatus.SOLD_OUT]: "bg-[#F1F3F4] text-[#70757A] border-[#E8EAED]",
    };

    const labels = {
        [ProductStatus.IN_STOCK]: "DISPONIBLE",
        [ProductStatus.MADE_TO_ORDER]: "POR ENCARGO",
        [ProductStatus.SOLD_OUT]: "AGOTADO",
    };

    return (
        <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] border rounded-sm ${styles[status] || styles[ProductStatus.IN_STOCK]}`}>
            {labels[status] || status}
        </span>
    );
};
