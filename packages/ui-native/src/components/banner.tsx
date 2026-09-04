import { type ReactNode } from "react";
import { Text } from "react-native";
import { useTheme } from "../theme";
import { Alert } from "./alert";

export function Banner({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  const { colors, theme } = useTheme();
  return (
    <Alert variant="chrome">
      <Text
        style={{
          color: colors.foreground,
          fontWeight: theme.fontWeights.semibold,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      {typeof children === "string" ? (
        <Text style={{ color: colors.mutedForeground, fontSize: theme.fontSizes.sm }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Alert>
  );
}

export function Callout(props: { title: string; children?: ReactNode }) {
  return <Banner {...props} />;
}

export function OfflineBanner() {
  return <Banner title="You’re offline">Changes will sync when you’re back online.</Banner>;
}
