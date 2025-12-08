/**
 * Formats a number for display with up to 3 decimal places.
 * Removes trailing zeros after the decimal point.
 * 
 * @param value - The number to format
 * @returns Formatted string representation
 */
export function formatNumber(value: number): string {
  let formatted = value.toFixed(3);
  
  // Remove trailing zeros after decimal point
  if (formatted.includes('.')) {
    formatted = formatted.replace(/\.?0+$/, '');
  }
  
  return formatted;
}
