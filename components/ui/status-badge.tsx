'use client';

import React from 'react';
import { ProductStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<ProductStatus, { bg: string; label: string }> = {
    [ProductStatus.IN_STOCK]: {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
        label: "DISPONIBLE",
    },
    [ProductStatus.MADE_TO_ORDER]: {
        bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
        label: "POR ENCARGO",
    },
    [ProductStatus.SOLD_OUT]: {
        bg: "bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800/30 dark:text-stone-500 dark:border-stone-700",
        label: "AGOTADO",
    },
};

export const StatusBadge: React.FC<{ status: ProductStatus; className?: string }> = ({ status, className }) => {
    const config = statusConfig[status] || statusConfig[ProductStatus.IN_STOCK];

    return (
        <span className={cn(
            "px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] border rounded-sm inline-flex items-center gap-1.5",
            config.bg,
            className
        )}>
            <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                status === ProductStatus.IN_STOCK && "bg-emerald-500",
                status === ProductStatus.MADE_TO_ORDER && "bg-amber-500",
                status === ProductStatus.SOLD_OUT && "bg-stone-400",
            )} />
            {config.label}
        </span>
    );
};
