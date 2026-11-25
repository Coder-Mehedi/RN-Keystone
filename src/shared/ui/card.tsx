import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

/** A raised surface that groups related content. */
export type CardProps = ViewProps;

export function Card({ className, ...rest }: CardProps) {
  return (
    <View {...rest} className={cn('rounded-card border border-border bg-card p-4', className)} />
  );
}
