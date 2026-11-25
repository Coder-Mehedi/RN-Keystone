import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Sheet } from '@/shared/ui/sheet';
import { Text } from '@/shared/ui/text';
import { useToast } from '@/shared/ui/toast';

import { GallerySection } from './gallery-section';

export function OverlaySection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { show } = useToast();

  return (
    <GallerySection title="Overlays" hint="Dialogs, sheets, and toasts.">
      <View className="flex-row flex-wrap gap-2">
        <Button variant="outline" onPress={() => setDialogOpen(true)}>
          Open dialog
        </Button>
        <Button variant="outline" onPress={() => setSheetOpen(true)}>
          Open sheet
        </Button>
        <Button
          variant="outline"
          onPress={() => show({ message: 'Saved successfully', variant: 'success' })}
        >
          Show toast
        </Button>
      </View>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Dialog"
        description="A centered modal for focused actions."
      >
        <Button onPress={() => setDialogOpen(false)}>Close</Button>
      </Dialog>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Sheet">
        <Text variant="bodyMuted">A bottom sheet for secondary actions.</Text>
        <Button onPress={() => setSheetOpen(false)}>Close</Button>
      </Sheet>
    </GallerySection>
  );
}
