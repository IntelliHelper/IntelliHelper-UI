"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  Center,
  Cluster,
  Flex,
  Grid,
  NativeSelect,
  NativeSelectOption,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  ScrollToTop,
  Separator,
  Spinner,
  Stack,
  TypographyBlockquote,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
} from "@intelli/ui";

const scrollItems = Array.from({ length: 24 }, (_, index) => `Item ${index + 1}`);

function LabelRow({
  id,
  label,
  description,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Flex align="start" gap={3}>
      {children}
      <Stack gap={0.5}>
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </Stack>
    </Flex>
  );
}

export function SeparatorDemo() {
  return (
    <Stack gap={3}>
      <p className="text-sm glass-chrome-text-muted">Horizontal chrome divider</p>
      <Separator variant="chrome" />
      <Flex align="center" gap={3} className="h-10">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" className="h-6" />
        <span className="text-sm">Right</span>
      </Flex>
    </Stack>
  );
}

export function SpinnerDemo() {
  return (
    <Stack gap={4}>
      <Cluster gap={4}>
        <Spinner />
        <Spinner type="ring" variant="primary" />
        <Spinner type="dots" variant="chrome" />
        <Spinner type="bars" variant="muted" />
        <Spinner type="pulse" variant="primary" size="lg" />
        <Spinner type="apple" variant="chrome" size="lg" />
      </Cluster>
      <Cluster gap={4}>
        <Spinner size="sm" />
        <Spinner type="ring" size="default" />
        <Spinner type="dots" size="lg" />
        <Spinner type="bars" size="xl" variant="chrome" />
      </Cluster>
    </Stack>
  );
}

export function ProgressDemo() {
  const [progress, setProgress] = useState(62);

  return (
    <Stack gap={3} className="w-full max-w-md">
      <Flex align="center" justify="between" className="text-sm">
        <span>Upload progress</span>
        <span className="glass-chrome-text-muted">{progress}%</span>
      </Flex>
      <Progress value={progress} />
      <input
        aria-label="Progress value"
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={(event) => setProgress(Number(event.target.value))}
        className="w-full"
      />
    </Stack>
  );
}

export function RadioGroupDemo() {
  const [plan, setPlan] = useState("starter");

  return (
    <RadioGroup value={plan} onValueChange={setPlan}>
      <LabelRow id="plan-starter" label="Starter" description="Free tier with basics">
        <RadioGroupItem id="plan-starter" value="starter" aria-label="Starter plan" />
      </LabelRow>
      <LabelRow id="plan-pro" label="Pro" description="Advanced glass components">
        <RadioGroupItem id="plan-pro" value="pro" aria-label="Pro plan" />
      </LabelRow>
      <LabelRow id="plan-team" label="Team" description="Shared workspace controls">
        <RadioGroupItem id="plan-team" value="team" aria-label="Team plan" />
      </LabelRow>
    </RadioGroup>
  );
}

export function NativeSelectDemo() {
  return (
    <Stack gap={4}>
      <NativeSelect defaultValue="chrome" aria-label="Theme preset">
        <NativeSelectOption value="chrome">Chrome</NativeSelectOption>
        <NativeSelectOption value="outline">Outline</NativeSelectOption>
        <NativeSelectOption value="elevated">Elevated</NativeSelectOption>
      </NativeSelect>
      <NativeSelect variant="outline" size="sm" width="fit" defaultValue="sm">
        <NativeSelectOption value="sm">Small</NativeSelectOption>
        <NativeSelectOption value="default">Default</NativeSelectOption>
        <NativeSelectOption value="lg">Large</NativeSelectOption>
      </NativeSelect>
    </Stack>
  );
}

export function ScrollAreaDemo() {
  return (
    <ScrollArea variant="chrome" className="h-48 w-full max-w-md p-4">
      <Stack gap={2} className="pr-4">
        {scrollItems.map((item) => (
          <p key={item} className="text-sm glass-chrome-text-muted">
            {item}
          </p>
        ))}
      </Stack>
    </ScrollArea>
  );
}

export function ScrollToTopDemo() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollAreaRef} className="relative w-full max-w-md">
      <ScrollArea variant="chrome" className="h-48 p-4">
        <Stack gap={2} className="pr-4">
          {scrollItems.map((item) => (
            <p key={item} className="text-sm glass-chrome-text-muted">
              {item}
            </p>
          ))}
        </Stack>
      </ScrollArea>
      <ScrollToTop withinRef={scrollAreaRef} threshold={48} />
    </div>
  );
}

export function ResizableDemo() {
  return (
    <ResizablePanelGroup variant="chrome" className="min-h-48 w-full">
      <ResizablePanel defaultSize={35} minSize={20}>
        <Center className="h-full p-6 text-sm glass-chrome-text-muted">
          Sidebar
        </Center>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65} minSize={30}>
        <Center className="h-full p-6 text-sm">Main content area</Center>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function TypographyDemo() {
  return (
    <Stack gap={2} className="max-w-2xl">
      <TypographyLead>
        Semantic text primitives for documentation and product copy.
      </TypographyLead>
      <TypographyH3>The Joke Tax</TypographyH3>
      <TypographyP>
        Once upon a time, in a far-off land, there was a very lazy king who spent
        all day lounging on his throne.
      </TypographyP>
      <TypographyBlockquote>
        Everyone enjoys a good joke, so it is only fair they should pay for the
        privilege.
      </TypographyBlockquote>
      <TypographyH4>Penalty tiers</TypographyH4>
      <TypographyList>
        <li>1st level of puns: 5 gold coins</li>
        <li>2nd level of jokes: 10 gold coins</li>
        <li>3rd level of one-liners: 20 gold coins</li>
      </TypographyList>
      <TypographyMuted>
        Built with <TypographyInlineCode>@intelli/ui</TypographyInlineCode>{" "}
        typography primitives.
      </TypographyMuted>
    </Stack>
  );
}

/** Combined showcase — not used in per-component examples. */
export function LayoutUtilityDemo() {
  return (
    <Stack gap={8}>
      <Grid cols={1} lgCols={2} gap={8}>
        <Stack gap={5}>
          <p className="text-sm font-medium text-foreground">Separator & Spinner</p>
          <SeparatorDemo />
          <SpinnerDemo />
        </Stack>
        <Stack gap={5}>
          <p className="text-sm font-medium text-foreground">Progress & Radio Group</p>
          <ProgressDemo />
          <RadioGroupDemo />
        </Stack>
      </Grid>
      <Grid cols={1} lgCols={2} gap={8}>
        <Stack gap={4}>
          <p className="text-sm font-medium text-foreground">Native Select</p>
          <NativeSelectDemo />
        </Stack>
        <Stack gap={4}>
          <p className="text-sm font-medium text-foreground">Scroll Area</p>
          <ScrollToTopDemo />
        </Stack>
      </Grid>
      <Stack gap={4}>
        <p className="text-sm font-medium text-foreground">Resizable Panels</p>
        <ResizableDemo />
      </Stack>
      <Stack gap={3}>
        <p className="text-sm font-medium text-foreground">Typography</p>
        <TypographyDemo />
      </Stack>
    </Stack>
  );
}