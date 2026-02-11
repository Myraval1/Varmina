export const formatPrice = (price: number, currency: 'CLP' | 'USD' = 'CLP') => {
    if (currency === 'CLP') {
        return `$${price.toLocaleString('es-CL')}`;
    }
    return `USD $${price.toLocaleString('en-US')}`;
};
