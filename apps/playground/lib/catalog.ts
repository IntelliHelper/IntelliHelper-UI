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
  | "content";

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
    description: "Cards, tabs, and layout containers",
  },
  forms: {
    label: "Forms",
    description: "Inputs, selects, and date controls",
  },
  overlays: {
    label: "Overlays",
    description: "Dialogs, sheets, popovers, and tooltips",
  },
  navigation: {
    label: "Navigation",
    description: "Sidebars, pagination, and scroll helpers",
  },
  data: {
    label: "Data",
    description: "Tables, empty states, and loading placeholders",
  },
  feedback: {
    label: "Feedback",
    description: "Alerts, badges, spinners, and progress",
  },
  interactive: {
    label: "Interactive",
    description: "Accordions, sliders, toggles, and carousels",
  },
  content: {
    label: "Content",
    description: "Typography, markdown, and documentation tools",
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
    slug: "sheet",
    title: "Sheet",
    description: "Edge slide-in glass panel with spring animation.",
    category: "overlays",
  },
  {
    slug: "popover",
    title: "Popover",
    description: "Click-triggered frosted panel for contextual actions.",
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
    slug: "sidebar",
    title: "Sidebar",
    description: "Collapsible glass sidebar with mobile sheet and icon rail.",
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
    description: "Accessible loading spinner with chrome variants.",
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