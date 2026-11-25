import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';

import { Text } from './text';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'destructive' | 'outline';

const variantClassName: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  success: 'border-transparent bg-success text-success-foreground',
  destructive: 'border-transparent bg-destructive text-destructive-foreground',
  outline: 'border-border text-foreground',
};

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

/** A short label that marks the state or category of something: "New", "3", "Done". */
export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <View
      className={cn(
        'self-start rounded-full border px-2.5 py-0.5',
        variantClassName[variant],
        className,
      )}
    >
      <Text className="text-xs font-medium">{children}</Text>
    </View>
  );
}
