import type { ReactNode } from 'react';
import { Modal } from 'react-native';

import { cn } from '@/shared/lib/cn';

import { Pressable } from './pressable';
import { Text } from './text';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/** Centered modal dialog. */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) {
  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        haptics={false}
        accessibilityRole="button"
        accessibilityLabel="Close dialog"
        onPress={() => onOpenChange(false)}
        className="flex-1 items-center justify-center bg-black/50 px-6"
      >
        <Pressable
          haptics={false}
          accessibilityRole="none"
          onPress={() => undefined}
          className={cn('w-full gap-3 rounded-card bg-card p-5', className)}
        >
          {title ? <Text variant="heading">{title}</Text> : null}
          {description ? <Text variant="bodyMuted">{description}</Text> : null}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
