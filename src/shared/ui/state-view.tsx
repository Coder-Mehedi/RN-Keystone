import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

import { Text } from './text';

export interface StateViewProps extends ViewProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** What the user can do from here, usually a `Button`. */
  action?: ReactNode;
}

/** A centred message for when there is no normal content to show: an error, nothing found, empty. */
export function StateView({
  title,
  description,
  icon,
  action,
  className,
  ...rest
}: StateViewProps) {
  return (
    <View
      {...rest}
      className={cn('flex-1 items-center justify-center gap-4 bg-background px-8', className)}
    >
      {icon}
      <Text variant="title" className="text-center">
        {title}
      </Text>
      {description ? (
        <Text variant="bodyMuted" className="text-center">
          {description}
        </Text>
      ) : null}
      {action}
    </View>
  );
}
