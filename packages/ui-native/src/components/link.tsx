import { Linking, Text, type TextProps } from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export interface LinkProps extends TextProps {
  href: string;
}

export function Link({ href, style, ...props }: LinkProps) {
  const { colors, theme } = useTheme();
  return (
    <Text
      accessibilityRole="link"
      onPress={() => {
        void Linking.openURL(href);
      }}
      style={cn(
        {
          color: colors.primary,
          fontSize: theme.fontSizes.sm,
          textDecorationLine: "underline",
        },
        style,
      )}
      {...props}
    />
  );
}
