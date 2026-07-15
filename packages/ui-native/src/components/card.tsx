import { createContext, forwardRef, useContext, type ReactNode } from "react";
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
import { GlassSurface } from "./glass-surface";

export type CardVariant = "chrome" | "elevated" | "content" | "outline";

interface CardContextValue {
  variant: CardVariant;
}

const CardContext = createContext<CardContextValue>({ variant: "chrome" });

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  gradient?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card = forwardRef<View, CardProps>(
  ({ variant = "chrome", gradient, children, style, ...props }, ref) => {
    return (
      <CardContext.Provider value={{ variant }}>
        <GlassSurface
          ref={ref}
          variant={variant === "elevated" ? "elevated" : variant}
          contentBackground={gradient}
          style={cn({ overflow: "hidden" }, style)}
          {...props}
        >
          {children}
        </GlassSurface>
      </CardContext.Provider>
    );
  },
);
Card.displayName = "Card";

export const CardHeader = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            flexDirection: "column",
            gap: theme.spacing[1.5],
            padding: theme.spacing[6],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    const { variant } = useContext(CardContext);
    const color =
      variant === "content" ? colors.contentText : colors.foreground;
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semibold,
            letterSpacing: -0.2,
          } satisfies TextStyle,
          style,
        )}
        {...props}
      />
    );
  },
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    const { variant } = useContext(CardContext);
    const color =
      variant === "content" ? colors.contentTextMuted : colors.mutedForeground;
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color,
            fontSize: theme.fontSizes.sm,
            lineHeight: theme.fontSizes.sm * theme.lineHeights.normal,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            paddingHorizontal: theme.spacing[6],
            paddingBottom: theme.spacing[6],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.spacing[6],
            paddingBottom: theme.spacing[6],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
CardFooter.displayName = "CardFooter";
