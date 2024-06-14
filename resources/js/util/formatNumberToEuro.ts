/**
 * Function to format a cent value to Euro format
 * @param number The value in cents
 */
export function formatNumberToEuro(number: number) {
    return new Intl.NumberFormat('de-DE').format(Number((number / 100).toFixed(2))) + ' €';
}
