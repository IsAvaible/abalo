/**
 * Function to format a number to Euro format
 * @param number The number to format
 */
export function formatNumberToEuro(number: number) {
    return new Intl.NumberFormat('de-DE').format(Number(number.toFixed(2))) + ' €';
}
