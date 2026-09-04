import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../theme";

export function Timeline({
  items,
}: {
  items: Array<{ title: string; description?: string; time?: string }>;
}) {
  const { theme, colors } = useTheme();
  return (
    <View style={{ gap: theme.spacing[4] }}>
      {items.map((item, i) => (
        <View key={`${item.title}-${i}`} style={{ flexDirection: "row", gap: theme.spacing[3] }}>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.primary,
                marginTop: 4,
              }}
            />
            {i < items.length - 1 ? (
              <View
                style={{
                  width: 1,
                  flex: 1,
                  backgroundColor: colors.glassChromeBorder,
                  marginTop: 4,
                }}
              />
            ) : null}
          </View>
          <View style={{ flex: 1, paddingBottom: theme.spacing[3] }}>
            <Text style={{ color: colors.foreground, fontWeight: theme.fontWeights.medium }}>
              {item.title}
            </Text>
            {item.time ? (
              <Text style={{ color: colors.mutedForeground, fontSize: theme.fontSizes.xs }}>
                {item.time}
              </Text>
            ) : null}
            {item.description ? (
              <Text style={{ color: colors.mutedForeground, fontSize: theme.fontSizes.sm }}>
                {item.description}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

export function ActivityFeed(props: {
  items: Array<{ title: string; description?: string; time?: string }>;
}) {
  return <Timeline {...props} />;
}

export function NotificationCenter({
  children,
}: {
  children?: ReactNode;
}) {
  return <View>{children}</View>;
}
