import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Joins class names and resolves conflicts. Of two classes that set the same thing,
 * the later one wins: `cn('bg-background', isPrimary && 'bg-primary')`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
