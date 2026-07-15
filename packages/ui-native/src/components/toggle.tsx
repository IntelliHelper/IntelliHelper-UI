import { forwardRef, useState, type ReactNode } from "react";
import {
  Animated,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { usePressScale } from "../utils/animation";
import { cn } from "../utils/cn";
import { pressedOpacity } from "../utils/pressable";

export type ToggleVariant = "default" | "outline" | "chrome";
export type ToggleSize = "sm" | "default" | "lg";

export interface ToggleProps extends Omit<PressableProps, "children"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  children?: ReactNode;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const Toggle = forwardRef<
  React.ElementRef<typeof Pressable>,
  ToggleProps
>(
  (
    {
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      variant = "default",
      size = "default",
      disabled,
      children,
      textStyle,
      style,
      onPressIn,
      onPressOut,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const isControlled = pressedProp !== undefined;
    const [internal, setInternal] = useState(defaultPressed);
    const isPressed = isControlled ? !!pressedProp : internal;
    const press = usePressScale({ pressedScale: 0.96, disabled: !!disabled });

    const height = size === "sm" ? 32 : size === "lg" ? 40 : 36;
    const padH = size === "sm" ? 10 : size === "lg" ? 16 : 12;
    const fontSize =
      size === "sm" ? theme.fontSizes.xs : theme.fontSizes.sm;

    const bg = isPressed
      ? colors.primary
      : variant === "outline" || variant === "chrome"
        ? colors.glassChromeBgEnv
        : "transparent";

    const fg = isPressed ? colors.primaryForeground : colors.foreground;

    return (
      <Animated.View style={press.style}>
        <Pressable
          ref={ref}
          accessibilityRole="button"
          accessibilityState={{ selected: isPressed, disabled: !!disabled }}
          disabled={disabled}
          onPressIn={(e) => {
            press.onPressIn();
            onPressIn?.(e);
          }}
          onPressOut={(e) => {
            press.onPressOut();
            onPressOut?.(e);
          }}
          onPress={() => {
            const next = !isPressed;
            if (!isControlled) setInternal(next);
            onPressedChange?.(next);
          }}
          style={({ pressed }) =>
            cn(
              {
                height,
                paddingHorizontal: padH,
                borderRadius: theme.radii.lg,
                borderWidth: variant === "outline" || variant === "chrome" ? 1 : 0,
                borderColor: colors.glassChromeBorder,
                backgroundColor: bg,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressedOpacity(pressed) * (disabled ? 0.5 : 1),
              },
              style,
            )
          }
          {...props}
        >
          {typeof children === "string" ? (
            <Text
              style={cn(
                {
                  color: fg,
                  fontSize,
                  fontWeight: theme.fontWeights.medium,
                },
                textStyle,
              )}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </Pressable>
      </Animated.View>
    );
  },
);
Toggle.displayName = "Toggle";
