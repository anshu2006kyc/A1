/**
 * Professional Indian Currency (INR) Formatter
 * Correctly formats amounts using the Indian numbering system (Lakhs & Crores):
 * e.g., 138221.97 -> "₹1,38,221.97"
 */

export interface FormatINROptions {
  decimals?: number;
  symbol?: boolean;
  showSign?: boolean;
}

export function formatINR(
  amount: number | string | undefined | null,
  options: FormatINROptions = {}
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  const decimals = options.decimals !== undefined ? options.decimals : 2;
  const withSymbol = options.symbol !== false;

  if (isNaN(num)) {
    const zeroVal = (0).toFixed(decimals);
    return withSymbol ? `₹${zeroVal}` : zeroVal;
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(num));

  const sign = num < 0 ? '-' : (options.showSign && num > 0 ? '+' : '');
  const prefix = withSymbol ? '₹' : '';

  return `${sign}${prefix}${formatted}`;
}

/**
 * Format plain number with Indian separators without ₹ symbol
 * e.g., 138221.97 -> "1,38,221.97"
 */
export function formatINRAmount(
  amount: number | string | undefined | null,
  decimals = 2
): string {
  return formatINR(amount, { decimals, symbol: false });
}
