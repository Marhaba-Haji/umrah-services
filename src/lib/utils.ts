import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts an amount in INR to the selected currency.
 * @param amountInINR The amount in INR to convert.
 * @param currency The target currency code (INR, USD, SAR).
 * @returns { value: number, symbol: string }
 */
export function convertFromINR(
  amountInINR: number,
  currency: string,
): { value: number; symbol: string } {
  // These rates should match the ones used in the UI
  const exchangeRates: Record<string, number> = {
    INR: 1,
    USD: 0.012, // 1 INR = 0.012 USD
    SAR: 0.045, // 1 INR = 0.045 SAR
  };
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    SAR: "ر.س",
  };
  const rate = exchangeRates[currency] || 1;
  const symbol = currencySymbols[currency] || "₹";
  return {
    value: Math.round(amountInINR * rate),
    symbol,
  };
}
