import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNum(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 1000) return n.toExponential(digits)
  if (Math.abs(n) < 0.01 && n !== 0) return n.toExponential(digits)
  return n.toFixed(digits)
}
