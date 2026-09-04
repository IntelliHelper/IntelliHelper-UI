import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../theme";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { Textarea } from "./textarea";

export function PromptInput(props: {
  value?: string;
  onChangeText?: (v: string) => void;
  onSubmit?: () => void;
}) {
  return (
    <View>
      <Textarea
        placeholder="Ask anything…"
        value={props.value}
        onChangeText={props.onChangeText}
      />
      <Button variant="primary" onPress={props.onSubmit} style={{ marginTop: 8 }}>
        Send
      </Button>
    </View>
  );
}

export function StreamingText({ text }: { text: string }) {
  const { colors } = useTheme();
  return <Text style={{ color: colors.foreground }}>{text}</Text>;
}

export function TypingIndicator() {
  return <Spinner size="sm" />;
}

export function ThinkingAnimation() {
  const { colors, theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
      <Spinner size="sm" />
      <Text style={{ color: colors.mutedForeground, fontSize: theme.fontSizes.sm }}>
        Thinking
      </Text>
    </View>
  );
}

export function ReasoningBlock({ children }: { children?: ReactNode }) {
  const { colors, theme } = useTheme();
  return (
    <View
      style={{
        padding: theme.spacing[3],
        borderLeftWidth: 2,
        borderLeftColor: colors.primary,
      }}
    >
      <Text style={{ color: colors.mutedForeground, fontSize: theme.fontSizes.sm }}>
        {children}
      </Text>
    </View>
  );
}

export function CitationCard({
  title,
  source,
}: {
  title: string;
  source?: string;
}) {
  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {source ? (
        <CardContent>
          <Text>{source}</Text>
        </CardContent>
      ) : null}
    </Card>
  );
}

export function TokenCounter({ used = 0, max = 128000 }: { used?: number; max?: number }) {
  const pct = Math.min(100, Math.round((used / max) * 100));
  return <Progress value={pct} />;
}

export function PromptSuggestions({
  items,
  onSelect,
}: {
  items: string[];
  onSelect?: (item: string) => void;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: theme.spacing[2] }}>
      {items.map((item) => (
        <Button key={item} variant="outline" onPress={() => onSelect?.(item)}>
          {item}
        </Button>
      ))}
    </View>
  );
}

export function AgentCard({
  name,
  status = "idle",
}: {
  name: string;
  status?: string;
}) {
  return (
    <Card variant="chrome">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">{status}</Badge>
      </CardContent>
    </Card>
  );
}

export function ToolCallViewer({
  name,
  args,
}: {
  name: string;
  args?: string;
}) {
  const { colors, theme } = useTheme();
  return (
    <View
      style={{
        padding: theme.spacing[3],
        borderRadius: theme.radii.lg,
        borderWidth: 1,
        borderColor: colors.glassChromeBorder,
      }}
    >
      <Text style={{ fontWeight: theme.fontWeights.semibold, color: colors.foreground }}>
        {name}
      </Text>
      {args ? (
        <Text style={{ color: colors.mutedForeground, fontFamily: "Menlo" }}>{args}</Text>
      ) : null}
    </View>
  );
}

export function McpServerCard({ name, connected }: { name: string; connected?: boolean }) {
  return (
    <Card variant="chrome">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant={connected ? "success" : "outline"}>
          {connected ? "Connected" : "Offline"}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function AiModelSelector({
  value,
  options,
  onChange,
}: {
  value?: string;
  options: string[];
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

export function ConversationSidebar({
  items,
}: {
  items: string[];
}) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: theme.spacing[1] }}>
      {items.map((item) => (
        <Button key={item} variant="ghost">
          {item}
        </Button>
      ))}
    </View>
  );
}

export function AiChat({
  messages,
}: {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const { colors, theme } = useTheme();
  return (
    <View style={{ gap: theme.spacing[3] }}>
      {messages.map((m, i) => (
        <View
          key={i}
          style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            padding: theme.spacing[3],
            borderRadius: theme.radii.xl,
            backgroundColor:
              m.role === "user" ? colors.primary : colors.glassChromeBgEnv,
          }}
        >
          <Text
            style={{
              color: m.role === "user" ? colors.primaryForeground : colors.foreground,
            }}
          >
            {m.content}
          </Text>
        </View>
      ))}
      <PromptInput />
    </View>
  );
}

export function FloatingWidget({ children }: { children?: ReactNode }) {
  const { theme, colors } = useTheme();
  return (
    <View
      style={{
        position: "absolute",
        right: theme.spacing[4],
        bottom: theme.spacing[4],
        borderRadius: theme.radii.full,
        backgroundColor: colors.primary,
        padding: theme.spacing[3],
      }}
    >
      {children ?? <Text style={{ color: colors.primaryForeground }}>AI</Text>}
    </View>
  );
}

export { Skeleton as ThinkingSkeleton };
