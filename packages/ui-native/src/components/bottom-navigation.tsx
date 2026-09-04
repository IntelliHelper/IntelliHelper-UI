import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme";

export type BottomNavItem = { key: string; label: string };

export function BottomNavigation({
  items,
  value,
  onValueChange,
}: {
  items: BottomNavItem[];
  value: string;
  onValueChange: (key: string) => void;
}) {
  const { theme, colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        borderTopWidth: 1,
        borderColor: colors.glassChromeBorder,
        backgroundColor: colors.glassChromeBgEnv,
      }}
    >
      {items.map((item) => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            onPress={() => onValueChange(item.key)}
            style={{
              flex: 1,
              paddingVertical: theme.spacing[3],
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: active ? colors.primary : colors.mutedForeground,
                fontSize: theme.fontSizes.xs,
                fontWeight: theme.fontWeights.medium,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Dock({
  items,
  value,
  onValueChange,
}: {
  items: BottomNavItem[];
  value: string;
  onValueChange: (key: string) => void;
}) {
  const { theme, colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignSelf: "center",
        gap: theme.spacing[1],
        padding: theme.spacing[1],
        borderRadius: theme.radii.full,
        borderWidth: 1,
        borderColor: colors.glassChromeBorder,
        backgroundColor: colors.glassChromeBgEnv,
      }}
    >
      {items.map((item) => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            onPress={() => onValueChange(item.key)}
            style={{
              paddingHorizontal: theme.spacing[3],
              paddingVertical: theme.spacing[2],
              borderRadius: theme.radii.full,
              backgroundColor: active ? colors.primary : "transparent",
            }}
          >
            <Text
              style={{
                color: active ? colors.primaryForeground : colors.glassChromeFg,
                fontSize: theme.fontSizes.xs,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function NavigationMenu(props: {
  items: BottomNavItem[];
  value: string;
  onValueChange: (key: string) => void;
}) {
  return <Dock {...props} />;
}
