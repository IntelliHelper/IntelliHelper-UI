import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme";

export function Rating({
  value,
  onChange,
  max = 5,
}: {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
}) {
  const { theme, colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: theme.spacing[1] }}>
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const on = n <= value;
        return (
          <Pressable key={n} onPress={() => onChange?.(n)}>
            <Text style={{ fontSize: 22, color: on ? colors.primary : colors.mutedForeground }}>
              ★
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
