import type { ReactNode } from 'react';
import { Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/shared/lib/cn';

import { Pressable } from './pressable';
import { Text } from './text';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children?: ReactNode;
  className?: string;
}

/** Bottom sheet overlay. */
export function Sheet({ open, onOpenChange, title, children, className }: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      visible={open}
      animationType="slide"
      onRequestClose={() => onOpenChange(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <Pressable
          haptics={false}
          accessibilityRole="button"
          accessibilityLabel="Close sheet"
          onPress={() => onOpenChange(false)}
          className="flex-1"
        />
        <View
          className={cn('gap-4 rounded-t-[20px] bg-card px-4 pt-3', className)}
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="items-center">
            <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </View>
          {title ? <Text variant="heading">{title}</Text> : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}
