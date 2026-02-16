'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("animate-pulse bg-stone-200 dark:bg-stone-800 rounded", className)} />
);
