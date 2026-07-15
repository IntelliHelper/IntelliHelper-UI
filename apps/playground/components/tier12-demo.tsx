"use client";

import { useMemo, useState } from "react";
import {
  AgentCard,
  AIChat,
  AIModelSelector,
  AspectRatio,
  AssistantMessage,
  CitationCard,
  CodeViewer,
  ConversationSidebar,
  JsonViewer,
  McpServerCard,
  MultiSelect,
  NotificationCenter,
  PromptInput,
  PromptSuggestions,
  ReasoningBlock,
  StreamingText,
  TerminalBlock,
  ThinkingAnimation,
  TokenCounter,
  ToolCallViewer,
  TypingIndicator,
  UserMessage,
  type ConversationItem,
  type NotificationItem,
  type PromptSuggestion,
} from "@intelli/ui";

const multiOptions = [
  { value: "ts", label: "TypeScript", keywords: ["javascript"] },
  { value: "py", label: "Python" },
  { value: "rs", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "swift", label: "Swift", disabled: true },
];

export function MultiSelectDemo() {
  const [value, setValue] = useState<string[]>(["ts", "py"]);
  return (
    <div className="w-full max-w-md space-y-2">
      <MultiSelect
        options={multiOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Select languages"
        searchPlaceholder="Filter…"
      />
      <p className="text-xs text-muted-foreground">
        Selected: {value.join(", ") || "none"}
      </p>
    </div>
  );
}

const sampleNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Deploy succeeded",
    description: "Production deploy finished in 42s.",
    createdAt: Date.now() - 2 * 60_000,
    status: "unread",
    category: "system",
  },
  {
    id: "2",
    title: "New comment",
    description: "Maya left feedback on your PR.",
    createdAt: Date.now() - 45 * 60_000,
    status: "unread",
    category: "social",
  },
  {
    id: "3",
    title: "Weekly summary",
    description: "Your usage report is ready.",
    createdAt: Date.now() - 86_400_000,
    status: "read",
    category: "product",
  },
];

export function NotificationCenterDemo() {
  const [items, setItems] = useState(sampleNotifications);
  return (
    <div className="w-full max-w-md">
      <NotificationCenter items={items} onItemsChange={setItems} />
    </div>
  );
}

const sampleCode = `export function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet("IntelliHelper"));
`;

export function CodeViewerDemo() {
  return (
    <div className="w-full max-w-lg">
      <CodeViewer code={sampleCode} language="ts" title="greet.ts" />
    </div>
  );
}

export function TerminalBlockDemo() {
  return (
    <div className="w-full max-w-lg">
      <TerminalBlock
        lines={[
          { type: "input", content: "pnpm add @intelli/ui" },
          { type: "output", content: "Packages: +12" },
          { type: "input", content: "pnpm dev" },
          { type: "output", content: "ready on http://localhost:3000" },
          { type: "comment", content: "# ship liquid glass" },
        ]}
      />
    </div>
  );
}

export function JsonViewerDemo() {
  const data = useMemo(
    () =>
      JSON.stringify({
        name: "IntelliHelper",
        themes: ["mono", "aurora", "frost"],
        shipped: true,
      }),
    [],
  );
  return (
    <div className="w-full max-w-lg">
      <JsonViewer data={data} title="package-meta" />
    </div>
  );
}

export function AspectRatioDemo() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio
        ratio={16 / 9}
        className="rounded-2xl border border-[var(--glass-chrome-border)]"
      >
        <div className="flex size-full items-center justify-center bg-[color-mix(in_oklch,var(--primary)_18%,transparent)] text-sm font-medium">
          16:9 media
        </div>
      </AspectRatio>
    </div>
  );
}

export function AIChatDemo() {
  return (
    <div className="w-full max-w-lg space-y-3">
      <AIChat>
        <UserMessage>How do I install Liquid Glass components?</UserMessage>
        <AssistantMessage>
          <StreamingText
            text="Use the CLI: npx @intellihelper/cli add button dialog."
            isStreaming={false}
          />
        </AssistantMessage>
        <div className="flex items-center gap-2 pl-1">
          <TypingIndicator />
          <ThinkingAnimation label="Planning" />
        </div>
      </AIChat>
    </div>
  );
}

export function PromptInputDemo() {
  const [value, setValue] = useState("");
  const [last, setLast] = useState("");
  return (
    <div className="w-full max-w-lg space-y-2">
      <PromptInput
        value={value}
        onValueChange={setValue}
        onSubmit={(prompt) => {
          setLast(prompt);
          setValue("");
        }}
        placeholder="Ask anything…"
      />
      {last ? (
        <p className="text-xs text-muted-foreground">Last submit: {last}</p>
      ) : null}
    </div>
  );
}

export function StreamingTextDemo() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--glass-chrome-border)] p-4">
      <StreamingText
        text="Streaming responses feel faster with a caret and progressive reveal."
        streamRate={2}
        showCaret
      />
    </div>
  );
}

export function TypingIndicatorDemo() {
  return <TypingIndicator />;
}

export function ThinkingAnimationDemo() {
  return <ThinkingAnimation label="Reasoning" />;
}

export function ReasoningBlockDemo() {
  return (
    <div className="w-full max-w-lg">
      <ReasoningBlock defaultOpen title="Reasoning">
        First check whether the registry slug exists, then wire exports and demos.
      </ReasoningBlock>
    </div>
  );
}

export function CitationCardDemo() {
  return (
    <div className="w-full max-w-md space-y-2">
      <CitationCard
        index={1}
        title="Liquid Glass design system"
        source="docs.intellihelper.dev"
        excerpt="Chrome layers float over expressive content panels with restrained blur."
        href="https://example.com"
      />
    </div>
  );
}

export function TokenCounterDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <TokenCounter text="Hello world from the token counter demo." />
      <TokenCounter count={920} limit={1000} />
      <TokenCounter count={1200} limit={1000} />
    </div>
  );
}

const suggestions: PromptSuggestion[] = [
  {
    id: "1",
    label: "Explain Liquid Glass",
    prompt: "Explain Liquid Glass chrome vs content layers.",
    keywords: ["design"],
  },
  {
    id: "2",
    label: "Scaffold a settings page",
    prompt: "Scaffold a settings page with tabs and forms.",
    keywords: ["compose"],
  },
  {
    id: "3",
    label: "Add toast notifications",
    prompt: "Show me how to use the toast API.",
  },
];

export function PromptSuggestionsDemo() {
  const [picked, setPicked] = useState("");
  return (
    <div className="w-full max-w-lg space-y-2">
      <PromptSuggestions
        suggestions={suggestions}
        onSelect={(item) => setPicked(item.prompt)}
      />
      {picked ? (
        <p className="text-xs text-muted-foreground">{picked}</p>
      ) : null}
    </div>
  );
}

export function AgentCardDemo() {
  return (
    <div className="w-full max-w-md">
      <AgentCard
        name="Research Agent"
        description="Fetches docs, cites sources, and summarizes findings."
        status="running"
        tools={
          <>
            <span className="rounded-full border border-[var(--glass-chrome-border)] px-2 py-0.5 text-[10px]">
              web_search
            </span>
            <span className="rounded-full border border-[var(--glass-chrome-border)] px-2 py-0.5 text-[10px]">
              open_page
            </span>
          </>
        }
      />
    </div>
  );
}

export function ToolCallViewerDemo() {
  return (
    <div className="w-full max-w-lg">
      <ToolCallViewer
        name="web_search"
        status="success"
        args={{ query: "liquid glass ui", limit: 5 }}
        result={{ hits: 12, top: "IntelliHelper UI" }}
      />
    </div>
  );
}

export function McpServerCardDemo() {
  return (
    <div className="w-full max-w-md">
      <McpServerCard
        name="filesystem"
        transport="stdio"
        status="connected"
        toolsCount={8}
        resourcesCount={3}
      />
    </div>
  );
}

const models = [
  {
    value: "grok-4",
    label: "Grok 4",
    provider: "xAI",
    description: "Flagship reasoning",
  },
  {
    value: "grok-fast",
    label: "Grok Fast",
    provider: "xAI",
    description: "Low latency",
  },
  {
    value: "local",
    label: "Local 7B",
    provider: "Ollama",
    description: "On-device",
  },
];

export function AIModelSelectorDemo() {
  const [value, setValue] = useState("grok-4");
  return (
    <div className="w-full max-w-sm">
      <AIModelSelector
        models={models}
        value={value}
        onValueChange={setValue}
        label="Model"
      />
    </div>
  );
}

const conversations: ConversationItem[] = [
  {
    id: "c1",
    title: "Liquid Glass audit",
    updatedAt: Date.now() - 5 * 60_000,
    pinned: true,
  },
  {
    id: "c2",
    title: "Settings page compose",
    updatedAt: Date.now() - 2 * 3_600_000,
  },
  {
    id: "c3",
    title: "MCP server wiring",
    updatedAt: Date.now() - 86_400_000,
  },
];

export function ConversationSidebarDemo() {
  const [activeId, setActiveId] = useState("c1");
  const [items, setItems] = useState(conversations);
  return (
    <div className="h-72 w-full max-w-xs">
      <ConversationSidebar
        conversations={items}
        activeId={activeId}
        onSelect={(item) => setActiveId(item.id)}
        onNewChat={() => {
          const id = `c${Date.now()}`;
          setItems((prev) => [
            { id, title: "New chat", updatedAt: Date.now() },
            ...prev,
          ]);
          setActiveId(id);
        }}
      />
    </div>
  );
}
