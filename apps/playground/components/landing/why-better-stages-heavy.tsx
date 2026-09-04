"use client";

/**
 * Below-fold live demos. Split from light stages so homepage critical path
 * does not pull AI/code chrome until the comparison section is near viewport.
 */
import { AIChat, ChatBubble } from "@intelli/ui/ai-chat";
import { Badge } from "@intelli/ui/badge";
import { Button } from "@intelli/ui/button";
import { CodeViewer } from "@intelli/ui/code-viewer";
import { McpServerCard } from "@intelli/ui/mcp-server-card";
import { PromptInput } from "@intelli/ui/prompt-input";
import { ReasoningBlock } from "@intelli/ui/reasoning-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@intelli/ui/tabs";
import { TerminalBlock } from "@intelli/ui/terminal-block";
import { ToolCallViewer } from "@intelli/ui/tool-call-viewer";
import { StageShell } from "./stage-shell";

/** Real AI product components from the catalog. */
export function AiComponentsStage() {
  return (
    <StageShell>
      <div className="flex flex-col gap-2">
        <AIChat variant="chrome" className="gap-1.5 p-2 md:p-2">
          <ChatBubble
            role="user"
            className="max-w-[88%] text-[11px] leading-snug sm:text-xs"
          >
            Add a glass chat shell
          </ChatBubble>
          <ChatBubble
            role="assistant"
            name="Intelli"
            className="max-w-[95%] text-[11px] leading-snug sm:text-xs"
          >
            Using AIChat, ReasoningBlock, and ToolCallViewer.
          </ChatBubble>
        </AIChat>

        <div className="grid grid-cols-2 gap-1.5">
          <ReasoningBlock
            title="Reasoning"
            defaultOpen={false}
            className="text-[11px]"
          >
            Map chrome vs content for agent UIs.
          </ReasoningBlock>
          <ToolCallViewer
            name="add ai-chat"
            status="success"
            defaultOpen={false}
            className="text-[10px]"
          />
        </div>
      </div>
    </StageShell>
  );
}

/** Agent + MCP tooling story. */
export function AgentsStage() {
  return (
    <StageShell>
      <div className="flex flex-col gap-2.5">
        <McpServerCard
          name="intellihelper-ui"
          transport="stdio"
          status="connected"
          toolsCount={8}
          resourcesCount={80}
          className="gap-2 p-3"
        />
        <TerminalBlock
          title="Agent install"
          maxHeight={88}
          className="text-[11px] [&_[data-slot=terminal-block-body]]:py-2.5 [&_[data-slot=terminal-line]]:break-words [&_[data-slot=terminal-line]]:whitespace-pre-wrap"
          lines={[
            {
              type: "input",
              content: "plugin install intellihelper-ui",
            },
            { type: "output", content: "Skills + MCP ready" },
          ]}
        />
      </div>
    </StageShell>
  );
}

/** You own the TypeScript source. */
export function SourceOwnershipStage() {
  return (
    <StageShell>
      <CodeViewer
        title="button.tsx"
        language="tsx"
        showLineNumbers
        showCopy={false}
        maxHeight={168}
        className="text-[11px]"
        code={`export function Button({
  variant = "default",
  ...props
}: ButtonProps) {
  // You own this after CLI add
  return (
    <button
      className={buttonVariants({ variant })}
      {...props}
    />
  )
}`}
      />
    </StageShell>
  );
}

/** Live preview + install in one place. */
export function LivePreviewsStage() {
  return (
    <StageShell>
      <Tabs defaultValue="preview" className="w-full">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <TabsList variant="chrome" size="sm">
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs">
              Source
            </TabsTrigger>
          </TabsList>
          <Badge variant="outline" size="sm">
            Live
          </Badge>
        </div>
        <TabsContent value="preview" className="mt-0 outline-none">
          <div className="flex flex-col gap-2.5 rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_40%, var(--glass-mix-into))] p-3 backdrop-blur-[var(--glass-blur)]">
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="primary" size="sm" shape="pill">
                Get started
              </Button>
              <Button type="button" variant="outline" size="sm" shape="pill">
                Browse
              </Button>
              <Badge variant="secondary" size="sm">
                button · badge
              </Badge>
            </div>
            <PromptInput
              defaultValue="npx @intellihelper/cli add button"
              placeholder="Install a component…"
              showTokenCount={false}
              submitLabel="Run"
              className="p-1.5"
              textareaProps={{
                rows: 1,
                className: "min-h-[2.25rem] resize-none py-1.5 text-xs",
              }}
            />
          </div>
        </TabsContent>
        <TabsContent value="code" className="mt-0 outline-none">
          <CodeViewer
            title="install"
            language="bash"
            showLineNumbers={false}
            showCopy={false}
            maxHeight={120}
            className="text-[11px]"
            code={`npx @intellihelper/cli@latest add button
# Live demo + source on every page`}
          />
        </TabsContent>
      </Tabs>
    </StageShell>
  );
}
