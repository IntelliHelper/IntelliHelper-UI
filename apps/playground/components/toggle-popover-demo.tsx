"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@intelli/ui";

function BoldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 4h-9" />
      <path d="M14 20H5" />
      <path d="M15 4 9 20" />
    </svg>
  );
}

function UnderlineIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4v6a6 6 0 0 0 12 0V4" />
      <path d="M4 20h16" />
    </svg>
  );
}

function AlignLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 6H3" />
      <path d="M15 12H3" />
      <path d="M17 18H3" />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 6H3" />
      <path d="M17 12H7" />
      <path d="M19 18H5" />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 6H3" />
      <path d="M21 12H9" />
      <path d="M21 18H7" />
    </svg>
  );
}

export function ToggleDemo() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Toggle bold" defaultPressed>
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <ItalicIcon />
      </Toggle>
      <Toggle aria-label="Toggle underline" variant="outline">
        <UnderlineIcon />
      </Toggle>
    </div>
  );
}

export function ToggleGroupDemo() {
  const [alignment, setAlignment] = useState("left");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ToggleGroup type="single" value={alignment} onValueChange={setAlignment}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="plain" size="sm" defaultValue="left">
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function PopoverDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
          </PopoverHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-3 items-center gap-3">
              <label htmlFor="popover-width" className="text-xs font-medium">
                Width
              </label>
              <Input
                id="popover-width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <label htmlFor="popover-height" className="text-xs font-medium">
                Height
              </label>
              <Input
                id="popover-height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Elevated</Button>
        </PopoverTrigger>
        <PopoverContent variant="elevated" size="lg" align="start">
          <PopoverHeader>
            <PopoverTitle>Quick actions</PopoverTitle>
            <PopoverDescription>Elevated variant with larger panel size.</PopoverDescription>
          </PopoverHeader>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_45%,transparent)]"
            >
              Duplicate
            </button>
            <button
              type="button"
              className="rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_45%,transparent)]"
            >
              Move to folder
            </button>
            <button
              type="button"
              className="rounded-lg px-2 py-1.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              Delete
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/** Combined showcase — not used in per-component examples. */
export function TogglePopoverDemo() {
  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Toggle</p>
        <div className="flex flex-wrap items-center gap-3">
          <ToggleDemo />
          <ToggleGroupDemo />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Popover</p>
        <PopoverDemo />
      </div>
    </div>
  );
}