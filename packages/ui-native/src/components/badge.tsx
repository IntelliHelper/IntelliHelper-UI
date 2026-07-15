import { forwardRef, type ReactNode } from "react";
import {
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "destructive"
  | "chrome"
  | "success";
export type BadgeSize = "sm" | "default" | "lg";

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: ReactNode;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const Badge = forwardRef<View, BadgeProps>(
  (
    {
      variant = "default",
      size = "default",
      children,
      textStyle,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();

    const padH = size === "sm" ? 8 : size === "lg" ? 12 : 10;
    const padV = size === "lg" ? 4 : 2;
    const fontSize =
      size === "sm" ? 10 : size === "lg" ? theme.fontSizes.sm : theme.fontSizes.xs;

    const bg: Record<BadgeVariant, string> = {
      default: "rgba(26,26,26,0.12)",
      secondary: colors.glassChromeBgEnv,
      outline: "transparent",
      destructive: "rgba(180,60,60,0.14)",
      chrome: colors.glassChromeBgEnv,
      success: "rgba(45,138,78,0.16)",
    };

    const fg: Record<BadgeVariant, string> = {
      default: colors.primary,
      secondary: colors.glassChromeFg,
      outline: colors.glassChromeFg,
      destructive: colors.destructive,
      chrome: colors.glassChromeFg,
      success: colors.success,
    };

    const border: Record<BadgeVariant, string> = {
      default: "rgba(26,26,26,0.25)",
      secondary: colors.glassChromeBorder,
      outline: colors.glassChromeBorder,
      destructive: "rgba(180,60,60,0.35)",
      chrome: colors.glassChromeBorder,
      success: "rgba(45,138,78,0.35)",
    };

    return (
      <View
        ref={ref}
        style={cn(
          {
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            paddingHorizontal: padH,
            paddingVertical: padV,
            borderRadius: theme.radii.full,
            backgroundColor: bg[variant],
            borderWidth: 1,
            borderColor: border[variant],
          },
          style,
        )}
        {...props}
      >
        {typeof children === "string" || typeof children === "number" ? (
          <Text
            style={cn(
              {
                color: fg[variant],
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
      </View>
    );
  },
);
Badge.displayName = "Badge";
