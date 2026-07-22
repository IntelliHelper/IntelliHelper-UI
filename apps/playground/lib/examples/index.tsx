"use client";

import { Button, ComponentPreview, Kbd } from "@intelli/ui";
import { AccordionDemo, SliderDemo } from "../../components/accordion-slider-demo";
import { BackgroundPictureDemo } from "../../components/background-picture-demo";
import { ButtonGlassDemo } from "../../components/button-glass-demo";
import {
  CalendarDropdownDemo,
  CalendarRangeDemo,
  CalendarSingleDemo,
  CalendarSizesDemo,
} from "../../components/calendar-demo";
import {
  EventCalendarCompactDemo,
  EventCalendarDemo,
  EventCalendarOutlineDemo,
} from "../../components/event-calendar-demo";
import {
  FloatingWidgetChromeDemo,
  FloatingWidgetDemo,
} from "../../components/floating-widget-demo";
import {
  ToastActionDemo,
  ToastDemo,
  ToastPositionDemo,
  ToastStaticDemo,
} from "../../components/toast-demo";
import {
  AlertDialogDemo,
  AvatarDemo,
  BreadcrumbDemo,
  ContextMenuDemo,
  DropdownMenuDemo,
  LinkDemo,
} from "../../components/app-shell-demo";
import {
  ComboboxDemo,
  CommandDemo,
  CopyButtonDemo,
  FileUploadDemo,
  NavigationMenuDemo,
  StepperDemo,
  ThemeToggleDemo,
} from "../../components/roadmap-seven-demo";
import {
  AgentCardDemo,
  AIChatDemo,
  AIModelSelectorDemo,
  AspectRatioDemo,
  CitationCardDemo,
  CodeViewerDemo,
  ConversationSidebarDemo,
  JsonViewerDemo,
  McpServerCardDemo,
  MultiSelectDemo,
  NotificationCenterDemo,
  PromptInputDemo,
  PromptSuggestionsDemo,
  ReasoningBlockDemo,
  StreamingTextDemo,
  TerminalBlockDemo,
  ThinkingAnimationDemo,
  TokenCounterDemo,
  ToolCallViewerDemo,
  TypingIndicatorDemo,
} from "../../components/tier12-demo";
import { CarouselDemo } from "../../components/carousel-demo";
import {
  LoginCardPreview,
  loginCardCode,
} from "../../components/component-preview-demo";
import {
  AlertDemo,
  CardDemo,
  EmptyDemo,
  PaginationDemo,
  SkeletonDemo,
  TableDemo,
  TabsDemo,
} from "../../components/data-components-demo";
import { DialogDemo } from "../../components/dialog-demo";
import { FileTreeDemo } from "../../components/file-tree-demo";
import { InputDemo, TextareaDemo } from "../../components/form-components-demo";
import {
  NativeSelectDemo,
  ProgressDemo,
  RadioGroupDemo,
  ResizableDemo,
  ScrollAreaDemo,
  ScrollToTopDemo,
  SeparatorDemo,
  SpinnerDemo,
  TypographyDemo,
} from "../../components/layout-utility-demo";
import {
  GlassBarDemo,
  GlassContentCardDemo,
  GlassIconButtonDemo,
} from "../../components/liquid-glass-demo";
import {
  MarkdownEditorDemo,
  MarkdownViewerOnlyDemo,
} from "../../components/markdown-viewer-demo";
import { SelectDemo, SidebarDemo } from "../../components/select-sidebar-demo";
import { HoverCardDemo, SheetDemo } from "../../components/sheet-hover-card-demo";
import { BadgeDemo, CheckboxDemo, SwitchDemo } from "../../components/toggle-components-demo";
import {
  PopoverDemo,
  ToggleDemo,
  ToggleGroupDemo,
  TooltipDemo,
} from "../../components/toggle-popover-demo";
import type { ComponentExample } from "./types";

const variants = [
  "default",
  "glass",
  "primary",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

const sizes = ["sm", "default", "lg"] as const;
const shapes = ["rounded", "pill", "rectangular"] as const;

function ButtonVariantsPreview() {
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Button>
      ))}
    </div>
  );
}

function ButtonSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) => (
        <Button key={size} size={size}>
          {size === "default" ? "Default" : size.toUpperCase()}
        </Button>
      ))}
      <Button size="icon" variant="outline" aria-label="Add">
        +
      </Button>
    </div>
  );
}

function ButtonShapesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {shapes.map((shape) => (
        <Button key={shape} shape={shape}>
          {shape.charAt(0).toUpperCase() + shape.slice(1)}
        </Button>
      ))}
    </div>
  );
}

const EXAMPLES: Record<string, ComponentExample[]> = {
  "background-picture-picker": [
    {
      title: "Background picker",
      description: "Preset gradients, custom upload, or reset to default mesh.",
      preview: <BackgroundPictureDemo />,
      code: `import { BackgroundPicturePicker } from "@/components/ui/background-picture-picker"

export function BackgroundSettings() {
  return (
    <BackgroundPicturePicker
      onValueChange={(value) => console.log(value)}
    />
  )
}`,
    },
  ],
  "glass-content-card": [
    {
      title: "Music player layout",
      description: "Content panels with floating glass bar controls.",
      preview: <GlassContentCardDemo />,
      code: `import {
  GlassBar,
  GlassBarControls,
  GlassBarInfo,
  GlassBarMedia,
  GlassContentCard,
  GlassContentPanel,
  GlassIconButton,
} from "@/components/ui/glass-content-card"

export function PlayerCard() {
  return (
    <GlassContentCard className="h-56">
      <GlassContentPanel gradient="linear-gradient(160deg, #6b5cff, #3b82f6)">
        <p className="mt-auto text-2xl font-bold content-text">Friends Mix</p>
      </GlassContentPanel>
      <div className="absolute inset-x-4 bottom-4">
        <GlassBar>
          <GlassBarMedia />
          <GlassBarInfo title="All Of Me" subtitle="Nao" />
          <GlassBarControls>
            <GlassIconButton aria-label="Play">▶</GlassIconButton>
          </GlassBarControls>
        </GlassBar>
      </div>
    </GlassContentCard>
  )
}`,
    },
  ],
  "glass-bar": [
    {
      title: "Media controls bar",
      preview: <GlassBarDemo />,
      code: `import {
  GlassBar,
  GlassBarControls,
  GlassBarInfo,
  GlassBarMedia,
  GlassIconButton,
} from "@/components/ui/glass-bar"

export function MediaBar() {
  return (
    <GlassBar>
      <GlassBarMedia className="bg-gradient-to-br from-neutral-700 to-neutral-900" />
      <GlassBarInfo title="All Of Me" subtitle="Nao" />
      <GlassBarControls>
        <GlassIconButton aria-label="Play">▶</GlassIconButton>
        <GlassIconButton aria-label="Next">⏭</GlassIconButton>
      </GlassBarControls>
    </GlassBar>
  )
}`,
    },
  ],
  "glass-icon-button": [
    {
      title: "Icon button sizes",
      preview: <GlassIconButtonDemo />,
      code: `import { GlassIconButton } from "@/components/ui/glass-icon-button"

export function IconButtons() {
  return (
    <div className="flex items-center gap-2">
      <GlassIconButton size="sm" aria-label="Search">⌕</GlassIconButton>
      <GlassIconButton aria-label="Search">⌕</GlassIconButton>
      <GlassIconButton size="lg" aria-label="Search">⌕</GlassIconButton>
    </div>
  )
}`,
    },
  ],
  "component-preview": [
    {
      title: "Login card preview",
      description: "Wrap any UI with collapsible, copy-ready source.",
      preview: (
        <ComponentPreview code={loginCardCode} defaultShowCode={false}>
          <LoginCardPreview />
        </ComponentPreview>
      ),
      code: loginCardCode,
    },
  ],
  button: [
    {
      title: "On expressive content",
      description: "Glass variants over saturated backgrounds.",
      preview: <ButtonGlassDemo />,
      code: `import { Button } from "@/components/ui/button"

export function GlassButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Default</Button>
      <Button variant="glass">Glass</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
}`,
    },
    {
      title: "Variants",
      preview: <ButtonVariantsPreview />,
      code: `import { Button } from "@/components/ui/button"

<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`,
    },
    {
      title: "Sizes & shapes",
      preview: (
        <div className="space-y-4">
          <ButtonSizesPreview />
          <ButtonShapesPreview />
        </div>
      ),
      code: `import { Button } from "@/components/ui/button"

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Add">+</Button>

<Button shape="rounded">Rounded</Button>
<Button shape="pill">Pill</Button>
<Button shape="rectangular">Rectangular</Button>`,
    },
  ],
  toggle: [
    {
      title: "Pressable toggles",
      preview: <ToggleDemo />,
      code: `import { Toggle } from "@/components/ui/toggle"

<Toggle aria-label="Bold">B</Toggle>
<Toggle variant="outline" aria-label="Italic">I</Toggle>
<Toggle variant="ghost" aria-label="Underline">U</Toggle>`,
    },
  ],
  "toggle-group": [
    {
      title: "Toggle group",
      preview: <ToggleGroupDemo />,
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

<ToggleGroup type="single" defaultValue="left">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>`,
    },
  ],
  card: [
    {
      title: "Chrome & content cards",
      preview: <CardDemo />,
      code: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui/card"

export function ProjectCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chrome Card</CardTitle>
        <CardDescription>Neutral frosted glass panel.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Readable in light and dark.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  )
}`,
    },
  ],
  tabs: [
    {
      title: "Capsule tabs",
      preview: <TabsDemo />,
      code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview panel</TabsContent>
  <TabsContent value="analytics">Analytics panel</TabsContent>
</Tabs>`,
    },
  ],
  separator: [
    {
      title: "Dividers",
      preview: <SeparatorDemo />,
      code: `import { Separator } from "@/components/ui/separator"

<Separator variant="chrome" />
<Separator orientation="vertical" className="h-6" />`,
    },
  ],
  resizable: [
    {
      title: "Panel groups",
      preview: <ResizableDemo />,
      code: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

<ResizablePanelGroup variant="chrome" className="min-h-48">
  <ResizablePanel defaultSize={35}>Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={65}>Main</ResizablePanel>
</ResizablePanelGroup>`,
    },
  ],
  "scroll-area": [
    {
      title: "Overflow content",
      preview: <ScrollAreaDemo />,
      code: `import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea variant="chrome" className="h-40 p-4">
  <div className="space-y-2">
    {items.map((item) => (
      <p key={item} className="text-sm">{item}</p>
    ))}
  </div>
</ScrollArea>`,
    },
  ],
  input: [
    {
      title: "Text fields",
      preview: <InputDemo />,
      code: `import { Input } from "@/components/ui/input"

<Input placeholder="Enter your name" />
<Input variant="outline" type="email" placeholder="you@example.com" />
<Input size="sm" placeholder="Small" />`,
    },
  ],
  textarea: [
    {
      title: "Multiline input",
      preview: <TextareaDemo />,
      code: `import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Write a message..." />
<Textarea variant="outline" placeholder="Add a description..." />`,
    },
  ],
  select: [
    {
      title: "Frosted dropdown",
      preview: <SelectDemo />,
      code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select defaultValue="chrome">
  <SelectTrigger>
    <SelectValue placeholder="Pick a variant" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="chrome">Chrome</SelectItem>
    <SelectItem value="outline">Outline</SelectItem>
  </SelectContent>
</Select>`,
    },
  ],
  "native-select": [
    {
      title: "Native select",
      preview: <NativeSelectDemo />,
      code: `import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

<NativeSelect defaultValue="chrome">
  <NativeSelectOption value="chrome">Chrome</NativeSelectOption>
  <NativeSelectOption value="outline">Outline</NativeSelectOption>
</NativeSelect>`,
    },
  ],
  checkbox: [
    {
      title: "Checkboxes",
      preview: <CheckboxDemo />,
      code: `import { Checkbox } from "@/components/ui/checkbox"

<Checkbox id="terms" />
<Checkbox variant="outline" checked="indeterminate" />`,
    },
  ],
  switch: [
    {
      title: "Toggle switches",
      preview: <SwitchDemo />,
      code: `import { Switch } from "@/components/ui/switch"

<Switch defaultChecked aria-label="Notifications" />
<Switch variant="outline" size="lg" aria-label="Dark mode" />`,
    },
  ],
  "radio-group": [
    {
      title: "Plan selection",
      preview: <RadioGroupDemo />,
      code: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

<RadioGroup defaultValue="starter">
  <RadioGroupItem value="starter" id="starter" />
  <RadioGroupItem value="pro" id="pro" />
</RadioGroup>`,
    },
  ],
  calendar: [
    {
      title: "Single date",
      description:
        "One Calendar import — switch modes and variants with props.",
      preview: <CalendarSingleDemo />,
      code: `import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

const [date, setDate] = useState<Date | undefined>(new Date())

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  variant="chrome"
/>`,
    },
    {
      title: "Date range",
      description: "Range selection with start, middle, and end highlighting.",
      preview: <CalendarRangeDemo />,
      code: `import { useState } from "react"
import { Calendar, type DateRange } from "@/components/ui/calendar"

const [range, setRange] = useState<DateRange | undefined>()

<Calendar
  mode="range"
  selected={range}
  onSelect={setRange}
  variant="elevated"
/>`,
    },
    {
      title: "Dropdown caption",
      description: "Month and year dropdowns with the outline variant.",
      preview: <CalendarDropdownDemo />,
      code: `import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

const [date, setDate] = useState<Date | undefined>(new Date())

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  captionLayout="dropdown"
  startMonth={new Date(2024, 0)}
  endMonth={new Date(2028, 11)}
  variant="outline"
/>`,
    },
    {
      title: "Sizes",
      description: "Compact, default, and large footprints via the size prop.",
      preview: <CalendarSizesDemo />,
      code: `import { Calendar } from "@/components/ui/calendar"

<Calendar mode="single" size="sm" />
<Calendar mode="single" />
<Calendar mode="single" size="lg" />`,
    },
  ],
  "event-calendar": [
    {
      title: "Month + agenda",
      description:
        "Full event calendar with color chips, day selection, and agenda sidebar.",
      preview: <EventCalendarDemo />,
      code: `import { useState } from "react"
import {
  EventCalendar,
  type CalendarEvent,
} from "@/components/ui/event-calendar"

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Sprint planning",
    start: new Date(2026, 6, 6, 9, 30),
    end: new Date(2026, 6, 6, 11, 0),
    color: "info",
    location: "Main room",
  },
  {
    id: "2",
    title: "Launch week",
    start: new Date(2026, 6, 13),
    end: new Date(2026, 6, 15),
    allDay: true,
    color: "primary",
  },
]

const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

<EventCalendar
  events={events}
  selectedDate={selectedDate}
  onSelectedDateChange={setSelectedDate}
  onEventClick={(event) => console.log(event)}
  variant="chrome"
  showAgenda
/>`,
    },
    {
      title: "Compact grid",
      description:
        "Small elevated month grid without agenda — Monday week start.",
      preview: <EventCalendarCompactDemo />,
      code: `import { EventCalendar } from "@/components/ui/event-calendar"

<EventCalendar
  events={events}
  size="sm"
  variant="elevated"
  maxEventsPerDay={2}
  showAgenda={false}
  weekStartsOn={1}
/>`,
    },
    {
      title: "Outline product calendar",
      description: "Outline surface with a custom header title and agenda.",
      preview: <EventCalendarOutlineDemo />,
      code: `import { EventCalendar } from "@/components/ui/event-calendar"

<EventCalendar
  events={events}
  variant="outline"
  title="Product calendar"
  defaultSelectedDate={new Date()}
/>`,
    },
  ],
  dialog: [
    {
      title: "Modal dialogs",
      preview: <DialogDemo />,
      code: `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes here.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    },
  ],
  sheet: [
    {
      title: "Edge panels",
      preview: <SheetDemo />,
      code: `import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Adjust your preferences.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
    },
  ],
  popover: [
    {
      title: "Contextual panel",
      preview: <PopoverDemo />,
      code: `import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@/components/ui/popover"

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent>Place content here.</PopoverContent>
</Popover>`,
    },
  ],
  "hover-card": [
    {
      title: "Hover preview",
      preview: <HoverCardDemo />,
      code: `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

<HoverCard>
  <HoverCardTrigger>@intellihelper</HoverCardTrigger>
  <HoverCardContent>Profile preview content</HoverCardContent>
</HoverCard>`,
    },
  ],
  tooltip: [
    {
      title: "Contextual hints",
      preview: <TooltipDemo />,
      code: `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
} from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>Add to library</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    },
  ],
  sidebar: [
    {
      title: "Collapsible sidebar",
      preview: <SidebarDemo />,
      code: `import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Dashboard</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>`,
    },
  ],
  pagination: [
    {
      title: "Page navigation",
      preview: <PaginationDemo />,
      code: `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious /></PaginationItem>
    <PaginationItem><PaginationLink isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext /></PaginationItem>
  </PaginationContent>
</Pagination>`,
    },
  ],
  "scroll-to-top": [
    {
      title: "Scroll helper",
      preview: <ScrollToTopDemo />,
      code: `import { ScrollToTop } from "@/components/ui/scroll-to-top"

<ScrollToTop threshold={200} position="bottom-right" />`,
    },
  ],
  "floating-widget": [
    {
      title: "Feedback bubble",
      description:
        "Corner chat-style bubble with a compact panel for custom feedback logic.",
      preview: <FloatingWidgetDemo />,
      code: `import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  FloatingWidget,
  FloatingWidgetBody,
  FloatingWidgetClose,
  FloatingWidgetContent,
  FloatingWidgetDescription,
  FloatingWidgetFooter,
  FloatingWidgetHeader,
  FloatingWidgetTitle,
  FloatingWidgetTrigger,
} from "@/components/ui/floating-widget"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function FeedbackWidget() {
  const [message, setMessage] = useState("")

  return (
    <FloatingWidget position="bottom-right">
      <FloatingWidgetTrigger label="Open feedback" badge={1} />
      <FloatingWidgetContent>
        <FloatingWidgetHeader>
          <FloatingWidgetTitle>Send feedback</FloatingWidgetTitle>
          <FloatingWidgetDescription>
            Tell us what is working and what we should improve.
          </FloatingWidgetDescription>
        </FloatingWidgetHeader>
        <FloatingWidgetBody className="space-y-3">
          <Input type="email" placeholder="you@company.com" />
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What should we know?"
          />
        </FloatingWidgetBody>
        <FloatingWidgetFooter>
          <FloatingWidgetClose asChild>
            <Button variant="ghost" size="sm">Cancel</Button>
          </FloatingWidgetClose>
          <Button size="sm" onClick={() => { /* your submit logic */ }}>
            Send feedback
          </Button>
        </FloatingWidgetFooter>
      </FloatingWidgetContent>
    </FloatingWidget>
  )
}`,
    },
    {
      title: "Help menu",
      description: "Chrome trigger with an elevated action panel.",
      preview: <FloatingWidgetChromeDemo />,
      code: `import { Button } from "@/components/ui/button"
import {
  FloatingWidget,
  FloatingWidgetBody,
  FloatingWidgetContent,
  FloatingWidgetDescription,
  FloatingWidgetHeader,
  FloatingWidgetTitle,
  FloatingWidgetTrigger,
} from "@/components/ui/floating-widget"

<FloatingWidget position="bottom-left">
  <FloatingWidgetTrigger variant="chrome" label="Open help" />
  <FloatingWidgetContent variant="elevated" size="sm">
    <FloatingWidgetHeader>
      <FloatingWidgetTitle>Need help?</FloatingWidgetTitle>
      <FloatingWidgetDescription>
        Quick links for support and docs.
      </FloatingWidgetDescription>
    </FloatingWidgetHeader>
    <FloatingWidgetBody className="space-y-2">
      <Button variant="outline" size="sm" className="w-full justify-start">
        Browse docs
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start">
        Contact support
      </Button>
    </FloatingWidgetBody>
  </FloatingWidgetContent>
</FloatingWidget>`,
    },
  ],
  table: [
    {
      title: "Data table",
      preview: <TableDemo />,
      code: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV-001</TableCell>
      <TableCell>Paid</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
    },
  ],
  empty: [
    {
      title: "Zero results",
      preview: <EmptyDemo />,
      code: `import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Button,
} from "@/components/ui/empty"

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">📭</EmptyMedia>
    <EmptyTitle>No results</EmptyTitle>
    <EmptyDescription>Try adjusting your filters.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button size="sm">Create new</Button>
  </EmptyContent>
</Empty>`,
    },
  ],
  skeleton: [
    {
      title: "Loading placeholders",
      preview: <SkeletonDemo />,
      code: `import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="h-4 w-32" />
<Skeleton variant="chrome" className="h-8 w-full" />`,
    },
  ],
  alert: [
    {
      title: "Status alerts",
      preview: <AlertDemo />,
      code: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert>
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>Something needs your attention.</AlertDescription>
</Alert>
<Alert variant="destructive">...</Alert>
<Alert variant="success">...</Alert>`,
    },
  ],
  toast: [
    {
      title: "Imperative toasts",
      description: "Mount Toaster once, then call toast() from anywhere.",
      preview: <ToastDemo />,
      code: `import { Button } from "@/components/ui/button"
import { Toaster, toast } from "@/components/ui/toast"

// Mount once near the app root (or a local container with scope="container")
export function App() {
  return (
    <>
      <Button
        onClick={() =>
          toast.success("Saved", {
            description: "Your workspace settings were updated.",
          })
        }
      >
        Show toast
      </Button>
      <Toaster position="bottom-right" />
    </>
  )
}

// Variants
toast("Default")
toast.success("Saved")
toast.error("Something went wrong")
toast.warning("Almost full")
toast.info("New feature")
toast.message("Chrome notice")
toast.loading("Uploading…")
toast.dismiss()`,
    },
    {
      title: "Actions & promises",
      description: "Undo actions, loading → success updates, and toast.promise.",
      preview: <ToastActionDemo />,
      code: `import { toast } from "@/components/ui/toast"

toast("File deleted", {
  description: "invoice-april.pdf was moved to trash.",
  action: {
    label: "Undo",
    onClick: () => toast.success("Restored"),
  },
})

const id = toast.loading("Uploading…")
// later:
toast.success("Upload complete", { id })

await toast.promise(syncContacts(), {
  loading: "Syncing contacts…",
  success: (data) => ({
    title: "Sync complete",
    description: \`\${data.rows} contacts updated.\`,
  }),
  error: "Sync failed",
})`,
    },
    {
      title: "Positions",
      description: "Six viewport anchors — top/bottom × left/center/right.",
      preview: <ToastPositionDemo />,
      code: `import { Toaster, toast } from "@/components/ui/toast"

<Toaster position="top-right" />
toast("Pinned to the top-right")`,
    },
    {
      title: "Static surfaces",
      description: "Compose Toast primitives without the imperative store.",
      preview: <ToastStaticDemo />,
      code: `import {
  Toast,
  ToastDescription,
  ToastIcon,
  ToastTitle,
} from "@/components/ui/toast"

<Toast variant="success">
  <ToastIcon>{/* icon */}</ToastIcon>
  <div className="grid gap-1">
    <ToastTitle>Invoice sent</ToastTitle>
    <ToastDescription>
      INV-004 was delivered to the customer inbox.
    </ToastDescription>
  </div>
</Toast>`,
    },
  ],
  avatar: [
    {
      title: "Avatar & group",
      preview: <AvatarDemo />,
      code: `import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/me.jpg" alt="Ava" />
  <AvatarFallback>AV</AvatarFallback>
</Avatar>

<AvatarGroup max={3}>
  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>D</AvatarFallback></Avatar>
</AvatarGroup>`,
    },
  ],
  "dropdown-menu": [
    {
      title: "Workspace menu",
      preview: <DropdownMenuDemo />,
      code: `import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Workspace</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem destructive>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    },
  ],
  "alert-dialog": [
    {
      title: "Destructive confirm",
      preview: <AlertDialogDemo />,
      code: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete project</Button>
  </AlertDialogTrigger>
  <AlertDialogContent variant="destructive">
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    },
  ],
  breadcrumb: [
    {
      title: "Path navigation",
      preview: <BreadcrumbDemo />,
      code: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
    },
  ],
  link: [
    {
      title: "Variants, sizes & external",
      preview: <LinkDemo />,
      code: `import { Button, Link } from "@intelli/ui"

// Variants
<Link href="/docs">Default</Link>
<Link href="/docs" variant="muted">Muted</Link>
<Link href="/docs" variant="chrome">Chrome</Link>
<Link href="/docs" variant="underline">Underline</Link>

// Sizes
<Link href="/docs" size="sm">Small</Link>
<Link href="/docs" size="lg">Large</Link>

// External (new tab + noopener + icon)
<Link href="https://github.com/IntelliHelper/IntelliHelper-UI" external>
  GitHub
</Link>

// Look like a button, behave like a link
<Button asChild variant="outline" size="sm">
  <Link href="/getting-started">Get started</Link>
</Button>

// Next.js App Router (client navigation)
import NextLink from "next/link"
<Link asChild>
  <NextLink href="/components">Browse catalog</NextLink>
</Link>`,
    },
  ],
  "context-menu": [
    {
      title: "Right-click surface",
      preview: <ContextMenuDemo />,
      code: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

<ContextMenu>
  <ContextMenuTrigger className="flex h-32 items-center justify-center rounded-xl border border-dashed">
    Right-click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Open</ContextMenuItem>
    <ContextMenuItem>Rename</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem destructive>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    },
  ],
  combobox: [
    {
      title: "Searchable select",
      preview: <ComboboxDemo />,
      code: `import { Combobox } from "@/components/ui/combobox"

const options = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
]

<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select framework"
  searchPlaceholder="Filter…"
/>`,
    },
  ],
  command: [
    {
      title: "Command palette",
      preview: <CommandDemo />,
      code: `import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command"

const items = [
  { value: "new-file", label: "New file", group: "File" },
  { value: "settings", label: "Open settings", group: "File" },
]

<Command items={items}>
  <CommandInput placeholder="Type a command…" />
  <CommandList />
</Command>

<CommandDialog open={open} onOpenChange={setOpen} items={items} />`,
    },
  ],
  "file-upload": [
    {
      title: "Dropzone upload",
      preview: <FileUploadDemo />,
      code: `import { FileUpload } from "@/components/ui/file-upload"

<FileUpload
  accept={[".png", ".jpg", "image/*", ".pdf"]}
  multiple
  onValueChange={setFiles}
  label="Drop images or PDFs"
/>`,
    },
  ],
  "navigation-menu": [
    {
      title: "Header navigation",
      preview: <NavigationMenuDemo />,
      code: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/ui">UI Kit</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
    },
  ],
  stepper: [
    {
      title: "Onboarding steps",
      preview: <StepperDemo />,
      code: `import {
  Stepper,
  Step,
  StepIndicator,
  StepContent,
  StepTitle,
  StepDescription,
} from "@/components/ui/stepper"

<Stepper activeStep={1}>
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
    </StepContent>
  </Step>
</Stepper>`,
    },
  ],
  "theme-toggle": [
    {
      title: "Light / dark switch",
      preview: <ThemeToggleDemo />,
      code: `import { ThemeToggle } from "@/components/ui/theme-toggle"

// Uncontrolled — toggles documentElement dark/light classes
<ThemeToggle />

// Controlled with @intelli/themes
const { mode, setMode } = useTheme()
<ThemeToggle mode={mode} onModeChange={setMode} applyToDocument={false} />`,
    },
  ],
  "copy-button": [
    {
      title: "Copy to clipboard",
      preview: <CopyButtonDemo />,
      code: `import { CopyButton } from "@/components/ui/copy-button"

<CopyButton value="npx @intellihelper/cli@latest add button -y" />
<CopyButton value={code} label="Copy import" variant="outline" />`,
    },
  ],
  badge: [
    {
      title: "Pill badges",
      preview: <BadgeDemo />,
      code: `import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success" pulse>Live</Badge>`,
    },
  ],
  kbd: [
    {
      title: "Keyboard shortcuts",
      preview: (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search
        </p>
      ),
      code: `import { Kbd } from "@/components/ui/kbd"

<span>
  Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search
</span>`,
    },
  ],
  spinner: [
    {
      title: "Loading states",
      preview: <SpinnerDemo />,
      code: `import { Spinner } from "@/components/ui/spinner"

<Spinner />
<Spinner variant="primary" size="lg" />
<Spinner variant="chrome" size="xl" />`,
    },
  ],
  progress: [
    {
      title: "Progress bar",
      preview: <ProgressDemo />,
      code: `import { Progress } from "@/components/ui/progress"

<Progress value={62} />`,
    },
  ],
  accordion: [
    {
      title: "Expandable panels",
      preview: <AccordionDemo />,
      code: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Liquid Glass?</AccordionTrigger>
    <AccordionContent>Frosted chrome over expressive content.</AccordionContent>
  </AccordionItem>
</Accordion>`,
    },
  ],
  collapsible: [
    {
      title: "File tree",
      description: "Nested folders with compact tree layout.",
      preview: <FileTreeDemo />,
      code: `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

<Collapsible layout="tree">
  <CollapsibleTrigger>src</CollapsibleTrigger>
  <CollapsibleContent>
    <Collapsible layout="tree">
      <CollapsibleTrigger>components</CollapsibleTrigger>
      <CollapsibleContent>button.tsx</CollapsibleContent>
    </Collapsible>
  </CollapsibleContent>
</Collapsible>`,
    },
  ],
  slider: [
    {
      title: "Range controls",
      preview: <SliderDemo />,
      code: `import { Slider } from "@/components/ui/slider"

<Slider defaultValue={[65]} max={100} step={1} />
<Slider defaultValue={[25, 75]} max={100} step={5} />`,
    },
  ],
  carousel: [
    {
      title: "Slide carousel",
      preview: <CarouselDemo />,
      code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
    },
  ],
  typography: [
    {
      title: "Text primitives",
      preview: <TypographyDemo />,
      code: `import {
  TypographyH3,
  TypographyP,
  TypographyMuted,
  TypographyInlineCode,
} from "@/components/ui/typography"

<TypographyH3>The Joke Tax</TypographyH3>
<TypographyP>Once upon a time...</TypographyP>
<TypographyMuted>
  Built with <TypographyInlineCode>@intelli/ui</TypographyInlineCode>
</TypographyMuted>`,
    },
  ],
  "markdown-viewer": [
    {
      title: "Rendered markdown",
      preview: <MarkdownViewerOnlyDemo />,
      code: `import { MarkdownViewer } from "@/components/ui/markdown-viewer"

<MarkdownViewer
  content={\`# Hello\\n\\nWrite **markdown** with syntax highlighting.\`}
  variant="chrome"
  gfm
  highlight
  scrollable
  maxHeight="min(400px, 52vh)"
/>`,
    },
  ],
  "markdown-editor": [
    {
      title: "Editor with preview",
      preview: <MarkdownEditorDemo />,
      code: `import { MarkdownEditor } from "@/components/ui/markdown-editor"

<MarkdownEditor
  defaultValue="# Notes\\n\\nStart writing..."
  defaultView="split"
/>`,
    },
  ],
  "multi-select": [
    {
      title: "Multi value select",
      preview: <MultiSelectDemo />,
      code: `import { MultiSelect } from "@/components/ui/multi-select"

<MultiSelect
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select languages"
/>`,
    },
  ],
  "notification-center": [
    {
      title: "Inbox notifications",
      preview: <NotificationCenterDemo />,
      code: `import { NotificationCenter } from "@/components/ui/notification-center"

<NotificationCenter
  items={items}
  onItemsChange={setItems}
/>`,
    },
  ],
  "code-viewer": [
    {
      title: "Source viewer",
      preview: <CodeViewerDemo />,
      code: `import { CodeViewer } from "@/components/ui/code-viewer"

<CodeViewer code={source} language="ts" title="greet.ts" />`,
    },
  ],
  "terminal-block": [
    {
      title: "Terminal transcript",
      preview: <TerminalBlockDemo />,
      code: `import { TerminalBlock } from "@/components/ui/terminal-block"

<TerminalBlock lines={[
  { type: "input", content: "pnpm dev" },
  { type: "output", content: "ready" },
]} />`,
    },
  ],
  "json-viewer": [
    {
      title: "JSON pretty print",
      preview: <JsonViewerDemo />,
      code: `import { JsonViewer } from "@/components/ui/json-viewer"

<JsonViewer data={jsonString} title="payload" />`,
    },
  ],
  "aspect-ratio": [
    {
      title: "16:9 frame",
      preview: <AspectRatioDemo />,
      code: `import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio={16 / 9}>
  <img src="/hero.png" alt="" />
</AspectRatio>`,
    },
  ],
  "ai-chat": [
    {
      title: "Chat transcript",
      preview: <AIChatDemo />,
      code: `import { AIChat, UserMessage, AssistantMessage } from "@/components/ui/ai-chat"

<AIChat>
  <UserMessage>Hello</UserMessage>
  <AssistantMessage>Hi there!</AssistantMessage>
</AIChat>`,
    },
  ],
  "prompt-input": [
    {
      title: "Composer",
      preview: <PromptInputDemo />,
      code: `import { PromptInput } from "@/components/ui/prompt-input"

<PromptInput value={value} onValueChange={setValue} onSubmit={send} />`,
    },
  ],
  "streaming-text": [
    {
      title: "Progressive reveal",
      preview: <StreamingTextDemo />,
      code: `import { StreamingText } from "@/components/ui/streaming-text"

<StreamingText text={reply} isStreaming streamRate={2} />`,
    },
  ],
  "typing-indicator": [
    {
      title: "Typing dots",
      preview: <TypingIndicatorDemo />,
      code: `import { TypingIndicator } from "@/components/ui/typing-indicator"

<TypingIndicator />`,
    },
  ],
  "thinking-animation": [
    {
      title: "Thinking status",
      preview: <ThinkingAnimationDemo />,
      code: `import { ThinkingAnimation } from "@/components/ui/thinking-animation"

<ThinkingAnimation label="Reasoning" />`,
    },
  ],
  "reasoning-block": [
    {
      title: "Collapsible reasoning",
      preview: <ReasoningBlockDemo />,
      code: `import { ReasoningBlock } from "@/components/ui/reasoning-block"

<ReasoningBlock defaultOpen title="Reasoning">
  Step-by-step notes…
</ReasoningBlock>`,
    },
  ],
  "citation-card": [
    {
      title: "Source citation",
      preview: <CitationCardDemo />,
      code: `import { CitationCard } from "@/components/ui/citation-card"

<CitationCard index={1} title="Docs" source="example.com" excerpt="…" />`,
    },
  ],
  "token-counter": [
    {
      title: "Token badge",
      preview: <TokenCounterDemo />,
      code: `import { TokenCounter } from "@/components/ui/token-counter"

<TokenCounter text={prompt} limit={1000} />`,
    },
  ],
  "prompt-suggestions": [
    {
      title: "Suggestion chips",
      preview: <PromptSuggestionsDemo />,
      code: `import { PromptSuggestions } from "@/components/ui/prompt-suggestions"

<PromptSuggestions suggestions={items} onSelect={apply} />`,
    },
  ],
  "agent-card": [
    {
      title: "Agent profile",
      preview: <AgentCardDemo />,
      code: `import { AgentCard } from "@/components/ui/agent-card"

<AgentCard name="Research Agent" status="running" description="…" />`,
    },
  ],
  "tool-call-viewer": [
    {
      title: "Tool call",
      preview: <ToolCallViewerDemo />,
      code: `import { ToolCallViewer } from "@/components/ui/tool-call-viewer"

<ToolCallViewer name="web_search" status="success" args={args} result={result} />`,
    },
  ],
  "mcp-server-card": [
    {
      title: "MCP server",
      preview: <McpServerCardDemo />,
      code: `import { McpServerCard } from "@/components/ui/mcp-server-card"

<McpServerCard name="filesystem" status="connected" toolsCount={8} />`,
    },
  ],
  "ai-model-selector": [
    {
      title: "Model picker",
      preview: <AIModelSelectorDemo />,
      code: `import { AIModelSelector } from "@/components/ui/ai-model-selector"

<AIModelSelector models={models} value={model} onValueChange={setModel} />`,
    },
  ],
  "conversation-sidebar": [
    {
      title: "Conversation list",
      preview: <ConversationSidebarDemo />,
      code: `import { ConversationSidebar } from "@/components/ui/conversation-sidebar"

<ConversationSidebar
  conversations={items}
  activeId={activeId}
  onSelect={select}
  onNewChat={create}
/>`,
    },
  ],
};

export function getExamples(slug: string): ComponentExample[] {
  return EXAMPLES[slug] ?? [];
}