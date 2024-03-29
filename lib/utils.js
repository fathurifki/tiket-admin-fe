import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
