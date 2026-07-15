import { forwardRef, type ReactNode } from "react";
import {
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type AlertVariant =
  | "default"
  | "destructive"
  | "success"
  | "chrome"
  | "outline";

export interface AlertProps extends ViewProps {
  variant?: AlertVariant;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Alert = forwardRef<View, AlertProps>(
  ({ variant = "default", children, style, ...props }, ref) => {
    const { theme, colors } = useTheme();

    const styles: Record<AlertVariant, ViewStyle> = {
      default: {
        backgroundColor: "rgba(26,26,26,0.08)",
        borderColor: "rgba(26,26,26,0.25)",
      },
      destructive: {
        backgroundColor: "rgba(180,60,60,0.1)",
        borderColor: "rgba(180,60,60,0.35)",
      },
      success: {
        backgroundColor: "rgba(45,138,78,0.1)",
        borderColor: "rgba(45,138,78,0.35)",
      },
      chrome: {
        backgroundColor: colors.glassChromeBgEnv,
        borderColor: colors.glassChromeBorder,
      },
      outline: {
        backgroundColor: "transparent",
        borderColor: colors.glassChromeBorder,
        borderStyle: "dashed",
      },
    };

    return (
      <View
        ref={ref}
        accessibilityRole="alert"
        style={cn(
          {
            width: "100%",
            borderRadius: theme.radii["2xl"],
            borderWidth: 1,
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[3],
          },
          styles[variant],
          style,
        )}
        {...props}
      >
        {children}
      </View>
    );
  },
);
Alert.displayName = "Alert";

export const AlertTitle = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color: colors.foreground,
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontWeights.semibold,
            marginBottom: theme.spacing[1],
          } satisfies TextStyle,
          style,
        )}
        {...props}
      />
    );
  },
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color: colors.glassChromeFgMuted,
            fontSize: theme.fontSizes.sm,
            lineHeight: theme.fontSizes.sm * theme.lineHeights.relaxed,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
AlertDescription.displayName = "AlertDescription";
