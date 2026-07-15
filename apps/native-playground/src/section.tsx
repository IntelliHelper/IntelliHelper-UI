import type { ReactNode } from "react";
import { View } from "react-native";
import {
  Separator,
  TypographyH3,
  TypographyMuted,
  useTheme,
} from "@intelli/ui-native";

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing[3], marginBottom: theme.spacing[8] }}>
      <View style={{ gap: theme.spacing[1] }}>
        <TypographyH3>{title}</TypographyH3>
        {description ? <TypographyMuted>{description}</TypographyMuted> : null}
      </View>
      <Separator />
      <View style={{ gap: theme.spacing[3] }}>{children}</View>
    </View>
  );
}

export function Row({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing[2],
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
}
