"use client";

import { useState, type ReactNode } from "react";
import {
  NativeSelect,
  NativeSelectOption,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Separator,
  Spinner,
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
    <div className="flex items-start gap-3">
      {children}
      <div className="grid gap-0.5">
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export function LayoutUtilityDemo() {
  const [plan, setPlan] = useState("starter");
  const [progress, setProgress] = useState(62);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <p className="text-sm font-medium text-foreground">Separator & Spinner</p>
          <div className="space-y-3">
            <p className="text-sm glass-chrome-text-muted">Horizontal chrome divider</p>
            <Separator variant="chrome" />
            <div className="flex h-10 items-center gap-3">
              <span className="text-sm">Left</span>
              <Separator orientation="vertical" className="h-6" />
              <span className="text-sm">Right</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Spinner />
            <Spinner variant="primary" size="lg" />
            <Spinner variant="chrome" size="xl" />
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-sm font-medium text-foreground">Progress & Radio Group</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Upload progress</span>
              <span className="glass-chrome-text-muted">{progress}%</span>
            </div>
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
          </div>
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
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Native Select</p>
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
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Scroll Area</p>
          <ScrollArea variant="chrome" className="h-40 p-4">
            <div className="space-y-2 pr-4">
              {scrollItems.map((item) => (
                <p key={item} className="text-sm glass-chrome-text-muted">
                  {item}
                </p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">Resizable Panels</p>
        <ResizablePanelGroup variant="chrome" className="min-h-48 max-w-3xl">
          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="flex h-full items-center justify-center p-6 text-sm glass-chrome-text-muted">
              Sidebar
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} minSize={30}>
            <div className="flex h-full items-center justify-center p-6 text-sm">
              Main content area
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Typography</p>
        <div className="max-w-2xl space-y-2">
          <TypographyLead>
            Semantic text primitives for documentation and product copy.
          </TypographyLead>
          <TypographyH3>The Joke Tax</TypographyH3>
          <TypographyP>
            Once upon a time, in a far-off land, there was a very lazy king who
            spent all day lounging on his throne.
          </TypographyP>
          <TypographyBlockquote>
            Everyone enjoys a good joke, so it is only fair they should pay for
            the privilege.
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
        </div>
      </div>
    </div>
  );
}