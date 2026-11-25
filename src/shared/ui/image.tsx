import { Image as ExpoImage, type ImageProps as ExpoImageProps } from 'expo-image';
import type { ComponentType } from 'react';
import { withUniwind } from 'uniwind';

export interface ImageProps extends ExpoImageProps {
  className?: string;
}

// Wrapped once, at module level, so that the wrapper is not recreated on every render.
const ExpoImageWithClassName: ComponentType<ImageProps> = withUniwind(ExpoImage);

/**
 * Shows a picture from the app's assets or from the network, sized and shaped with classes.
 * Give the same `recyclingKey` to images in a list and their sources are reused while scrolling.
 */
export function Image({ transition = 200, ...rest }: ImageProps) {
  return <ExpoImageWithClassName transition={transition} {...rest} />;
}
