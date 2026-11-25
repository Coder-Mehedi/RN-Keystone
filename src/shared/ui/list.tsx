import { FlashList, type FlashListProps, type ListRenderItem } from '@shopify/flash-list';
import type { ReactElement } from 'react';
import { View } from 'react-native';

import { Button } from './button';
import { Spinner } from './spinner';
import { StateView } from './state-view';
import { Text } from './text';

export interface ListProps<T> extends Omit<FlashListProps<T>, 'ListEmptyComponent' | 'renderItem'> {
  data: T[] | null | undefined;
  renderItem: ListRenderItem<T>;
  loading?: boolean;
  error?: string | null;
  offline?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactElement;
}

export function List<T>({
  data,
  renderItem,
  loading = false,
  error,
  offline = false,
  onRetry,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  emptyAction,
  ...rest
}: ListProps<T>) {
  if (loading && !data?.length) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Spinner label="Loading" />
        <Text variant="bodyMuted">Loading...</Text>
      </View>
    );
  }

  if (error && !data?.length) {
    return (
      <StateView
        title={offline ? 'You are offline' : 'Could not load content'}
        description={error}
        action={onRetry ? <Button onPress={onRetry}>Try again</Button> : undefined}
      />
    );
  }

  return (
    <FlashList
      {...rest}
      data={data ?? []}
      renderItem={renderItem}
      ListEmptyComponent={
        <StateView
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
          className="py-16"
        />
      }
    />
  );
}
