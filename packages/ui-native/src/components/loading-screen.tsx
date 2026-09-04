import { Text, View } from "react-native";
import { useTheme } from "../theme";
import { Spinner } from "./spinner";

export function LoadingScreen({ label = "Loading" }: { label?: string }) {
  const { colors, theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        minHeight: 180,
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing[3],
      }}
    >
      <Spinner />
      <Text style={{ color: colors.mutedForeground, fontSize: theme.fontSizes.sm }}>
        {label}
      </Text>
    </View>
  );
}

export function RetryView({
  title = "Something went wrong",
  onRetry,
}: {
  title?: string;
  onRetry?: () => void;
}) {
  const { colors, theme } = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        gap: theme.spacing[3],
        padding: theme.spacing[6],
      }}
    >
      <Text style={{ color: colors.foreground, fontWeight: theme.fontWeights.semibold }}>
        {title}
      </Text>
      <Text
        onPress={onRetry}
        style={{ color: colors.primary, fontSize: theme.fontSizes.sm }}
      >
        Try again
      </Text>
    </View>
  );
}
