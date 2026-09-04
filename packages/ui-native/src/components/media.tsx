import type { ReactNode } from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";
import { useTheme } from "../theme";
import { Button } from "./button";
import { Progress } from "./progress";

export function AspectRatio({
  ratio = 16 / 9,
  children,
}: {
  ratio?: number;
  children?: ReactNode;
}) {
  return (
    <View style={{ width: "100%", aspectRatio: ratio, overflow: "hidden" }}>
      {children}
    </View>
  );
}

export function ImagePreview({
  source,
}: {
  source: ImageSourcePropType | string;
}) {
  const src = typeof source === "string" ? { uri: source } : source;
  return (
    <AspectRatio>
      <Image source={src} style={{ width: "100%", height: "100%" }} />
    </AspectRatio>
  );
}

export function ImageEditor({ source }: { source: ImageSourcePropType | string }) {
  return <ImagePreview source={source} />;
}

export function MediaPlayer({
  title = "Track",
  progress = 35,
}: {
  title?: string;
  progress?: number;
}) {
  const { colors, theme } = useTheme();
  return (
    <View style={{ gap: theme.spacing[3] }}>
      <Text style={{ color: colors.foreground, fontWeight: theme.fontWeights.semibold }}>
        {title}
      </Text>
      <Progress value={progress} />
      <Button variant="primary">Play</Button>
    </View>
  );
}

export function FileUpload({
  label = "Choose file",
  onPress,
}: {
  label?: string;
  onPress?: () => void;
}) {
  return (
    <Button variant="outline" onPress={onPress}>
      {label}
    </Button>
  );
}

export function FontPicker({
  value,
  options = ["System", "Serif", "Mono"],
  onChange,
}: {
  value?: string;
  options?: string[];
  onChange?: (v: string) => void;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: theme.spacing[2] }}>
      {options.map((o) => (
        <Button
          key={o}
          variant={o === value ? "primary" : "outline"}
          onPress={() => onChange?.(o)}
        >
          {o}
        </Button>
      ))}
    </View>
  );
}
