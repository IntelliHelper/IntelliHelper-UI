import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme";
import { Input } from "./input";

export type ComboboxOption = { value: string; label: string };

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Search…",
}: {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}) {
  const { theme, colors } = useTheme();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) =>
        !q ||
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  return (
    <View style={{ gap: theme.spacing[2] }}>
      <Input value={query} onChangeText={setQuery} placeholder={placeholder} />
      {filtered.slice(0, 6).map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onValueChange?.(o.value)}
            style={{
              padding: theme.spacing[2],
              borderRadius: theme.radii.md,
              backgroundColor: active ? colors.glassSurfaceFill : "transparent",
            }}
          >
            <Text style={{ color: colors.foreground }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function MultiSelect({
  options,
  value,
  onValueChange,
}: {
  options: ComboboxOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
}) {
  const { theme, colors } = useTheme();
  return (
    <View style={{ gap: theme.spacing[2] }}>
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <Pressable
            key={o.value}
            onPress={() =>
              onValueChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])
            }
            style={{
              padding: theme.spacing[2],
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: on ? colors.primary : colors.glassChromeBorder,
            }}
          >
            <Text style={{ color: colors.foreground }}>
              {on ? "✓ " : ""}
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Command({
  options,
  onSelect,
}: {
  options: ComboboxOption[];
  onSelect?: (value: string) => void;
}) {
  return <Combobox options={options} onValueChange={onSelect} placeholder="Type a command" />;
}
