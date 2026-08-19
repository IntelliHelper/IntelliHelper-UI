import type { ComponentCategory } from "./catalog";

export type ComponentFaqItem = {
  question: string;
  answer: string;
};

/** Extra SERP keywords layered onto component meta (P2 component intent). */
export const COMPONENT_KEYWORDS: Record<string, string[]> = {
  drawer: [
    "react drawer component",
    "vaul drawer react",
    "bottom sheet react",
    "drag to dismiss drawer",
    "mobile drawer next.js",
    "glassmorphism drawer",
    "react snap points drawer",
  ],
  layout: [
    "react layout components",
    "stack cluster grid react",
    "tailwind layout primitives",
    "flex stack component next.js",
    "replace div soup react",
    "responsive grid component react",
    "page container max-width react",
  ],
  "image-preview": [
    "image preview react",
    "react image lightbox",
    "image gallery lightbox next.js",
    "react zoom pan image viewer",
    "glassmorphism image preview",
    "tailwind image lightbox",
    "react image modal gallery",
  ],
  "media-player": [
    "react media player",
    "react video player",
    "react audio player",
    "html5 video player react",
    "react video player captions",
    "react video quality selector",
    "glassmorphism media player",
    "next.js video player component",
    "tailwind audio player",
  ],
  "image-editor": [
    "react image editor",
    "react image crop",
    "react image filter",
    "react rotate image component",
    "canvas image editor react",
    "next.js image crop component",
    "tailwind image editor",
    "react crop rotate flip filters",
  ],
};

/** Category-level keyword clusters for `/categories/*` metadata. */
export const CATEGORY_KEYWORDS: Record<ComponentCategory, string[]> = {
  "glass-system": [
    "liquid glass primitives",
    "glass chrome ui",
    "glass bar react",
    "glass content card",
  ],
  actions: [
    "react button components",
    "glass button",
    "toggle group react",
  ],
  surfaces: [
    "react card tabs",
    "layout stack cluster grid",
    "resizable panels react",
    "scroll area tailwind",
  ],
  forms: [
    "react form components tailwind",
    "glass input select",
    "react calendar component",
  ],
  overlays: [
    "react dialog sheet drawer popover",
    "modal glassmorphism",
    "react tooltip hover card",
  ],
  navigation: [
    "react sidebar pagination",
    "navigation menu next.js",
    "app shell nav react",
  ],
  data: [
    "react table empty state",
    "skeleton loading react",
    "data table glass",
  ],
  feedback: [
    "react alert badge spinner",
    "toast progress kbd",
    "status ui react",
  ],
  interactive: [
    "react accordion slider carousel",
    "collapsible file tree",
  ],
  content: [
    "react markdown editor viewer",
    "typography code viewer",
    "docs ui react",
  ],
  media: [
    "react media components",
    "react image preview lightbox",
    "react video player captions",
    "react image crop editor",
    "glassmorphism media player",
    "next.js media ui components",
    "tailwind image gallery",
    "react audio video player",
  ],
};

/**
 * Component-specific FAQ answers for visible accordion + FAQPage JSON-LD.
 * Generic install / stack questions are always appended by the page.
 */
export const COMPONENT_EXTRA_FAQS: Record<string, ComponentFaqItem[]> = {
  drawer: [
    {
      question: "When should I use Drawer instead of Sheet?",
      answer:
        "Use Drawer for mobile-first panels that should drag to dismiss, expose a grab handle, or snap to intermediate heights. Use Sheet when you need a desktop-oriented edge panel without gesture physics. Both share Liquid Glass variants (chrome, elevated, outline) and overlay blur/dim controls.",
    },
    {
      question: "How do snap points work?",
      answer:
        "Pass snapPoints on Drawer (for example [0.3, 0.6, 1]) as fractions of the viewport or pixel strings, and use size=\"full\" so max-height does not clip the snap. fadeFromIndex controls when the overlay starts fading. Users can drag between points; DrawerHandle also cycles snap points on click.",
    },
  ],
  "image-preview": [
    {
      question: "Does Image Preview support multi-image galleries?",
      answer:
        "Yes. Pass an images array and control open/index state, or use ImagePreviewGallery for a thumb grid wired to the lightbox. Users can navigate with arrow keys, zoom with scroll or +/-, and download the active image.",
    },
    {
      question: "Is the lightbox accessible?",
      answer:
        "Image Preview uses a dialog pattern with labelled titles, keyboard close (Escape), focus management, and control labels for zoom, download, and gallery navigation.",
    },
  ],
  "media-player": [
    {
      question: "How do closed captions work?",
      answer:
        "Provide WebVTT tracks via the captions prop. The CC menu lists Off plus each language. Press C to toggle the first track. Tracks render as native HTML track elements with mode showing or disabled. For cross-origin caption files, set crossOrigin=\"anonymous\" on the player (and ensure the media host sends CORS headers).",
    },
    {
      question: "How does the quality selector switch sources?",
      answer:
        "Pass a qualities array with label and src for each rendition. Changing quality (UI, quality prop, or setQuality) swaps the media src while preserving current time and play state. Use distinct bitrates in production; demos may reuse one file for labels.",
    },
    {
      question: "Does Media Player support audio and video?",
      answer:
        "Yes. Set kind to video or audio, or let the player detect from the file extension. Video gets fullscreen and optional captions; audio uses a compact glass chrome shell with title and subtitle.",
    },
  ],
  "image-editor": [
    {
      question: "What edits can Image Editor apply?",
      answer:
        "Crop with drag handles and aspect presets (free, 1:1, 4:3, 3:2, 16:9, 9:16) that lock the ratio while resizing, rotate in 90° steps, flip horizontal/vertical, and adjust brightness, contrast, saturation, grayscale, sepia, and blur. Crop is authored in source space; rotate/flip apply on export after crop. Export to Blob or Data URL via onExport or the imperative handle.",
    },
    {
      question: "Does cropping run on the server?",
      answer:
        "No. Image Editor is a client-side canvas pipeline for product UI. Use it for avatar crop, attachment prep, or admin tools, then upload the exported blob to your API.",
    },
  ],
};

export function getComponentKeywords(slug: string): string[] {
  return COMPONENT_KEYWORDS[slug] ?? [];
}

export function getCategoryKeywords(category: ComponentCategory): string[] {
  return CATEGORY_KEYWORDS[category] ?? [];
}

export function getComponentExtraFaqs(slug: string): ComponentFaqItem[] {
  return COMPONENT_EXTRA_FAQS[slug] ?? [];
}
