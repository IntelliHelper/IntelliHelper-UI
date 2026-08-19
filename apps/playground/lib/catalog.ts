export type ComponentCategory =
  | "glass-system"
  | "actions"
  | "surfaces"
  | "forms"
  | "overlays"
  | "navigation"
  | "data"
  | "feedback"
  | "interactive"
  | "content"
  | "media";

export type CatalogItem = {
  slug: string;
  title: string;
  description: string;
  category: ComponentCategory;
};

export const CATEGORY_META: Record<
  ComponentCategory,
  { label: string; description: string }
> = {
  "glass-system": {
    label: "Glass System",
    description: "Liquid Glass primitives — chrome layers over expressive content",
  },
  actions: {
    label: "Actions",
    description: "Buttons and pressable controls",
  },
  surfaces: {
    label: "Surfaces",
    description: "Cards, tabs, layout primitives, and containers",
  },
  forms: {
    label: "Forms",
    description: "Inputs, selects, and date controls",
  },
  overlays: {
    label: "Overlays",
    description: "Dialogs, sheets, drawers, popovers, and tooltips",
  },
  navigation: {
    label: "Navigation",
    description: "Sidebars, pagination, and scroll helpers",
  },
  data: {
    label: "Data",
    description:
      "Tables, empty states, KPI metric cards, and chart visualizations",
  },
  feedback: {
    label: "Feedback",
    description: "Alerts, toasts, badges, spinners, and progress",
  },
  interactive: {
    label: "Interactive",
    description: "Accordions, sliders, toggles, and carousels",
  },
  content: {
    label: "Content",
    description: "Typography, markdown, and documentation tools",
  },
  media: {
    label: "Media",
    description:
      "Image lightbox, audio/video player with CC & quality, and canvas image editing",
  },
};

export const CATALOG: CatalogItem[] = [
  {
    slug: "background-picture-picker",
    title: "Background Picture",
    description: "Preset gradients, custom uploads, or reset to default mesh backgrounds.",
    category: "glass-system",
  },
  {
    slug: "glass-content-card",
    title: "Glass Content Card",
    description: "Expressive saturated panels beneath floating chrome controls.",
    category: "glass-system",
  },
  {
    slug: "glass-bar",
    title: "Glass Bar",
    description: "Neutral Liquid Glass capsule for grouped media controls.",
    category: "glass-system",
  },
  {
    slug: "glass-icon-button",
    title: "Glass Icon Button",
    description: "Circular chrome buttons for icon-only actions.",
    category: "glass-system",
  },
  {
    slug: "component-preview",
    title: "Component Preview",
    description: "Live preview with syntax-highlighted source and copy.",
    category: "glass-system",
  },
  {
    slug: "button",
    title: "Button",
    description: "Chrome and content layer variants with shapes and sizes.",
    category: "actions",
  },
  {
    slug: "copy-button",
    title: "Copy Button",
    description: "Clipboard copy control with temporary copied feedback.",
    category: "actions",
  },
  {
    slug: "theme-toggle",
    title: "Theme Toggle",
    description: "Light and dark mode switch for app chrome and docs.",
    category: "actions",
  },
  {
    slug: "font-picker",
    title: "Font Picker",
    description: "Change the app font family — sans, serif, mono, and system stacks.",
    category: "actions",
  },
  {
    slug: "toggle",
    title: "Toggle",
    description: "Pressable glass toggle with spring scale feedback.",
    category: "actions",
  },
  {
    slug: "toggle-group",
    title: "Toggle Group",
    description: "Capsule container for exclusive or multi-select toggles.",
    category: "actions",
  },
  {
    slug: "card",
    title: "Card",
    description: "Frosted glass panels for chrome and expressive content.",
    category: "surfaces",
  },
  {
    slug: "tabs",
    title: "Tabs",
    description: "Glass capsule tabs with sliding chrome indicator.",
    category: "surfaces",
  },
  {
    slug: "separator",
    title: "Separator",
    description: "Chrome dividers for horizontal and vertical layout.",
    category: "surfaces",
  },
  {
    slug: "layout",
    title: "Layout",
    description:
      "Stack, Cluster, Grid, Flex, Center, Split, Container, Box, and Spacer — replace nested layout divs with named primitives.",
    category: "surfaces",
  },
  {
    slug: "resizable",
    title: "Resizable",
    description: "Drag-to-resize panel groups with glass grip handle.",
    category: "surfaces",
  },
  {
    slug: "scroll-area",
    title: "Scroll Area",
    description: "Custom scrollbar with optional chrome container.",
    category: "surfaces",
  },
  {
    slug: "input",
    title: "Input",
    description: "Translucent glass text fields with chrome and outline variants.",
    category: "forms",
  },
  {
    slug: "label",
    title: "Label",
    description: "Accessible form labels with chrome, muted, and required styles.",
    category: "forms",
  },
  {
    slug: "password-input",
    title: "Password Input",
    description: "Glass password field with show/hide toggle and field states.",
    category: "forms",
  },
  {
    slug: "otp-input",
    title: "OTP Input",
    description: "One-time code slots with paste support and completion callback.",
    category: "forms",
  },
  {
    slug: "textarea",
    title: "Textarea",
    description: "Multiline glass inputs with size and state variants.",
    category: "forms",
  },
  {
    slug: "select",
    title: "Select",
    description: "Frosted dropdown with rise-in panel and animated checks.",
    category: "forms",
  },
  {
    slug: "combobox",
    title: "Combobox",
    description: "Searchable select with filterable options and keyboard navigation.",
    category: "forms",
  },
  {
    slug: "file-upload",
    title: "File Upload",
    description: "Drag-and-drop glass uploader with browse and selected file list.",
    category: "forms",
  },
  {
    slug: "native-select",
    title: "Native Select",
    description: "Styled native HTML select with glass field styling.",
    category: "forms",
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description: "Glass checkbox with animated check and indeterminate states.",
    category: "forms",
  },
  {
    slug: "switch",
    title: "Switch",
    description: "Frosted toggle switch with spring-animated thumb.",
    category: "forms",
  },
  {
    slug: "radio-group",
    title: "Radio Group",
    description: "Glass radio controls with primary indicator dot.",
    category: "forms",
  },
  {
    slug: "calendar",
    title: "Calendar",
    description: "Frosted date picker with range and multi-select modes.",
    category: "forms",
  },
  {
    slug: "event-calendar",
    title: "Event Calendar",
    description: "Month event grid with color chips, agenda sidebar, and day selection.",
    category: "data",
  },
  {
    slug: "dialog",
    title: "Dialog",
    description: "Highly transparent modal with frosted overlay and rise-in content.",
    category: "overlays",
  },
  {
    slug: "alert-dialog",
    title: "Alert Dialog",
    description: "Confirmation modal for destructive and irreversible actions.",
    category: "overlays",
  },
  {
    slug: "sheet",
    title: "Sheet",
    description: "Edge slide-in glass panel with spring animation.",
    category: "overlays",
  },
  {
    slug: "drawer",
    title: "Drawer",
    description: "Drag-to-dismiss glass panel with a handle and optional snap points.",
    category: "overlays",
  },
  {
    slug: "popover",
    title: "Popover",
    description: "Click-triggered frosted panel for contextual actions.",
    category: "overlays",
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    description: "Glass action menus with checkboxes, radios, and nested submenus.",
    category: "overlays",
  },
  {
    slug: "context-menu",
    title: "Context Menu",
    description: "Right-click glass menus for lists, tables, and canvases.",
    category: "overlays",
  },
  {
    slug: "hover-card",
    title: "Hover Card",
    description: "Rich hover previews with spring scale-in animation.",
    category: "overlays",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    description: "Frosted contextual hints with spring scale-in.",
    category: "overlays",
  },
  {
    slug: "command",
    title: "Command",
    description: "Filterable command palette with dialog mode and keyboard nav.",
    category: "overlays",
  },
  {
    slug: "sidebar",
    title: "Sidebar",
    description: "Collapsible glass sidebar with mobile sheet and icon rail.",
    category: "navigation",
  },
  {
    slug: "navigation-menu",
    title: "Navigation Menu",
    description: "Multi-level header navigation with glass content panels.",
    category: "navigation",
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    description: "Hierarchical path navigation with separators and ellipsis.",
    category: "navigation",
  },
  {
    slug: "link",
    title: "Link",
    description:
      "Styled anchors with variants, sizes, external safety defaults, and asChild for Next.js.",
    category: "navigation",
  },
  {
    slug: "pagination",
    title: "Pagination",
    description: "Accessible page navigation with glass button links.",
    category: "navigation",
  },
  {
    slug: "scroll-to-top",
    title: "Scroll To Top",
    description: "Floating glass button that appears after scrolling.",
    category: "navigation",
  },
  {
    slug: "floating-widget",
    title: "Floating Widget",
    description: "Chat-style corner bubble with a compact panel for feedback or messaging.",
    category: "overlays",
  },
  {
    slug: "table",
    title: "Table",
    description: "Glass-styled data table with chrome container and hover rows.",
    category: "data",
  },
  {
    slug: "empty",
    title: "Empty",
    description: "Compound empty-state layout with icon media slot.",
    category: "data",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    description: "Glass pulse loading placeholders.",
    category: "data",
  },
  {
    slug: "alert",
    title: "Alert",
    description: "Status alerts with semantic tints and optional icons.",
    category: "feedback",
  },
  {
    slug: "toast",
    title: "Toast",
    description: "Transient Liquid Glass notifications with imperative API and stacking.",
    category: "feedback",
  },
  {
    slug: "avatar",
    title: "Avatar",
    description: "Glass avatars with image, fallback initials, and stacked groups.",
    category: "feedback",
  },
  {
    slug: "badge",
    title: "Badge",
    description: "Glass pill badges with scale-in mount animation.",
    category: "feedback",
  },
  {
    slug: "kbd",
    title: "Kbd",
    description: "Keyboard key labels for shortcuts and hints.",
    category: "feedback",
  },
  {
    slug: "spinner",
    title: "Spinner",
    description: "Loading spinner with arc, ring, dots, bars, pulse, and apple types.",
    category: "feedback",
  },
  {
    slug: "progress",
    title: "Progress",
    description: "Frosted progress bar with spring-animated fill.",
    category: "feedback",
  },
  {
    slug: "accordion",
    title: "Accordion",
    description: "Expandable chrome panels with rotating chevron.",
    category: "interactive",
  },
  {
    slug: "collapsible",
    title: "Collapsible",
    description: "Standalone expand/collapse panel and file-tree layout.",
    category: "interactive",
  },
  {
    slug: "slider",
    title: "Slider",
    description: "Frosted range slider with spring-animated thumb.",
    category: "interactive",
  },
  {
    slug: "carousel",
    title: "Carousel",
    description: "Embla-powered slides with glass viewport chrome.",
    category: "interactive",
  },
  {
    slug: "stepper",
    title: "Stepper",
    description: "Ordered steps with completed, active, and upcoming states.",
    category: "interactive",
  },
  {
    slug: "typography",
    title: "Typography",
    description: "Semantic text primitives for headings, body, and code.",
    category: "content",
  },
  {
    slug: "markdown-viewer",
    title: "Markdown Viewer",
    description: "Glass-styled markdown with Shiki syntax highlighting.",
    category: "content",
  },
  {
    slug: "markdown-editor",
    title: "Markdown Editor",
    description: "Rich-text and markdown editing with split preview.",
    category: "content",
  },
  {
    slug: "multi-select",
    title: "Multi Select",
    description: "Searchable multi-value select with chips and keyboard navigation.",
    category: "forms",
  },
  {
    slug: "notification-center",
    title: "Notification Center",
    description: "Inbox-style notifications with unread, mark-read, and dismiss.",
    category: "feedback",
  },
  {
    slug: "code-viewer",
    title: "Code Viewer",
    description: "Glass code surface with line numbers and copy.",
    category: "content",
  },
  {
    slug: "terminal-block",
    title: "Terminal Block",
    description: "Terminal transcript with prompts and output lines.",
    category: "content",
  },
  {
    slug: "json-viewer",
    title: "JSON Viewer",
    description: "Pretty-print and validate JSON with line numbers.",
    category: "content",
  },
  {
    slug: "aspect-ratio",
    title: "Aspect Ratio",
    description: "Container that locks media to a consistent ratio.",
    category: "surfaces",
  },
  {
    slug: "ai-chat",
    title: "AI Chat",
    description: "Composable chat shell with user and assistant bubbles.",
    category: "content",
  },
  {
    slug: "prompt-input",
    title: "Prompt Input",
    description: "Composer with Enter-to-send and token estimate.",
    category: "forms",
  },
  {
    slug: "streaming-text",
    title: "Streaming Text",
    description: "Progressive reveal for streaming model responses.",
    category: "content",
  },
  {
    slug: "typing-indicator",
    title: "Typing Indicator",
    description: "Animated dots while the assistant composes a reply.",
    category: "feedback",
  },
  {
    slug: "thinking-animation",
    title: "Thinking Animation",
    description: "Thinking/processing status for agent and chat UIs.",
    category: "feedback",
  },
  {
    slug: "reasoning-block",
    title: "Reasoning Block",
    description: "Collapsible chain-of-thought panel for AI responses.",
    category: "content",
  },
  {
    slug: "citation-card",
    title: "Citation Card",
    description: "Source citation with index, excerpt, and optional link.",
    category: "content",
  },
  {
    slug: "token-counter",
    title: "Token Counter",
    description: "Token usage badge with estimate and limit states.",
    category: "feedback",
  },
  {
    slug: "prompt-suggestions",
    title: "Prompt Suggestions",
    description: "Quick-start prompt chips for empty chat states.",
    category: "forms",
  },
  {
    slug: "agent-card",
    title: "Agent Card",
    description: "Agent identity card with status and tools strip.",
    category: "data",
  },
  {
    slug: "tool-call-viewer",
    title: "Tool Call Viewer",
    description: "Expandable viewer for tool args, results, and errors.",
    category: "data",
  },
  {
    slug: "mcp-server-card",
    title: "MCP Server Card",
    description: "MCP server status with tools and resources counts.",
    category: "data",
  },
  {
    slug: "ai-model-selector",
    title: "AI Model Selector",
    description: "Model picker with provider and description metadata.",
    category: "forms",
  },
  {
    slug: "conversation-sidebar",
    title: "Conversation Sidebar",
    description: "Pinned conversation list with active state and new chat.",
    category: "navigation",
  },
  {
    slug: "image-preview",
    title: "Image Preview",
    description: "Lightbox gallery with zoom, pan, captions, and download.",
    category: "media",
  },
  {
    slug: "media-player",
    title: "Media Player",
    description: "Glass audio/video player with CC, quality selector, seek, and volume.",
    category: "media",
  },
  {
    slug: "image-editor",
    title: "Image Editor",
    description: "Crop, rotate, flip, filters, and canvas export for images.",
    category: "media",
  },
  {
    slug: "metric-card",
    title: "Metric Card",
    description:
      "Glass KPI / statistic card with value, trend delta, icon, and footer slot.",
    category: "data",
  },
  {
    slug: "line-chart",
    title: "Line Chart",
    description: "Pure SVG line series with glass chrome, grid, and point markers.",
    category: "data",
  },
  {
    slug: "area-chart",
    title: "Area Chart",
    description: "Filled SVG area series with primary gradient under the line.",
    category: "data",
  },
  {
    slug: "sparkline",
    title: "Sparkline",
    description: "Compact inline sparkline for KPI cards and dense metric rows.",
    category: "data",
  },
  {
    slug: "donut-chart",
    title: "Donut Chart",
    description: "Donut segments with legend, center total, and token colors.",
    category: "data",
  },
  {
    slug: "chart-period",
    title: "Chart Period",
    description:
      "Time-range control with presets, app-defined periods, and custom from/to range.",
    category: "data",
  },
  {
    slug: "chart-frame",
    title: "Chart Frame",
    description:
      "Dashboard chart shell with title, description, period toolbar, legend, and footer.",
    category: "data",
  },
  {
    slug: "bar-chart",
    title: "Bar Chart",
    description: "Vertical or horizontal pure SVG bars with labels and grid.",
    category: "data",
  },
  {
    slug: "pie-chart",
    title: "Pie Chart",
    description: "Solid pie segments with legend and token-aware colors.",
    category: "data",
  },
  {
    slug: "stacked-bar-chart",
    title: "Stacked Bar Chart",
    description: "Multi-series stacked columns with legend and category labels.",
    category: "data",
  },
  {
    slug: "radar-chart",
    title: "Radar Chart",
    description: "Spider/radar polygon for multi-axis skill or score profiles.",
    category: "data",
  },
  {
    slug: "funnel-chart",
    title: "Funnel Chart",
    description: "Conversion funnel stages with tapering widths and labels.",
    category: "data",
  },
  {
    slug: "heatmap",
    title: "Heatmap",
    description:
      "Matrix heatmap with color scales, labels, legend, values, and interactive cells.",
    category: "data",
  },
  {
    slug: "tree-map",
    title: "Tree Map",
    description:
      "Squarified hierarchical tree map — tile area proportional to value.",
    category: "data",
  },
  {
    slug: "sankey",
    title: "Sankey",
    description: "Weighted flow diagram with multi-column nodes and ribbons.",
    category: "data",
  },
  {
    slug: "gauge",
    title: "Gauge",
    description:
      "Semi-circular gauge with needle, domain mapping, and threshold bands.",
    category: "data",
  },
  /* ─── Tier 3 product surfaces ───────────────────────────────────────── */
  {
    slug: "search-input",
    title: "Search Input",
    description: "Search field with icon, clear control, and glass field variants.",
    category: "forms",
  },
  {
    slug: "pin-input",
    title: "PIN Input",
    description: "Masked short PIN slots for secure numeric entry.",
    category: "forms",
  },
  {
    slug: "number-input",
    title: "Number Input",
    description: "Numeric field with steppers, min/max, step, and arrow keys.",
    category: "forms",
  },
  {
    slug: "currency-input",
    title: "Currency Input",
    description:
      "Money field with searchable selector for all ISO currencies, symbols, and decimals.",
    category: "forms",
  },
  {
    slug: "phone-input",
    title: "Phone Input",
    description:
      "International phone with all-country dial codes, search, national format, and E.164.",
    category: "forms",
  },
  {
    slug: "color-picker",
    title: "Color Picker",
    description: "Swatches, hex entry, and native picker in a glass popover.",
    category: "forms",
  },
  {
    slug: "rating",
    title: "Rating",
    description: "Accessible star rating with keyboard support and half stars.",
    category: "forms",
  },
  {
    slug: "time-picker",
    title: "Time Picker",
    description: "Hour/minute columns with 12/24h mode and typed time entry.",
    category: "forms",
  },
  {
    slug: "month-picker",
    title: "Month Picker",
    description: "Year-navigated month grid for filters and reporting periods.",
    category: "forms",
  },
  {
    slug: "date-time-picker",
    title: "Date Time Picker",
    description: "Calendar + time composite for scheduling and admin filters.",
    category: "forms",
  },
  {
    slug: "banner",
    title: "Banner",
    description: "Full-width status banner with sticky/fixed modes and dismiss.",
    category: "feedback",
  },
  {
    slug: "callout",
    title: "Callout",
    description: "Doc-style callout for tips, warnings, dangers, and notes.",
    category: "feedback",
  },
  {
    slug: "offline-banner",
    title: "Offline Banner",
    description: "Network-aware banner for offline state and reconnect flash.",
    category: "feedback",
  },
  {
    slug: "loading-screen",
    title: "Loading Screen",
    description: "Fullscreen, overlay, inline, or panel loading with spinners.",
    category: "feedback",
  },
  {
    slug: "retry-view",
    title: "Retry View",
    description: "Error empty state with primary retry action and action slots.",
    category: "feedback",
  },
  {
    slug: "dock",
    title: "Dock",
    description: "macOS-style glass dock with magnification and tooltips.",
    category: "navigation",
  },
  {
    slug: "bottom-navigation",
    title: "Bottom Navigation",
    description: "Mobile tab bar with badges, safe-area, and glass chrome.",
    category: "navigation",
  },
  {
    slug: "timeline",
    title: "Timeline",
    description: "Vertical event timeline with status dots and timestamps.",
    category: "data",
  },
  {
    slug: "activity-feed",
    title: "Activity Feed",
    description: "Scrollable activity list with avatars, actions, and times.",
    category: "data",
  },
  {
    slug: "kanban",
    title: "Kanban",
    description: "Drag-and-drop task board with columns, cards, and labels.",
    category: "data",
  },
  {
    slug: "data-grid",
    title: "Data Grid",
    description: "Sortable, filterable, selectable table for admin apps.",
    category: "data",
  },
  {
    slug: "virtual-table",
    title: "Virtual Table",
    description: "Windowed table for large datasets with infinite-scroll hook.",
    category: "data",
  },
  {
    slug: "address-fields",
    title: "Address Fields",
    description:
      "Country → State → City cascading selectors (select-only, full world data).",
    category: "forms",
  },
  {
    slug: "address-country-select",
    title: "Address Country Select",
    description: "Searchable country picker for addresses with flags.",
    category: "forms",
  },
  {
    slug: "address-region-select",
    title: "Address Region Select",
    description: "State/province picker cascading from country.",
    category: "forms",
  },
  {
    slug: "address-city-select",
    title: "Address City Select",
    description: "City picker cascading from country + state.",
    category: "forms",
  },
];

export function getCatalogItem(slug: string): CatalogItem | undefined {
  return CATALOG.find((item) => item.slug === slug);
}

export function getCatalogByCategory(): Record<ComponentCategory, CatalogItem[]> {
  const grouped = {} as Record<ComponentCategory, CatalogItem[]>;

  for (const key of Object.keys(CATEGORY_META) as ComponentCategory[]) {
    grouped[key] = [];
  }

  for (const item of CATALOG) {
    grouped[item.category].push(item);
  }

  return grouped;
}

export function getAdjacentItems(slug: string): {
  prev: CatalogItem | null;
  next: CatalogItem | null;
} {
  const index = CATALOG.findIndex((item) => item.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? (CATALOG[index - 1] ?? null) : null,
    next: index < CATALOG.length - 1 ? (CATALOG[index + 1] ?? null) : null,
  };
}

export function getCategoryItems(category: ComponentCategory): CatalogItem[] {
  return CATALOG.filter((item) => item.category === category);
}

export function isComponentCategory(value: string): value is ComponentCategory {
  return value in CATEGORY_META;
}

/** Related components in the same category (excluding self), capped for SEO modules */
export function getRelatedItems(slug: string, limit = 4): CatalogItem[] {
  const current = getCatalogItem(slug);
  if (!current) return [];

  return CATALOG.filter(
    (item) => item.category === current.category && item.slug !== slug,
  ).slice(0, limit);
}

export const CATEGORY_ORDER = Object.keys(CATEGORY_META) as ComponentCategory[];