import * as Haptics from 'expo-haptics';
import {
  type GestureResponderEvent,
  type PressableProps as RNPressableProps,
  Pressable as RNPressable,
} from 'react-native';

export interface PressableProps extends RNPressableProps {
  /**
   * Gives a light tap of feedback when pressed. Leave it on for controls with no feedback of
   * their own, such as rows, cards and toggles. Turn it off where the control already moves.
   */
  haptics?: boolean;
}

/** A control the user presses. Everything tappable in the design system is built on it. */
export function Pressable({ haptics = true, onPress, ...rest }: PressableProps) {
  return <RNPressable {...rest} onPress={haptics ? withSelectionHaptics(onPress) : onPress} />;
}

function withSelectionHaptics(onPress: RNPressableProps['onPress']): RNPressableProps['onPress'] {
  if (!onPress) {
    return onPress;
  }

  return (event: GestureResponderEvent) => {
    // It fails on devices without a vibrator and when the system has switched haptics off.
    Haptics.selectionAsync().catch(() => undefined);
    onPress(event);
  };
}
