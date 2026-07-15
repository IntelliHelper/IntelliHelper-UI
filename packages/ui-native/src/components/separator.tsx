import { forwardRef } from "react";
import { View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type SeparatorVariant = "default" | "chrome" | "subtle";

export interface SeparatorProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  variant?: SeparatorVariant;
  decorative?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Separator = forwardRef<View, SeparatorProps>(
  (
    {
      orientation = "horizontal",
      variant = "default",
      decorative = true,
      style,
      ...props
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const bg =
      variant === "subtle"
        ? "rgba(128,128,128,0.25)"
        : variant === "chrome"
          ? colors.glassChromeBorder
          : colors.glassChromeBorder;

    return (
      <View
        ref={ref}
        accessibilityRole={decorative ? undefined : "none"}
        importantForAccessibility={decorative ? "no" : "yes"}
        style={cn(
          orientation === "horizontal"
            ? { height: 1, width: "100%", backgroundColor: bg }
            : { width: 1, height: "100%", backgroundColor: bg, alignSelf: "stretch" },
          style,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = "Separator";
