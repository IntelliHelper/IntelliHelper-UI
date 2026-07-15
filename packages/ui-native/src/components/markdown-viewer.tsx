import { useMemo } from "react";
import {
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export interface MarkdownViewerProps {
  /** Markdown source string. */
  children?: string;
  content?: string;
  style?: StyleProp<ViewStyle>;
}

type Block =
  | { type: "h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "code"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "hr" };

function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) {
        buf.push(lines[i] ?? "");
        i++;
      }
      i++;
      blocks.push({ type: "code", text: buf.join("\n") });
      continue;
    }
    if (/^#{1,4}\s/.test(line)) {
      const level = (line.match(/^#+/)?.[0].length ?? 1) as 1 | 2 | 3 | 4;
      const text = line.replace(/^#{1,4}\s+/, "");
      blocks.push({
        type: (`h${Math.min(level, 4)}` as "h1" | "h2" | "h3" | "h4"),
        text,
      });
      i++;
      continue;
    }
    if (line.startsWith("> ")) {
      blocks.push({ type: "blockquote", text: line.slice(2) });
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }
    blocks.push({ type: "p", text: line });
    i++;
  }
  return blocks;
}

/** Lightweight markdown renderer (headings, lists, code, quotes). No external dep. */
export function MarkdownViewer({
  children,
  content,
  style,
}: MarkdownViewerProps) {
  const { theme, colors } = useTheme();
  const src = content ?? children ?? "";
  const blocks = useMemo(() => parseMarkdown(src), [src]);

  const baseText: TextStyle = {
    color: colors.foreground,
    fontSize: theme.fontSizes.base,
    lineHeight: theme.fontSizes.base * theme.lineHeights.relaxed,
  };

  const headingSizes: Record<"h1" | "h2" | "h3" | "h4", number> = {
    h1: theme.fontSizes["3xl"],
    h2: theme.fontSizes["2xl"],
    h3: theme.fontSizes.xl,
    h4: theme.fontSizes.lg,
  };

  return (
    <View style={cn({ gap: theme.spacing[3] }, style)}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "hr":
            return (
              <View
                key={idx}
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginVertical: theme.spacing[2],
                }}
              />
            );
          case "code":
            return (
              <View
                key={idx}
                style={{
                  backgroundColor: colors.muted,
                  borderRadius: theme.radii.lg,
                  padding: theme.spacing[3],
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Menlo",
                    fontSize: theme.fontSizes.sm,
                    color: colors.foreground,
                  }}
                >
                  {block.text}
                </Text>
              </View>
            );
          case "ul":
          case "ol":
            return (
              <View key={idx} style={{ gap: 4, paddingLeft: theme.spacing[2] }}>
                {block.items.map((item, j) => (
                  <Text key={j} style={baseText}>
                    {block.type === "ul" ? "• " : `${j + 1}. `}
                    {item}
                  </Text>
                ))}
              </View>
            );
          case "blockquote":
            return (
              <View
                key={idx}
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: colors.border,
                  paddingLeft: theme.spacing[3],
                }}
              >
                <Text
                  style={{
                    ...baseText,
                    fontStyle: "italic",
                    color: colors.mutedForeground,
                  }}
                >
                  {block.text}
                </Text>
              </View>
            );
          case "h1":
          case "h2":
          case "h3":
          case "h4": {
            const size = headingSizes[block.type];
            return (
              <Text
                key={idx}
                style={{
                  ...baseText,
                  fontSize: size,
                  fontWeight: theme.fontWeights.semibold,
                  lineHeight: size * theme.lineHeights.snug,
                }}
              >
                {block.text}
              </Text>
            );
          }
          case "p":
          default:
            return (
              <Text key={idx} style={baseText}>
                {"text" in block ? block.text : ""}
              </Text>
            );
        }
      })}
    </View>
  );
}

export function MarkdownCodeBlock({
  children,
  style,
}: {
  children?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme, colors } = useTheme();
  return (
    <View
      style={cn(
        {
          backgroundColor: colors.muted,
          borderRadius: theme.radii.lg,
          padding: theme.spacing[3],
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      )}
    >
      <Text
        style={{
          fontFamily: "Menlo",
          fontSize: theme.fontSizes.sm,
          color: colors.foreground,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
