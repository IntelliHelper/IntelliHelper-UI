import { forwardRef, type ReactNode } from "react";
import {
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type TypographyColorVariant = "default" | "chrome" | "muted";

export interface TypographyProps extends TextProps {
  variant?: TypographyColorVariant;
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

function useTypographyColor(variant: TypographyColorVariant = "default") {
  const { colors } = useTheme();
  if (variant === "chrome") return colors.glassChromeFg;
  if (variant === "muted") return colors.mutedForeground;
  return colors.foreground;
}

function createTypography(
  name: string,
  base: (theme: ReturnType<typeof useTheme>["theme"]) => TextStyle,
) {
  const Comp = forwardRef<Text, TypographyProps>(
    ({ variant = "default", style, children, ...props }, ref) => {
      const { theme } = useTheme();
      const color = useTypographyColor(variant);
      return (
        <Text
          ref={ref}
          style={cn({ color, ...base(theme) }, style)}
          {...props}
        >
          {children}
        </Text>
      );
    },
  );
  Comp.displayName = name;
  return Comp;
}

export const TypographyH1 = createTypography("TypographyH1", (t) => ({
  fontSize: t.fontSizes["4xl"],
  fontWeight: t.fontWeights.extrabold,
  letterSpacing: -0.5,
  lineHeight: t.fontSizes["4xl"] * t.lineHeights.tight,
}));

export const TypographyH2 = createTypography("TypographyH2", (t) => ({
  fontSize: t.fontSizes["3xl"],
  fontWeight: t.fontWeights.semibold,
  letterSpacing: -0.3,
  lineHeight: t.fontSizes["3xl"] * t.lineHeights.tight,
}));

export const TypographyH3 = createTypography("TypographyH3", (t) => ({
  fontSize: t.fontSizes["2xl"],
  fontWeight: t.fontWeights.semibold,
  lineHeight: t.fontSizes["2xl"] * t.lineHeights.snug,
}));

export const TypographyH4 = createTypography("TypographyH4", (t) => ({
  fontSize: t.fontSizes.xl,
  fontWeight: t.fontWeights.semibold,
  lineHeight: t.fontSizes.xl * t.lineHeights.snug,
}));

export const TypographyP = createTypography("TypographyP", (t) => ({
  fontSize: t.fontSizes.base,
  lineHeight: t.fontSizes.base * t.lineHeights.relaxed,
  marginBottom: t.spacing[4],
}));

export const TypographyBlockquote = createTypography(
  "TypographyBlockquote",
  (t) => ({
    fontSize: t.fontSizes.base,
    fontStyle: "italic",
    borderLeftWidth: 3,
    paddingLeft: t.spacing[4],
    opacity: 0.9,
  }),
);

export const TypographyInlineCode = createTypography(
  "TypographyInlineCode",
  (t) => ({
    fontSize: t.fontSizes.sm,
    fontFamily: "Menlo",
    paddingHorizontal: 4,
    paddingVertical: 2,
  }),
);

export const TypographyLead = createTypography("TypographyLead", (t) => ({
  fontSize: t.fontSizes.xl,
  lineHeight: t.fontSizes.xl * t.lineHeights.relaxed,
}));

export const TypographyLarge = createTypography("TypographyLarge", (t) => ({
  fontSize: t.fontSizes.lg,
  fontWeight: t.fontWeights.semibold,
}));

export const TypographySmall = createTypography("TypographySmall", (t) => ({
  fontSize: t.fontSizes.sm,
  fontWeight: t.fontWeights.medium,
  lineHeight: t.fontSizes.sm * t.lineHeights.normal,
}));

export const TypographyMuted = createTypography("TypographyMuted", (t) => ({
  fontSize: t.fontSizes.sm,
  lineHeight: t.fontSizes.sm * t.lineHeights.normal,
}));

export const TypographyList = createTypography("TypographyList", (t) => ({
  fontSize: t.fontSizes.base,
  lineHeight: t.fontSizes.base * t.lineHeights.relaxed,
  marginLeft: t.spacing[4],
}));
