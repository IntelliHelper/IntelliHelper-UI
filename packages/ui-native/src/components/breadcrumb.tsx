import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../theme";

export function Breadcrumb({ children }: { children?: ReactNode }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: theme.spacing[1],
      }}
    >
      {children}
    </View>
  );
}

export function BreadcrumbItem({ children }: { children?: ReactNode }) {
  return <View>{children}</View>;
}

export function BreadcrumbSeparator() {
  const { colors } = useTheme();
  return <Text style={{ color: colors.mutedForeground }}>/</Text>;
}

export function BreadcrumbPage({ children }: { children?: ReactNode }) {
  const { colors, theme } = useTheme();
  return (
    <Text
      style={{
        color: colors.foreground,
        fontSize: theme.fontSizes.sm,
        fontWeight: theme.fontWeights.medium,
      }}
    >
      {children}
    </Text>
  );
}
