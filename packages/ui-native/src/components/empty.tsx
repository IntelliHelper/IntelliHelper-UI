import { forwardRef, type ReactNode } from "react";
import {
  Text,
  View,
  type StyleProp,
  type TextProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type EmptyVariant = "chrome" | "outline";
export type EmptyMediaVariant = "default" | "icon";

export interface EmptyProps extends ViewProps {
  variant?: EmptyVariant;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Empty = forwardRef<View, EmptyProps>(
  ({ variant = "chrome", children, style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            flex: 1,
            minWidth: 0,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing[6],
            borderRadius: theme.radii["2xl"],
            padding: theme.spacing[6],
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: colors.glassChromeBorder,
            backgroundColor:
              variant === "chrome" ? colors.glassChromeBgEnv : "transparent",
          },
          style,
        )}
        {...props}
      >
        {children}
      </View>
    );
  },
);
Empty.displayName = "Empty";

export const EmptyHeader = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            maxWidth: 320,
            flexDirection: "column",
            alignItems: "center",
            gap: theme.spacing[2],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
EmptyHeader.displayName = "EmptyHeader";

export const EmptyTitle = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color: colors.foreground,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semibold,
            textAlign: "center",
          },
          style,
        )}
        {...props}
      />
    );
  },
);
EmptyTitle.displayName = "EmptyTitle";

export const EmptyDescription = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color: colors.mutedForeground,
            fontSize: theme.fontSizes.sm,
            textAlign: "center",
            lineHeight: theme.fontSizes.sm * theme.lineHeights.relaxed,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
EmptyDescription.displayName = "EmptyDescription";

export const EmptyContent = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            flexDirection: "column",
            alignItems: "center",
            gap: theme.spacing[2],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
EmptyContent.displayName = "EmptyContent";

export interface EmptyMediaProps extends ViewProps {
  variant?: EmptyMediaVariant;
}

export const EmptyMedia = forwardRef<View, EmptyMediaProps>(
  ({ variant = "default", style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            marginBottom: theme.spacing[2],
            alignItems: "center",
            justifyContent: "center",
            ...(variant === "icon"
              ? {
                  width: 48,
                  height: 48,
                  borderRadius: theme.radii.xl,
                  backgroundColor: colors.glassChromeBgEnv,
                  borderWidth: 1,
                  borderColor: colors.glassChromeBorder,
                }
              : {}),
          },
          style,
        )}
        {...props}
      />
    );
  },
);
EmptyMedia.displayName = "EmptyMedia";
