/**
 * Format a price with the correct locale and currency symbol.
 */
export function formatPrice(amount: number, currency: 'CLP' | 'USD' = 'CLP'): string {
    if (currency === 'USD') {
        return `USD $${amount.toLocaleString('en-US')}`;
    }
    return `$${amount.toLocaleString('es-CL')}`;
}
