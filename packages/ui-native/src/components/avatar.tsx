import { Image, Text, View, type ImageSourcePropType } from "react-native";
import { useTheme } from "../theme";

export interface AvatarProps {
  src?: ImageSourcePropType | string;
  alt?: string;
  fallback?: string;
  size?: number;
}

export function Avatar({ src, alt, fallback = "?", size = 40 }: AvatarProps) {
  const { theme, colors } = useTheme();
  const source =
    typeof src === "string" ? { uri: src } : src;
  return (
    <View
      accessibilityLabel={alt}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        backgroundColor: colors.glassChromeBgEnv,
        borderWidth: 1,
        borderColor: colors.glassChromeBorder,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {source ? (
        <Image source={source} style={{ width: size, height: size }} />
      ) : (
        <Text
          style={{
            color: colors.glassChromeFg,
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontWeights.medium,
          }}
        >
          {fallback}
        </Text>
      )}
    </View>
  );
}
