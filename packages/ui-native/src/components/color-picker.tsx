import { Pressable, View } from "react-native";
import { useTheme } from "../theme";

const SWATCHES = ["#111111", "#6366f1", "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#f8fafc"];

export function ColorPicker({
  value,
  onChange,
  swatches = SWATCHES,
}: {
  value?: string;
  onChange?: (value: string) => void;
  swatches?: string[];
}) {
  const { theme, colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] }}>
      {swatches.map((hex) => (
        <Pressable
          key={hex}
          onPress={() => onChange?.(hex)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: hex,
            borderWidth: value === hex ? 2 : 1,
            borderColor: value === hex ? colors.primary : colors.glassChromeBorder,
          }}
        />
      ))}
    </View>
  );
}
