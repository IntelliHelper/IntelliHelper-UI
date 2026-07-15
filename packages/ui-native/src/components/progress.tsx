import { forwardRef } from "react";
import {
  Animated,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { useProgressWidth } from "../utils/animation";
import { cn } from "../utils/cn";

export type ProgressVariant = "chrome" | "outline";
export type ProgressSize = "sm" | "default" | "lg";

export interface ProgressProps extends ViewProps {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}

export const Progress = forwardRef<View, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      variant = "chrome",
      size = "default",
      style,
      indicatorStyle,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const height = size === "sm" ? 6 : size === "lg" ? 12 : 8;
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const width = useProgressWidth(pct);

    return (
      <View
        ref={ref}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max, now: value }}
        style={cn(
          {
            width: "100%",
            height,
            borderRadius: theme.radii.full,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.glassChromeBorder,
            backgroundColor:
              variant === "outline"
                ? colors.glassSurfaceFill
                : colors.glassChromeBgEnv,
          },
          style,
        )}
        {...props}
      >
        <Animated.View
          style={[
            {
              height: "100%",
              borderRadius: theme.radii.full,
              backgroundColor: colors.primary,
              opacity: variant === "chrome" ? 0.85 : 1,
              width: width.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
            indicatorStyle,
          ]}
        />
      </View>
    );
  },
);
Progress.displayName = "Progress";
