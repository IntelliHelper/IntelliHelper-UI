import { type ReactNode } from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "../theme";

export function Stack({
  gap = 3,
  children,
  style,
  ...props
}: ViewProps & { gap?: number; children?: ReactNode }) {
  const { theme } = useTheme();
  const g = theme.spacing[gap as keyof typeof theme.spacing] ?? gap;
  return (
    <View style={[{ gap: g }, style]} {...props}>
      {children}
    </View>
  );
}

export function Cluster({
  gap = 2,
  children,
  style,
  ...props
}: ViewProps & { gap?: number; children?: ReactNode }) {
  const { theme } = useTheme();
  const g = theme.spacing[gap as keyof typeof theme.spacing] ?? gap;
  return (
    <View
      style={[{ flexDirection: "row", flexWrap: "wrap", gap: g, alignItems: "center" }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export function Split({
  children,
  style,
}: {
  children?: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ flexDirection: "row", gap: 12, alignItems: "center" }, style]}>
      {children}
    </View>
  );
}

export function Layout(props: ViewProps) {
  return <View {...props} />;
}

export function Resizable({
  children,
}: {
  children?: ReactNode;
}) {
  return <View style={{ flexDirection: "row", minHeight: 120 }}>{children}</View>;
}

export function BackgroundPicturePicker({
  onSelect,
}: {
  onSelect?: (id: string) => void;
}) {
  const { theme, colors } = useTheme();
  const presets = ["mesh", "dawn", "night"];
  return (
    <View style={{ flexDirection: "row", gap: theme.spacing[2] }}>
      {presets.map((id) => (
        <View
          key={id}
          onTouchEnd={() => onSelect?.(id)}
          style={{
            flex: 1,
            height: 56,
            borderRadius: theme.radii.lg,
            backgroundColor: colors.glassSurfaceFill,
            borderWidth: 1,
            borderColor: colors.glassChromeBorder,
          }}
        />
      ))}
    </View>
  );
}
