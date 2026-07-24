"use client";

import type { ReactNode } from "react";
import {
  AIChat,
  Badge,
  Button,
  ChatBubble,
  CodeViewer,
  GlassBar,
  GlassBarControls,
  GlassBarInfo,
  GlassBarMedia,
  GlassContentCard,
  GlassContentPanel,
  GlassIconButton,
  McpServerCard,
  PromptInput,
  ReasoningBlock,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TerminalBlock,
  ToolCallViewer,
} from "@intelli/ui";

function LayersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5"
    >
      <path d="m12 2 9 4.5-9 4.5L3 6.5 12 2Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17.5 9 4.5 9-4.5" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5"
    >
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="m5.6 5.6 2.1 2.1" />
      <path d="m16.3 16.3 2.1 2.1" />
      <path d="m16.3 7.7 2.1-2.1" />
      <path d="m5.6 18.4 2.1-2.1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="size-3"
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function StageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-[13.5rem] items-center justify-center overflow-hidden p-4 sm:h-[14.5rem] sm:p-5 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 20%, oklch(0.62 0.16 270 / 0.28), transparent 55%), radial-gradient(ellipse 55% 50% at 85% 75%, oklch(0.7 0.14 55 / 0.22), transparent 55%), radial-gradient(ellipse 40% 40% at 50% 50%, oklch(0.65 0.1 200 / 0.12), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent)",
        }}
        aria-hidden
      />
      <div className="relative z-[1] w-full max-w-[22rem]">{children}</div>
    </div>
  );
}

/** Content panels + floating chrome — the design system story. */
export function DesignSystemStage() {
  return (
    <StageShell>
      <GlassContentCard animated={false} className="relative h-[10.75rem] sm:h-[11.5rem]">
        <div className="flex h-full">
          <GlassContentPanel
            className="flex-[3] pb-14 sm:pb-16"
            gradient="linear-gradient(160deg, oklch(0.48 0.19 275), oklch(0.58 0.17 230))"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] content-text-muted">
              Content layer
            </p>
            <div className="mt-auto space-y-1">
              <p className="text-lg font-bold leading-tight tracking-tight content-text sm:text-xl">
                Liquid Glass
                <br />
                system
              </p>
            </div>
          </GlassContentPanel>
          <GlassContentPanel
            className="flex-[2] pb-14 sm:pb-16"
            gradient="linear-gradient(160deg, oklch(0.72 0.18 55), oklch(0.55 0.2 25))"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] content-text-muted">
              Themes
            </p>
            <div className="mt-auto">
              <p className="text-lg font-bold leading-tight tracking-tight content-text sm:text-xl">
                Five
                <br />
                palettes
              </p>
            </div>
          </GlassContentPanel>
        </div>
        <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3">
          <GlassBar size="sm" animated={false} className="pr-1">
            <GlassIconButton
              type="button"
              size="sm"
              aria-label="Layers"
              className="pointer-events-none"
              tabIndex={-1}
            >
              <LayersIcon />
            </GlassIconButton>
            <GlassBarMedia
              className="bg-gradient-to-br from-violet-500/90 to-cyan-500/80"
              aria-hidden
            />
            <GlassBarInfo title="Chrome layer" subtitle="Quiet controls" />
            <GlassBarControls>
              <GlassIconButton
                type="button"
                size="sm"
                aria-label="Spark"
                className="pointer-events-none"
                tabIndex={-1}
              >
                <SparkIcon />
              </GlassIconButton>
            </GlassBarControls>
          </GlassBar>
        </div>
      </GlassContentCard>
    </StageShell>
  );
}

/** First-class glass primitives, not blog CSS. */
export function GlassPrimitivesStage() {
  return (
    <StageShell>
      <div className="flex flex-col items-center gap-3.5">
        <GlassBar size="sm" animated={false} className="w-full pr-1">
          <GlassIconButton
            type="button"
            size="sm"
            aria-label="Home"
            className="pointer-events-none"
            tabIndex={-1}
          >
            <LayersIcon />
          </GlassIconButton>
          <GlassBarMedia
            className="bg-gradient-to-br from-fuchsia-500/80 to-orange-400/70"
            aria-hidden
          />
          <GlassBarInfo title="Glass-bar" subtitle="Chrome capsule" />
          <GlassBarControls>
            <GlassIconButton
              type="button"
              size="sm"
              aria-label="Play"
              className="pointer-events-none"
              tabIndex={-1}
            >
              <PlayIcon />
            </GlassIconButton>
            <GlassIconButton
              type="button"
              size="sm"
              aria-label="Search"
              className="pointer-events-none"
              tabIndex={-1}
            >
              <SearchIcon />
            </GlassIconButton>
          </GlassBarControls>
        </GlassBar>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <GlassIconButton
            type="button"
            size="sm"
            aria-label="Icon chrome"
            className="pointer-events-none"
            tabIndex={-1}
          >
            <SparkIcon />
          </GlassIconButton>
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="pill"
            className="pointer-events-none"
            tabIndex={-1}
          >
            Outline
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            shape="pill"
            className="pointer-events-none"
            tabIndex={-1}
          >
            Primary CTA
          </Button>
          <Badge variant="secondary" size="sm">
            glass-content-card
          </Badge>
        </div>
      </div>
    </StageShell>
  );
}

/** Real AI product components from the catalog. */
export function AiComponentsStage() {
  return (
    <StageShell>
      <div className="flex flex-col gap-2">
        <AIChat variant="chrome" className="gap-1.5 p-2 md:p-2">
          <ChatBubble role="user" className="max-w-[88%] text-[11px] leading-snug sm:text-xs">
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
          <ReasoningBlock title="Reasoning" defaultOpen={false} className="text-[11px]">
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
          <div className="flex flex-col gap-2.5 rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_40%,transparent)] p-3 backdrop-blur-[var(--glass-blur)]">
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
