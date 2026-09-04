import { Text, View } from "react-native";
import { useTheme } from "../theme";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  const { theme, colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[2] }}>
      {steps.map((step, i) => (
        <View key={step} style={{ flex: 1, alignItems: "center", gap: 4 }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: i <= current ? colors.primary : colors.glassSurfaceFill,
            }}
          >
            <Text
              style={{
                color: i <= current ? colors.primaryForeground : colors.mutedForeground,
                fontSize: 11,
              }}
            >
              {i + 1}
            </Text>
          </View>
          <Text style={{ fontSize: 10, color: colors.mutedForeground }} numberOfLines={1}>
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
}
