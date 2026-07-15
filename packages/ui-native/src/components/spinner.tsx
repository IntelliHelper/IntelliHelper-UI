import { forwardRef } from "react";
import {
  ActivityIndicator,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type SpinnerVariant = "default" | "primary" | "muted" | "chrome";
export type SpinnerSize = "sm" | "default" | "lg" | "xl";

export interface SpinnerProps extends ViewProps {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  style?: StyleProp<ViewStyle>;
}

const sizeMap: Record<SpinnerSize, "small" | "large"> = {
  sm: "small",
  default: "small",
  lg: "large",
  xl: "large",
};

const dimMap: Record<SpinnerSize, number> = {
  sm: 14,
  default: 16,
  lg: 24,
  xl: 32,
};

export const Spinner = forwardRef<View, SpinnerProps>(
  ({ variant = "default", size = "default", style, ...props }, ref) => {
    const { colors } = useTheme();
    const color =
      variant === "primary"
        ? colors.primary
        : variant === "muted"
          ? colors.mutedForeground
          : variant === "chrome"
            ? colors.glassChromeFg
            : colors.foreground;

    return (
      <View
        ref={ref}
        accessibilityRole="progressbar"
        accessibilityLabel="Loading"
        style={cn(
          {
            width: dimMap[size],
            height: dimMap[size],
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        )}
        {...props}
      >
        <ActivityIndicator color={color} size={sizeMap[size]} />
      </View>
    );
  },
);
Spinner.displayName = "Spinner";
