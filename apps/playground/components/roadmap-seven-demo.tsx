"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Combobox,
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CopyButton,
  FileUpload,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Step,
  StepContent,
  StepDescription,
  StepIndicator,
  Stepper,
  StepTitle,
  ThemeToggle,
  type CommandItemData,
} from "@intelli/ui";

const frameworkOptions = [
  { value: "next", label: "Next.js", description: "React framework", keywords: ["react"] },
  { value: "remix", label: "Remix", description: "Full stack web", keywords: ["react"] },
  { value: "astro", label: "Astro", description: "Content-focused", keywords: ["static"] },
  { value: "sveltekit", label: "SvelteKit", description: "Svelte metaframework" },
  { value: "nuxt", label: "Nuxt", description: "Vue metaframework", keywords: ["vue"] },
];

export function ComboboxDemo() {
  const [value, setValue] = useState("next");
  return (
    <div className="w-full max-w-sm space-y-2">
      <Combobox
        options={frameworkOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework"
        searchPlaceholder="Filter frameworks…"
      />
      <p className="text-xs text-muted-foreground">
        Selected: <span className="font-medium text-foreground">{value || "none"}</span>
      </p>
    </div>
  );
}

export function CommandDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string>("");

  const items: CommandItemData[] = useMemo(
    () => [
      {
        value: "new-file",
        label: "New file",
        group: "File",
        shortcut: "⌘N",
        keywords: ["create"],
        onSelect: () => setLast("New file"),
      },
      {
        value: "open-settings",
        label: "Open settings",
        group: "File",
        shortcut: "⌘,",
        onSelect: () => setLast("Open settings"),
      },
      {
        value: "toggle-theme",
        label: "Toggle theme",
        group: "View",
        keywords: ["dark", "light"],
        onSelect: () => setLast("Toggle theme"),
      },
      {
        value: "search-docs",
        label: "Search docs",
        group: "Help",
        onSelect: () => setLast("Search docs"),
      },
    ],
    [],
  );

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => setOpen(true)}>
          Open command palette
        </Button>
        <span className="text-xs text-muted-foreground">
          Last run: {last || "—"}
        </span>
      </div>
      <Command items={items} className="max-w-md" onItemSelect={(item) => setLast(item.label)}>
        <CommandInput placeholder="Type a command…" />
        <CommandList />
      </Command>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        items={items}
        onItemSelect={(item) => setLast(item.label)}
      />
    </div>
  );
}

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="w-full max-w-md space-y-2">
      <FileUpload
        value={files}
        onValueChange={setFiles}
        accept={[".png", ".jpg", ".jpeg", ".pdf", "image/*"]}
        multiple
        label="Drop images or PDFs"
        description="PNG, JPG, or PDF up to your browser limit"
      />
      <p className="text-xs text-muted-foreground">
        {files.length} file{files.length === 1 ? "" : "s"} selected
      </p>
    </div>
  );
}

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[22rem] gap-1 p-3 sm:w-[28rem] sm:grid-cols-2">
              <li>
                <NavigationMenuLink href="#ui">
                  <div className="font-semibold">UI Kit</div>
                  <p className="text-xs text-muted-foreground">
                    Liquid Glass components
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#cli">
                  <div className="font-semibold">CLI</div>
                  <p className="text-xs text-muted-foreground">
                    Add components to any app
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#themes">
                  <div className="font-semibold">Themes</div>
                  <p className="text-xs text-muted-foreground">
                    Mono, Aurora, Sunset, Frost, Ocean
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#mcp">
                  <div className="font-semibold">MCP</div>
                  <p className="text-xs text-muted-foreground">
                    Agent-friendly registry tools
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[16rem] gap-1 p-3">
              <li>
                <NavigationMenuLink href="#docs">Documentation</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#changelog">Changelog</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#pricing"
            className="inline-flex h-9 items-center rounded-full px-4 text-sm font-medium"
          >
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function StepperDemo() {
  const [step, setStep] = useState(1);
  return (
    <div className="w-full max-w-xl space-y-4">
      <Stepper activeStep={step}>
        <Step>
          <StepIndicator />
          <StepContent>
            <StepTitle>Account</StepTitle>
            <StepDescription>Email & password</StepDescription>
          </StepContent>
        </Step>
        <Step>
          <StepIndicator />
          <StepContent>
            <StepTitle>Profile</StepTitle>
            <StepDescription>Name & avatar</StepDescription>
          </StepContent>
        </Step>
        <Step>
          <StepIndicator />
          <StepContent>
            <StepTitle>Plan</StepTitle>
            <StepDescription>Choose billing</StepDescription>
          </StepContent>
        </Step>
        <Step>
          <StepIndicator />
          <StepContent>
            <StepTitle>Done</StepTitle>
            <StepDescription>Launch workspace</StepDescription>
          </StepContent>
        </Step>
      </Stepper>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={step <= 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </Button>
        <Button
          size="sm"
          disabled={step >= 3}
          onClick={() => setStep((s) => Math.min(3, s + 1))}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export function ThemeToggleDemo() {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <ThemeToggle variant="outline" size="sm" />
      <ThemeToggle variant="ghost" size="lg" />
      <p className="text-xs text-muted-foreground">Toggles light / dark on the document</p>
    </div>
  );
}

export function CopyButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton value="npx @intellihelper/cli@latest add button -y" />
      <CopyButton
        value="import { Button } from '@/components/ui/button'"
        variant="outline"
        label="Copy import"
      />
      <CopyButton value="secret-token" size="icon" variant="ghost" />
    </div>
  );
}
