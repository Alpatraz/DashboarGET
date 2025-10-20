// src/lib/utils.js

/**
 * Concatène les classes CSS de manière conditionnelle
 * Exemple : cn('bg-red', isActive && 'text-white') → 'bg-red text-white'
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
