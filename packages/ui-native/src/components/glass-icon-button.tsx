import { forwardRef, type ReactNode } from "react";
import {
  Animated,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { usePressScale } from "../utils/animation";
import { cn } from "../utils/cn";
import { pressedOpacity } from "../utils/pressable";

export type GlassIconButtonVariant = "chrome" | "ghost" | "destructive";
export type GlassIconButtonSize = "sm" | "default" | "lg";

export interface GlassIconButtonProps extends Omit<PressableProps, "children"> {
  variant?: GlassIconButtonVariant;
  size?: GlassIconButtonSize;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const GlassIconButton = forwardRef<
  React.ElementRef<typeof Pressable>,
  GlassIconButtonProps
>(
  (
    {
      variant = "chrome",
      size = "default",
      children,
      disabled,
      style,
      onPressIn,
      onPressOut,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const dim = size === "sm" ? 32 : size === "lg" ? 40 : 36;
    const press = usePressScale({ pressedScale: 0.92, disabled: !!disabled });

    const bg =
      variant === "ghost"
        ? "transparent"
        : variant === "destructive"
          ? colors.destructive
          : colors.glassChromeBgEnv;

    const fg =
      variant === "destructive"
        ? colors.destructiveForeground
        : colors.glassChromeFg;

    return (
      <Animated.View style={press.style}>
        <Pressable
          ref={ref}
          accessibilityRole="button"
          disabled={disabled}
          onPressIn={(e) => {
            press.onPressIn();
            onPressIn?.(e);
          }}
          onPressOut={(e) => {
            press.onPressOut();
            onPressOut?.(e);
          }}
          style={({ pressed }) =>
            cn(
              {
                width: dim,
                height: dim,
                borderRadius: theme.radii.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: bg,
                borderWidth: variant === "ghost" ? 0 : 1,
                borderColor: colors.glassChromeBorder,
                opacity: pressedOpacity(pressed) * (disabled ? 0.5 : 1),
              },
              style,
            )
          }
          {...props}
        >
          {typeof children === "string" ? (
            <Text style={{ color: fg, fontSize: dim * 0.4 }}>{children}</Text>
          ) : (
            children
          )}
        </Pressable>
      </Animated.View>
    );
  },
);
GlassIconButton.displayName = "GlassIconButton";
