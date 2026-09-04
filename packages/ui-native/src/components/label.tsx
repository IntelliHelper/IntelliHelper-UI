import { forwardRef } from "react";
import { Text, type TextProps } from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type LabelVariant = "default" | "chrome" | "muted";

export interface LabelProps extends TextProps {
  variant?: LabelVariant;
  required?: boolean;
}

export const Label = forwardRef<Text, LabelProps>(
  ({ variant = "default", required, style, children, ...props }, ref) => {
    const { theme, colors } = useTheme();
    const color =
      variant === "muted"
        ? colors.mutedForeground
        : variant === "chrome"
          ? colors.glassChromeFg
          : colors.foreground;
    return (
      <Text
        ref={ref}
        style={cn(
          {
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontWeights.medium,
            color,
            marginBottom: theme.spacing[1],
          },
          style,
        )}
        {...props}
      >
        {children}
        {required ? (
          <Text style={{ color: colors.destructive }}> *</Text>
        ) : null}
      </Text>
    );
  },
);
Label.displayName = "Label";
