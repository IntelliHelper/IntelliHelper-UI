import { useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../theme";
import { ScrollArea } from "./scroll-area";
import { Textarea } from "./textarea";
import { MarkdownViewer } from "./markdown-viewer";

export function CodeViewer({ code }: { code: string }) {
  const { colors, theme } = useTheme();
  return (
    <ScrollArea style={{ maxHeight: 220 }}>
      <Text
        selectable
        style={{
          fontFamily: "Menlo",
          fontSize: theme.fontSizes.xs,
          color: colors.foreground,
        }}
      >
        {code}
      </Text>
    </ScrollArea>
  );
}

export function JsonViewer({ value }: { value: unknown }) {
  return <CodeViewer code={JSON.stringify(value, null, 2)} />;
}

export function TerminalBlock({ lines }: { lines: string[] }) {
  return <CodeViewer code={lines.join("\n")} />;
}

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange?: (v: string) => void;
}) {
  const { theme } = useTheme();
  const [tab, setTab] = useState<"write" | "preview">("write");
  return (
    <View style={{ gap: theme.spacing[2] }}>
      {tab === "write" ? (
        <Textarea value={value} onChangeText={onChange} />
      ) : (
        <MarkdownViewer content={value} />
      )}
      <Text
        onPress={() => setTab(tab === "write" ? "preview" : "write")}
        style={{ textAlign: "right" }}
      >
        {tab === "write" ? "Preview" : "Write"}
      </Text>
    </View>
  );
}

export function ComponentPreview({ children }: { children?: ReactNode }) {
  const { theme, colors } = useTheme();
  return (
    <View
      style={{
        borderRadius: theme.radii.xl,
        borderWidth: 1,
        borderColor: colors.glassChromeBorder,
        padding: theme.spacing[4],
      }}
    >
      {children}
    </View>
  );
}
