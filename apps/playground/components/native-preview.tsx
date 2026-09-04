"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  CopyButton,
} from "@intelli/ui";
import { Cluster, Stack } from "@intelli/ui/layout";
import { NativePhoneFrame } from "./native-phone-frame";

type NativePreviewProps = {
  slug: string;
  title: string;
  category: string;
};

export function NativePreview({ slug, title, category }: NativePreviewProps) {
  return (
    <NativePhoneFrame>
      <PreviewBody slug={slug} title={title} category={category} />
    </NativePhoneFrame>
  );
}

function CategoryDemo({
  title,
  category,
  slug,
}: {
  title: string;
  category: string;
  slug: string;
}) {
  if (slug === "link" || category === "navigation") {
    return (
      <Stack gap={3}>
        <p className="text-[15px] font-semibold tracking-tight">{title}</p>
        <a
          href="https://ui.intellihelper.in"
          className="text-sm font-medium text-primary underline underline-offset-4"
        >
          Open {title}
        </a>
        <p className="text-xs text-muted-foreground">
          Native {title} uses onPress / Linking, not className.
        </p>
      </Stack>
    );
  }
  if (category === "forms") {
    return (
      <Stack gap={2}>
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <Input placeholder={title} />
      </Stack>
    );
  }
  if (category === "overlays" || category === "actions") {
    return (
      <Stack gap={3}>
        <p className="text-[15px] font-semibold tracking-tight">{title}</p>
        <Button variant="primary" className="w-full">
          {title}
        </Button>
      </Stack>
    );
  }
  if (category === "feedback") {
    return (
      <Alert>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>Native {title} on iPhone.</AlertDescription>
      </Alert>
    );
  }
  if (category === "data") {
    return (
      <Card variant="chrome">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Native preview</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={64} />
        </CardContent>
      </Card>
    );
  }
  if (category === "media") {
    return (
      <Stack gap={3}>
        <p className="text-[15px] font-semibold">{title}</p>
        <div className="aspect-video rounded-2xl bg-[color-mix(in_oklch,var(--glass-surface-fill)_70%, var(--glass-mix-into))]" />
        <Button variant="primary">Play</Button>
      </Stack>
    );
  }
  if (category === "content") {
    return (
      <Stack gap={2}>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Liquid Glass {title} on React Native.
        </p>
      </Stack>
    );
  }
  return (
    <Card variant="chrome">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>React Native</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="primary" className="w-full">
          {title}
        </Button>
      </CardContent>
    </Card>
  );
}

function PreviewBody({
  slug,
  title,
  category,
}: {
  slug: string;
  title: string;
  category: string;
}) {
  const [on, setOn] = useState(true);
  const [checked, setChecked] = useState(false);
  const [pressed, setPressed] = useState(true);
  const [radio, setRadio] = useState("a");
  const [slider, setSlider] = useState([40]);
  const [date, setDate] = useState<Date | undefined>(new Date());

  switch (slug) {
    case "button":
      return (
        <Stack gap={3}>
          <Button variant="primary">Continue</Button>
          <Button variant="outline">Secondary</Button>
          <Button variant="ghost">Skip</Button>
        </Stack>
      );
    case "copy-button":
      return (
        <Stack gap={3}>
          <p className="text-[13px] font-medium text-foreground">Invite link</p>
          <p className="rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%, var(--glass-mix-into))] px-3 py-2 font-mono text-xs text-muted-foreground">
            intellihelper.in/join
          </p>
          <CopyButton value="https://ui.intellihelper.in/native/copy-button" />
        </Stack>
      );
    case "theme-toggle":
      return (
        <Stack gap={3} className="items-start">
          <p className="text-sm text-muted-foreground">Appearance</p>
          <Button variant="outline" size="icon" shape="pill" aria-label="Toggle theme">
            ☾
          </Button>
        </Stack>
      );
    case "toggle":
      return (
        <Toggle pressed={pressed} onPressedChange={setPressed}>
          {pressed ? "Bold on" : "Bold off"}
        </Toggle>
      );
    case "toggle-group":
      return (
        <ToggleGroup type="single" defaultValue="day">
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      );
    case "card":
    case "glass-content-card":
    case "glass-surface":
      return (
        <Card variant="chrome">
          <CardHeader>
            <CardTitle>Native card</CardTitle>
            <CardDescription>Chrome surface on mobile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="primary" className="w-full">
              Open
            </Button>
          </CardContent>
        </Card>
      );
    case "input":
      return (
        <Stack gap={3}>
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
        </Stack>
      );
    case "textarea":
      return <Textarea placeholder="Ship glass UI on mobile…" rows={5} />;
    case "select":
      return (
        <Select defaultValue="react">
          <SelectTrigger aria-label="Framework">
            <SelectValue placeholder="Framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React Native</SelectItem>
            <SelectItem value="expo">Expo</SelectItem>
            <SelectItem value="web">Web</SelectItem>
          </SelectContent>
        </Select>
      );
    case "switch":
      return (
        <Cluster gap={3} align="center">
          <Switch checked={on} onCheckedChange={setOn} />
          <span className="text-sm text-muted-foreground">
            {on ? "On" : "Off"}
          </span>
        </Cluster>
      );
    case "checkbox":
      return (
        <Cluster gap={3} align="center">
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          <span className="text-sm">Remember me</span>
        </Cluster>
      );
    case "radio-group":
      return (
        <RadioGroup value={radio} onValueChange={setRadio}>
          <Cluster gap={2} align="center">
            <RadioGroupItem value="a" id="rn-a" />
            <label htmlFor="rn-a" className="text-sm">
              Wi‑Fi
            </label>
          </Cluster>
          <Cluster gap={2} align="center">
            <RadioGroupItem value="b" id="rn-b" />
            <label htmlFor="rn-b" className="text-sm">
              Cellular
            </label>
          </Cluster>
        </RadioGroup>
      );
    case "slider":
      return (
        <Stack gap={2}>
          <Slider value={slider} onValueChange={setSlider} max={100} />
          <p className="text-xs text-muted-foreground">{slider[0]}%</p>
        </Stack>
      );
    case "calendar":
      return (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="mx-auto"
        />
      );
    case "badge":
      return (
        <Cluster gap={2}>
          <Badge>Default</Badge>
          <Badge variant="secondary">iOS</Badge>
          <Badge variant="outline">Android</Badge>
        </Cluster>
      );
    case "alert":
      return (
        <Alert>
          <AlertTitle>Synced</AlertTitle>
          <AlertDescription>Changes are on this device.</AlertDescription>
        </Alert>
      );
    case "progress":
      return <Progress value={42} />;
    case "spinner":
      return (
        <Cluster className="justify-center py-8">
          <Spinner />
        </Cluster>
      );
    case "skeleton":
      return (
        <Stack gap={3}>
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </Stack>
      );
    case "separator":
      return (
        <Stack gap={3}>
          <p className="text-sm">Account</p>
          <Separator />
          <p className="text-sm">Security</p>
        </Stack>
      );
    case "tabs":
      return (
        <Tabs defaultValue="day">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
          </TabsList>
          <TabsContent value="day" className="pt-3 text-sm text-muted-foreground">
            Today’s schedule
          </TabsContent>
          <TabsContent value="week" className="pt-3 text-sm text-muted-foreground">
            This week
          </TabsContent>
        </Tabs>
      );
    case "accordion":
    case "collapsible":
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>What is native Intelli UI?</AccordionTrigger>
            <AccordionContent>
              React Native components that mirror the web Liquid Glass APIs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    case "dialog":
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary" className="w-full">
              Open dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save changes?</DialogTitle>
              <DialogDescription>
                This matches the native Dialog API.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="primary">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    case "sheet":
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              Open sheet
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Edge panel like native Sheet.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
    case "popover":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              Open popover
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <p className="text-sm">Anchored choices on mobile.</p>
          </PopoverContent>
        </Popover>
      );
    case "tooltip":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                Long-press hint
              </Button>
            </TooltipTrigger>
            <TooltipContent>Native tooltip copy</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "sidebar":
      return (
        <Stack
          gap={2}
          className="rounded-xl border border-[var(--glass-chrome-border)] p-3"
        >
          <p className="text-xs font-semibold text-muted-foreground">Menu</p>
          <Button variant="ghost" className="justify-start">
            Home
          </Button>
          <Button variant="ghost" className="justify-start">
            Library
          </Button>
          <Button variant="primary" className="justify-start">
            Settings
          </Button>
        </Stack>
      );
    case "pagination":
      return (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
    case "scroll-to-top":
      return (
        <Stack gap={3} className="items-center py-6">
          <p className="text-sm text-muted-foreground">End of a long list</p>
          <Button variant="outline" size="icon" shape="pill" aria-label="Scroll to top">
            ↑
          </Button>
        </Stack>
      );
    case "table":
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>App</TableHead>
              <TableHead>OS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Intelli</TableCell>
              <TableCell>iOS</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Intelli</TableCell>
              <TableCell>Android</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    case "empty":
      return (
        <Stack gap={2} className="py-8 text-center">
          <p className="text-sm font-medium">No items yet</p>
          <p className="text-xs text-muted-foreground">
            Pull to refresh or create the first row.
          </p>
          <Button variant="primary" size="sm">
            Create
          </Button>
        </Stack>
      );
    case "carousel":
      return (
        <Carousel className="w-full">
          <CarouselContent>
            {["One", "Two", "Three"].map((label) => (
              <CarouselItem key={label}>
                <Card variant="chrome">
                  <CardContent className="flex h-28 items-center justify-center p-4">
                    {label}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );
    case "scroll-area":
      return (
        <ScrollArea className="h-48 rounded-xl border border-[var(--glass-chrome-border)] p-3">
          <Stack gap={2}>
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                Row {i + 1}
              </p>
            ))}
          </Stack>
        </ScrollArea>
      );
    case "glass-bar":
    case "glass-icon-button":
      return (
        <Cluster
          gap={2}
          className="justify-center rounded-full border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_64%, var(--glass-mix-into))] px-3 py-2 backdrop-blur-[var(--glass-blur)]"
        >
          <Button variant="ghost" size="icon" shape="pill" aria-label="Play">
            ▶
          </Button>
          <Button variant="ghost" size="icon" shape="pill" aria-label="Skip">
            ⏭
          </Button>
        </Cluster>
      );
    case "typography":
    case "markdown-viewer":
      return (
        <Stack gap={2}>
          <h2 className="text-lg font-semibold">Liquid Glass</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Native typography uses the same hierarchy as the web kit.
          </p>
        </Stack>
      );
    case "link":
      return (
        <Stack gap={3}>
          <p className="text-[15px] font-semibold tracking-tight">Resources</p>
          <a
            href="https://ui.intellihelper.in"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Intelli UI
          </a>
          <a
            href="https://ui.intellihelper.in/native"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Native catalog
          </a>
        </Stack>
      );
    case "label":
      return (
        <Stack gap={2}>
          <p className="text-sm font-medium">Email</p>
          <Input placeholder="you@studio.com" />
        </Stack>
      );
    case "password-input":
      return <Input placeholder="Password" type="password" />;
    case "search-input":
      return <Input placeholder="Search" />;
    case "otp-input":
    case "pin-input":
      return (
        <Cluster gap={2}>
          {["1", "2", "3", "4"].map((d) => (
            <Input key={d} className="w-11 text-center" defaultValue={d} />
          ))}
        </Cluster>
      );
    case "number-input":
    case "currency-input":
      return <Input inputMode="decimal" defaultValue="24" />;
    case "phone-input":
      return <Input placeholder="+1 555 0100" />;
    case "avatar":
      return (
        <Cluster gap={3} align="center">
          <div className="flex size-10 items-center justify-center rounded-full border border-[var(--glass-chrome-border)] text-xs font-medium">
            IH
          </div>
          <span className="text-sm">Intelli Helper</span>
        </Cluster>
      );
    case "kbd":
      return (
        <Cluster gap={2}>
          <Badge variant="outline" size="sm">
            ⌘
          </Badge>
          <Badge variant="outline" size="sm">
            K
          </Badge>
        </Cluster>
      );
    case "breadcrumb":
      return (
        <p className="text-sm text-muted-foreground">
          Native <span className="text-foreground"> / </span> {title}
        </p>
      );
    case "alert-dialog":
    case "drawer":
    case "dropdown-menu":
    case "context-menu":
    case "hover-card":
    case "command":
    case "floating-widget":
      return (
        <Button variant="primary" className="w-full">
          Open {title}
        </Button>
      );
    case "toast":
    case "banner":
    case "callout":
    case "offline-banner":
      return (
        <Alert>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>You’re looking at the native {title}.</AlertDescription>
        </Alert>
      );
    case "loading-screen":
      return (
        <Stack gap={3} className="items-center py-10">
          <Spinner />
          <p className="text-sm text-muted-foreground">Loading</p>
        </Stack>
      );
    case "retry-view":
      return (
        <Stack gap={3} className="items-center py-8">
          <p className="text-sm font-medium">Couldn’t load</p>
          <Button variant="primary" size="sm">
            Try again
          </Button>
        </Stack>
      );
    case "rating":
      return <p className="text-xl tracking-widest text-primary">★★★★☆</p>;
    case "stepper":
      return (
        <Cluster gap={2}>
          <Badge>1 Account</Badge>
          <Badge variant="outline">2 Confirm</Badge>
        </Cluster>
      );
    case "combobox":
    case "multi-select":
    case "native-select":
    case "font-picker":
    case "ai-model-selector":
      return (
        <Select defaultValue="a">
          <SelectTrigger>
            <SelectValue placeholder={title} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">{title}</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      );
    case "color-picker":
      return (
        <Cluster gap={2}>
          {["#111", "#6366f1", "#0ea5e9", "#22c55e"].map((c) => (
            <span
              key={c}
              className="size-7 rounded-full border border-[var(--glass-chrome-border)]"
              style={{ background: c }}
            />
          ))}
        </Cluster>
      );
    case "time-picker":
      return <Input defaultValue="09:41" />;
    case "month-picker":
    case "date-time-picker":
    case "event-calendar":
      return (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="mx-auto"
        />
      );
    case "bottom-navigation":
    case "dock":
    case "navigation-menu":
      return (
        <Cluster
          gap={1}
          className="justify-between rounded-full border border-[var(--glass-chrome-border)] px-2 py-2"
        >
          {["Home", "Search", "You"].map((l) => (
            <Button key={l} variant={l === "Home" ? "primary" : "ghost"} size="sm">
              {l}
            </Button>
          ))}
        </Cluster>
      );
    case "timeline":
    case "activity-feed":
    case "notification-center":
      return (
        <Stack gap={3}>
          <p className="text-sm font-medium">Shipped native catalog</p>
          <p className="text-xs text-muted-foreground">Just now</p>
          <Separator />
          <p className="text-sm font-medium">Preview updated</p>
          <p className="text-xs text-muted-foreground">2h ago</p>
        </Stack>
      );
    case "kanban":
    case "data-grid":
    case "virtual-table":
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{title}</TableCell>
              <TableCell>Ready</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    case "metric-card":
    case "line-chart":
    case "area-chart":
    case "sparkline":
    case "donut-chart":
    case "bar-chart":
    case "pie-chart":
    case "stacked-bar-chart":
    case "radar-chart":
    case "funnel-chart":
    case "heatmap":
    case "tree-map":
    case "sankey":
    case "gauge":
    case "chart-period":
    case "chart-frame":
      return (
        <Stack gap={3}>
          <p className="text-[15px] font-semibold">{title}</p>
          <Progress value={64} />
          <p className="text-xs text-muted-foreground">64%</p>
        </Stack>
      );
    case "ai-chat":
    case "prompt-input":
    case "prompt-suggestions":
      return (
        <Stack gap={3}>
          <div className="self-end rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">
            Hello
          </div>
          <div className="self-start rounded-2xl border border-[var(--glass-chrome-border)] px-3 py-2 text-sm">
            Native chat preview
          </div>
          <Input placeholder="Ask anything…" />
        </Stack>
      );
    case "streaming-text":
    case "typing-indicator":
    case "thinking-animation":
    case "reasoning-block":
      return (
        <Stack gap={2}>
          <Cluster gap={2} align="center">
            <Spinner />
            <span className="text-sm text-muted-foreground">{title}</span>
          </Cluster>
          <p className="text-sm">Liquid Glass on native…</p>
        </Stack>
      );
    case "citation-card":
    case "agent-card":
    case "tool-call-viewer":
    case "mcp-server-card":
    case "conversation-sidebar":
      return (
        <Card variant="chrome">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Connected</CardDescription>
          </CardHeader>
        </Card>
      );
    case "code-viewer":
    case "json-viewer":
    case "terminal-block":
    case "markdown-editor":
    case "component-preview":
      return (
        <pre className="overflow-x-auto rounded-xl bg-black/80 p-3 font-mono text-[11px] text-white">
          {`pnpm add @intelli/ui-native`}
        </pre>
      );
    case "image-preview":
    case "image-editor":
    case "aspect-ratio":
    case "background-picture-picker":
      return (
        <div className="aspect-video rounded-2xl bg-[color-mix(in_oklch,var(--primary)_25%,var(--glass-surface-fill))]" />
      );
    case "media-player":
      return (
        <Stack gap={3}>
          <p className="text-sm font-medium">Track</p>
          <Progress value={35} />
          <Button variant="primary">Play</Button>
        </Stack>
      );
    case "file-upload":
      return (
        <Button variant="outline" className="w-full">
          Choose file
        </Button>
      );
    case "layout":
    case "resizable":
      return (
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 rounded-xl border border-[var(--glass-chrome-border)]" />
          <div className="h-16 rounded-xl border border-[var(--glass-chrome-border)]" />
        </div>
      );
    case "address-fields":
    case "address-country-select":
    case "address-region-select":
    case "address-city-select":
      return (
        <Stack gap={2}>
          <Input placeholder="Country" defaultValue="United States" />
          <Input placeholder="City" defaultValue="San Francisco" />
        </Stack>
      );
    default:
      return <CategoryDemo slug={slug} title={title} category={category} />;
  }
}
