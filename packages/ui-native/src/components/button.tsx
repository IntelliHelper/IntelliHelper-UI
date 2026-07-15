import { forwardRef, type ReactNode } from "react";
import {
  ActivityIndicator,
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
import { disabledStyle, pressedOpacity } from "../utils/pressable";

export type ButtonVariant =
  | "default"
  | "primary"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "glass"
  | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";
export type ButtonShape = "rounded" | "pill" | "rectangular";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  children?: ReactNode;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const Button = forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      shape = "rounded",
      loading = false,
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
    const isDisabled = disabled || loading;
    const press = usePressScale({
      pressedScale: variant === "link" ? 1 : 0.97,
      disabled: isDisabled,
    });

    const height =
      size === "sm" ? 36 : size === "lg" ? 48 : size === "icon" ? 40 : 40;
    const padH =
      size === "sm" ? 16 : size === "lg" ? 32 : size === "icon" ? 0 : 20;
    const fontSize =
      size === "sm" ? theme.fontSizes.xs : size === "lg" ? theme.fontSizes.base : theme.fontSizes.sm;

    const radius =
      shape === "pill"
        ? theme.radii.full
        : shape === "rectangular"
          ? size === "sm"
            ? theme.radii.sm
            : size === "lg"
              ? theme.radii.lg
              : theme.radii.md
          : theme.radii.xl;

    const bg: Record<ButtonVariant, string> = {
      default: colors.glassButtonUiBg,
      primary: colors.primary,
      destructive: colors.destructive,
      outline: colors.glassChromeBgEnv,
      secondary: colors.glassSurfaceFill,
      ghost: "transparent",
      glass: colors.glassButtonUiBg,
      link: "transparent",
    };

    const fg: Record<ButtonVariant, string> = {
      default: colors.glassButtonUiFg,
      primary: colors.primaryForeground,
      destructive: colors.destructiveForeground,
      outline: colors.glassChromeFg,
      secondary: colors.glassChromeFg,
      ghost: colors.foreground,
      glass: colors.glassButtonUiFg,
      link: colors.primary,
    };

    const borderColor: Record<ButtonVariant, string> = {
      default: colors.glassButtonUiBorder,
      primary: "transparent",
      destructive: "transparent",
      outline: colors.glassChromeBorder,
      secondary: colors.glassChromeBorder,
      ghost: "transparent",
      glass: colors.glassButtonUiBorder,
      link: "transparent",
    };

    return (
      <Animated.View style={press.style}>
        <Pressable
          ref={ref}
          accessibilityRole="button"
          accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
          disabled={isDisabled}
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
                height,
                minWidth: size === "icon" ? height : undefined,
                width: size === "icon" ? height : undefined,
                paddingHorizontal: padH,
                borderRadius: radius,
                backgroundColor: bg[variant],
                borderWidth: variant === "link" || variant === "ghost" ? 0 : 1,
                borderColor: borderColor[variant],
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: pressedOpacity(pressed) * (isDisabled ? 0.5 : 1),
              } satisfies ViewStyle,
              disabledStyle(isDisabled),
              style,
            )
          }
          {...props}
        >
          {loading ? (
            <ActivityIndicator color={fg[variant]} size="small" />
          ) : typeof children === "string" || typeof children === "number" ? (
            <Text
              style={cn(
                {
                  color: fg[variant],
                  fontSize,
                  fontWeight: theme.fontWeights.semibold,
                  textDecorationLine: variant === "link" ? "underline" : "none",
                } satisfies TextStyle,
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
Button.displayName = "Button";
