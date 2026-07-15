import { forwardRef } from "react";
import {
  Pressable,
  Text,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";
import { pressedOpacity } from "../utils/pressable";

export interface ScrollToTopProps extends Omit<PressableProps, "onPress"> {
  /** Current scroll offset Y (pass from ScrollView onScroll). */
  offsetY?: number;
  /** Show button after this offset. Default 320. */
  threshold?: number;
  onPress?: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export const ScrollToTop = forwardRef<
  React.ElementRef<typeof Pressable>,
  ScrollToTopProps
>(
  (
    {
      offsetY = 0,
      threshold = 320,
      onPress,
      label = "↑",
      style,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    if (offsetY < threshold) return null;

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel="Scroll to top"
        onPress={onPress}
        style={({ pressed }) =>
          cn(
            {
              position: "absolute",
              right: theme.spacing[4],
              bottom: theme.spacing[6],
              width: 44,
              height: 44,
              borderRadius: theme.radii.full,
              backgroundColor: colors.glassChromeBgEnv,
              borderWidth: 1,
              borderColor: colors.glassChromeBorder,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressedOpacity(pressed),
              zIndex: theme.zIndex.sticky,
            },
            style,
          )
        }
        {...props}
      >
        <Text
          style={{
            color: colors.glassChromeFg,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.bold,
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  },
);
ScrollToTop.displayName = "ScrollToTop";

/** Helper to extract offset from ScrollView onScroll events. */
export function getScrollOffsetY(
  e: NativeSyntheticEvent<NativeScrollEvent>,
): number {
  return e.nativeEvent.contentOffset.y;
}
