export type GuideTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  code?: string;
  table?: GuideTable;
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** ISO date YYYY-MM-DD */
  datePublished: string;
  dateModified: string;
  readingMinutes: number;
  keywords: string[];
  sections: GuideSection[];
};

export const GUIDES: Guide[] = [
  {
    slug: "layout-primitives",
    title: "Layout Primitives: Replace Div Soup with Stack, Cluster & Grid",
    description:
      "Use Intelli UI layout primitives — Stack, Cluster, Grid, Flex, Split, Center, Container, Box, and Spacer — to cut nested divs, keep spacing consistent, and ship readable product UI in React and Next.js.",
    datePublished: "2026-07-28",
    dateModified: "2026-07-28",
    readingMinutes: 7,
    keywords: [
      "react layout components",
      "stack cluster grid",
      "tailwind layout primitives",
      "replace div soup",
      "flex stack next.js",
      "responsive grid react",
      "intelli ui layout",
    ],
    sections: [
      {
        heading: "Why layout primitives?",
        paragraphs: [
          "Most product pages accumulate anonymous wrappers: div.space-y-8, div.flex.flex-wrap.gap-2, div.grid.md:grid-cols-3. The DOM still needs structure — but the source becomes huge, inconsistent, and hard for agents to edit safely.",
          "Intelli UI layout primitives give those patterns a name. You express intent (stack children, wrap a cluster of actions, split a toolbar) instead of retyping the same Tailwind strings on every page. Install once; use across every screen.",
        ],
        code: `npx @intellihelper/cli@latest add layout

import { Stack, Cluster, Grid, Split } from "@/components/ui/layout"`,
      },
      {
        heading: "The primitive set",
        paragraphs: [
          "Nine small building blocks cover almost every page shell. Prefer the most specific primitive; fall back to Flex or Box only when you need an escape hatch.",
        ],
        table: {
          caption: "When to use each layout primitive",
          headers: ["Primitive", "Use for", "Default behavior"],
          rows: [
            ["Stack", "Vertical (or horizontal) sections", "flex-col · gap-4"],
            ["Cluster", "Badges, chips, button groups", "flex-wrap · gap-2 · items-center"],
            ["Grid", "Responsive card / form columns", "grid · cols=1 · gap-4"],
            ["Split", "Title + action toolbars", "justify-between · wrap"],
            ["Flex", "Custom flex rows/columns", "flex-row"],
            ["Center", "Empty states, hero stages", "items + justify center"],
            ["Container", "Page max-width shells", "mx-auto · max-w-5xl · padded"],
            ["Box", "Polymorphic surface / padding", "as div · optional p"],
            ["Spacer", "Push items apart in a flex row", "flex-1 grow"],
          ],
        },
      },
      {
        heading: "Stack, Cluster, Grid (the daily drivers)",
        paragraphs: [
          "Stack is the default vertical rhythm for sections, forms, and docs. Cluster wraps horizontal groups without overflow pain. Grid handles responsive multi-column layouts with cols, smCols, mdCols, and lgCols — all mapped to static Tailwind classes so nothing gets purged.",
        ],
        code: `<Stack gap={8} as="section">
  <Cluster gap={2}>
    <Badge>New</Badge>
    <Badge variant="outline">Layout</Badge>
  </Cluster>

  <Stack gap={2}>
    <h2>Settings</h2>
    <p className="text-muted-foreground">Profile and billing</p>
  </Stack>

  <Grid cols={1} mdCols={2} gap={4}>
    <Card>…</Card>
    <Card>…</Card>
  </Grid>
</Stack>`,
      },
      {
        heading: "Split and semantic as / asChild",
        paragraphs: [
          "Split is for space-between rows: section headers with a trailing CTA, card titles with badges, table toolbars. Prefer as=\"section\" | as=\"ul\" | as=\"li\" so layout never forces meaningless divs. Use asChild when the child is already the correct element (for example merging onto a Link).",
        ],
        code: `<Split gap={3} align="end">
  <Stack gap={1}>
    <h2 id="billing">Billing</h2>
    <p className="text-sm text-muted-foreground">Invoices and plans</p>
  </Stack>
  <Button size="sm">Manage</Button>
</Split>

{/* Landmark without an extra wrapper */}
<Stack as="section" gap={6} aria-labelledby="billing">…</Stack>`,
      },
      {
        heading: "Spacing scale and consistency",
        paragraphs: [
          "All gap and padding props share one scale (0, 0.5, 1 … 28) aligned with Tailwind. That keeps design rhythm consistent across the playground and consumer apps — prefer gap={4} over ad-hoc space-y-4 on one page and gap-5 on the next.",
          "For one-off responsive tweaks (for example gap-20 md:gap-28), pass className. Props stay the common path; className stays the escape hatch.",
        ],
        bullets: [
          "gap on Stack / Cluster / Grid / Flex / Split / Center",
          "p on Box for uniform padding",
          "size on Container: sm · md · lg · xl · 2xl · full",
          "size on Spacer for fixed breathing room; omit for flex grow",
        ],
      },
      {
        heading: "Anti-patterns",
        paragraphs: [
          "Layout primitives are structure, not glass chrome. Do not nest frosted Card inside Card for spacing — use Stack gap instead. Do not replace every HTML element with Box; prefer semantic as props. Do not invent a tenth spacing scale with arbitrary Tailwind gaps next to gap={4}.",
        ],
        bullets: [
          "Avoid: <div className=\"space-y-8\"><div className=\"flex flex-wrap gap-2\">…",
          "Prefer: <Stack gap={8}><Cluster gap={2}>…",
          "Avoid: layout-only wrappers around a single child with no gap or alignment",
          "Prefer: put gap on the parent that already exists, or use asChild",
        ],
      },
      {
        heading: "Where Intelli UI uses this",
        paragraphs: [
          "Every component documentation page (preview workspace, install strip, guidance sections, related cards) is composed with layout primitives. The homepage, catalog, categories, guides, and shell footer follow the same system so demos match product patterns.",
          "Open the Layout catalog entry for live previews, or copy the snippets above after CLI install.",
        ],
        code: `npx @intellihelper/cli@latest add layout button card badge

# Docs
# /components/layout
# /guides/layout-primitives`,
      },
    ],
  },
  {
    slug: "react-media-components-image-video",
    title: "React Media Components: Image Preview, Video Player & Image Editor",
    description:
      "Ship a Liquid Glass media kit in Next.js — image lightbox galleries, HTML5 video/audio with captions and quality selection, and canvas crop/filter/rotate editors you own in source.",
    datePublished: "2026-07-25",
    dateModified: "2026-07-25",
    readingMinutes: 9,
    keywords: [
      "react media components",
      "react image lightbox",
      "react video player captions",
      "react image crop editor",
      "next.js media player",
      "glassmorphism media ui",
      "tailwind video player component",
    ],
    sections: [
      {
        heading: "Why a media category in a UI library?",
        paragraphs: [
          "Product UIs constantly handle images and audio/video: AI chat attachments, profile photos, product galleries, podcasts, and walkthrough clips. Teams often bolt on heavy players or ad-hoc lightbox CSS that fights the design system.",
          "Intelli UI ships a free Media category with three Liquid Glass components — Image Preview, Media Player, and Image Editor — so chrome controls match the rest of your glass app and you still own the TypeScript after CLI install.",
        ],
      },
      {
        heading: "Image Preview (lightbox gallery)",
        paragraphs: [
          "Use Image Preview when users need to open images full-screen with zoom, pan, captions, download, and multi-image navigation. Pair thumbnails with controlled open/index state, or drop in ImagePreviewGallery for a grid that wires the lightbox for you.",
          "Primary search intents: image preview react, react image lightbox, next.js image gallery modal.",
        ],
        code: `npx @intellihelper/cli@latest add image-preview

import { ImagePreview } from "@/components/ui/image-preview"

<ImagePreview
  images={[{ src: "/hero.jpg", alt: "Hero", caption: "Launch art" }]}
  open={open}
  onOpenChange={setOpen}
/>`,
      },
      {
        heading: "Media Player (audio, video, CC, quality)",
        paragraphs: [
          "Media Player wraps native HTML5 media with glass chrome: seek, volume, mute, fullscreen, closed captions (WebVTT), and multi-quality source switching that preserves playback position.",
          "Pass captions for accessibility and SEO-adjacent transcript UX; pass qualities for 1080p/720p/480p (or custom labels). Keyboard shortcuts include Space/K play, arrows seek, M mute, C captions, F fullscreen.",
        ],
        code: `npx @intellihelper/cli@latest add media-player

import { MediaPlayer } from "@/components/ui/media-player"

<MediaPlayer
  kind="video"
  title="Walkthrough"
  captions={[
    { id: "en", src: "/en.vtt", label: "English", srcLang: "en", default: true },
  ]}
  qualities={[
    { id: "1080", label: "1080p", src: "/v-1080.mp4", height: 1080 },
    { id: "720", label: "720p", src: "/v-720.mp4", height: 720 },
  ]}
  defaultQuality="720"
/>`,
      },
      {
        heading: "Image Editor (crop, rotate, filters)",
        paragraphs: [
          "Image Editor is a client-side canvas tool for crop handles, aspect presets that lock ratio while resizing (defaultAspect / aspect / onAspectChange), 90° rotate, flip, and filter sliders (brightness, contrast, saturation, grayscale, sepia, blur). Crop is authored in source space; rotate/flip apply on export after crop. Export a Blob or Data URL for upload pipelines.",
          "Compose File Upload → Image Editor → API for avatars and attachments. Avoid using it as a server-side pipeline — it is product UI, not an NLE.",
        ],
        code: `npx @intellihelper/cli@latest add image-editor file-upload

import { ImageEditor } from "@/components/ui/image-editor"

<ImageEditor
  src={previewUrl}
  defaultAspect="1:1"
  onExport={(blob) => uploadAvatar(blob)}
/>`,
      },
      {
        heading: "Install the full media kit",
        paragraphs: [
          "One CLI command installs all three components plus shared utils. Browse live demos under the Media category on the Intelli UI playground.",
        ],
        code: `npx @intellihelper/cli@latest add image-preview media-player image-editor`,
      },
      {
        heading: "Accessibility and performance",
        paragraphs: [
          "Provide real captions/transcripts for meaningful audio and video. Name icon-only controls. Keep glass player chrome on the control layer so text stays readable over the gradient.",
          "Prefer progressive preload (metadata), poster images for LCP-friendly video frames, and CORS-friendly assets when using canvas export or cross-origin WebVTT. For remote captions, set crossOrigin=\"anonymous\" on MediaPlayer and serve CORS headers on the media origin.",
        ],
      },
    ],
  },
  {
    slug: "liquid-glass-ui-react",
    title: "Liquid Glass UI: What It Is & How to Build It in React",
    description:
      "Learn what Liquid Glass (glassmorphism) UI is, how chrome vs content layers work, and how to ship free React components for Next.js & Tailwind with Intelli UI.",
    datePublished: "2026-07-21",
    dateModified: "2026-07-25",
    readingMinutes: 10,
    keywords: [
      "liquid glass ui",
      "glassmorphism react",
      "how to build glassmorphism react",
      "liquid glass next.js",
      "frosted glass tailwind",
    ],
    sections: [
      {
        heading: "What is Liquid Glass UI?",
        paragraphs: [
          "Liquid Glass UI is a design language that uses translucency, blur, and subtle borders to separate floating chrome (toolbars, controls, chrome buttons) from expressive content underneath. Apple popularized related ideas in visionOS and recent system UI; on the web, teams often call the same look glassmorphism.",
          "Done well, glass helps hierarchy: controls stay calm and reusable while content (media, gradients, product art) stays vivid. Done poorly, blur tanks performance and text contrast fails accessibility checks.",
          "In product terms, Liquid Glass UI is not “blur everything.” It is a layered system: frosted chrome stays neutral so icons and labels remain readable; content panels may be more saturated; tokens keep blur, fill, and border consistent across themes.",
        ],
      },
      {
        heading: "Chrome layer vs content layer",
        paragraphs: [
          "Intelli UI splits surfaces into two mental layers so glassmorphism stays usable in real apps, not just marketing mockups:",
        ],
        bullets: [
          "Chrome layer — frosted, neutral controls (bars, icon buttons, dialogs). Prefer lower saturation and reliable focus rings.",
          "Content layer — saturated cards, hero media, and expressive panels that sit under or beside chrome.",
          "Tokens — blur, fill, border, and elevation variables so themes (mono, aurora, sunset, frost, ocean) stay consistent.",
        ],
      },
      {
        heading: "How to build Liquid Glass in React (Next.js + Tailwind)",
        paragraphs: [
          "You can hand-roll backdrop-filter and semi-transparent backgrounds, but a component library saves weeks of accessibility and variant work. Intelli UI ships free Liquid Glass React components you install into your repo — same ownership model as shadcn/ui, with a glass-first system.",
          "A practical path: initialize the project, add chrome primitives (button, glass-bar, dialog), then content surfaces (card, glass content card). Keep glass regions bounded so Core Web Vitals stay healthy on mobile.",
        ],
        code: `npx @intellihelper/cli@latest init
npx @intellihelper/cli@latest add button card dialog glass-bar`,
      },
      {
        heading: "Performance tips (Core Web Vitals)",
        paragraphs: [
          "Backdrop blur is GPU-heavy on low-end mobile. Keep glass regions bounded, avoid animating large blurred areas on scroll, reserve space for previews to prevent CLS, and honor prefers-reduced-motion for decorative animation.",
          "Prefer live previews that mount on demand when a page lists many demos. The Intelli UI playground follows these patterns so catalog pages stay usable while still showing real glass.",
        ],
      },
      {
        heading: "Liquid Glass vs flat UI kits",
        paragraphs: [
          "Flat component kits (including default shadcn/ui styling) leave brand and hierarchy entirely to you. Liquid Glass systems encode hierarchy in the design language itself.",
        ],
        table: {
          caption:
            "Liquid Glass design language compared to flat UI kit defaults",
          headers: ["Concern", "Flat / neutral kits", "Liquid Glass (Intelli UI)"],
          rows: [
            [
              "Hierarchy",
              "You invent elevation and brand",
              "Chrome vs content layers built-in",
            ],
            [
              "Themes",
              "Often one gray scale",
              "Five Liquid Glass packs on shared tokens",
            ],
            [
              "Glass primitives",
              "DIY backdrop-filter",
              "Glass-bar, content cards, preview stage",
            ],
            [
              "Ownership",
              "Varies by package",
              "CLI copy-paste — source in your repo",
            ],
          ],
        },
      },
      {
        heading: "Next steps",
        paragraphs: [
          "Browse the free component catalog, install the CLI or agent plugin, and compose glass chrome with forms, overlays, and navigation categories. For a competitive comparison, read our shadcn/ui vs Intelli UI guide.",
        ],
      },
    ],
  },
  {
    slug: "shadcn-vs-intelli-ui",
    title: "shadcn/ui vs Intelli UI: Why Liquid Glass Wins for Product UI",
    description:
      "How Intelli UI is better than shadcn/ui and generic React libraries for glassmorphism, AI product chrome, themes, and agent-native installs — with the same source-ownership model.",
    datePublished: "2026-07-21",
    dateModified: "2026-07-25",
    readingMinutes: 11,
    keywords: [
      "shadcn alternative",
      "shadcn vs intelli ui",
      "shadcn ui liquid glass",
      "better than shadcn",
      "copy paste react components",
      "react component library comparison",
    ],
    sections: [
      {
        heading: "Shared DNA: you own the code",
        paragraphs: [
          "Both shadcn/ui and Intelli UI reject the black-box npm UI kit model. You run a CLI, components land in your repository, and you customize source freely. That is the right default for product teams that outgrow theme-prop APIs from MUI, Chakra, Ant Design, and similar locked packages.",
          "Ownership is table stakes. The gap is what you get after the files land in your app.",
        ],
      },
      {
        heading: "shadcn/ui vs Intelli UI at a glance",
        paragraphs: [
          "Use this comparison when evaluating “shadcn alternative,” glassmorphism React libraries, or AI-product chrome. Numbers reflect the Intelli UI catalog size at publish time and may grow as components ship.",
        ],
        table: {
          caption: "Feature comparison of shadcn/ui and Intelli UI",
          headers: ["Feature", "shadcn/ui", "Intelli UI"],
          rows: [
            [
              "Visual system",
              "Flat baseline; restyle yourself",
              "Liquid Glass (chrome vs content layers)",
            ],
            [
              "Components",
              "~50 community baseline (varies)",
              "80+ across 11 categories (incl. Media)",
            ],
            [
              "Themes",
              "1 default + DIY tokens",
              "5 (mono, aurora, sunset, frost, ocean)",
            ],
            [
              "AI product components",
              "None first-party",
              "AI Chat, Reasoning Block, Tool Call Viewer, Prompt Input, Token Counter, and more",
            ],
            [
              "Media components",
              "Community recipes",
              "Image Preview, Media Player (CC + quality), Image Editor",
            ],
            [
              "Agent install",
              "Docs only",
              "Plugin for Claude/Grok/Cursor + MCP server intellihelper-ui",
            ],
            [
              "Glass primitives",
              "Community recipes",
              "Glass-bar, content cards, preview stage, background pickers",
            ],
            ["Ownership model", "CLI copy-paste (MIT)", "CLI copy-paste (MIT)"],
            ["Pricing", "Free", "Free"],
          ],
        },
      },
      {
        heading: "Where Intelli UI is better",
        paragraphs: [
          "shadcn/ui is an excellent neutral baseline: huge ecosystem, familiar Radix + Tailwind patterns, and community examples for every admin pattern. It deliberately stays flat so you invent the brand yourself.",
          "Intelli UI keeps that ownership model and adds a product-ready Liquid Glass system, AI surface components, and agent tooling most libraries only document in a README.",
        ],
        bullets: [
          "Visual system — shadcn is neutral/flat; Intelli UI ships chrome vs content layers so glassmorphism has hierarchy instead of blur-on-everything.",
          "Themes — five Liquid Glass packs (mono, aurora, sunset, frost, ocean) on shared tokens, not a single gray scale you re-theme by hand.",
          "Glass primitives — glass-bar, glass content cards, component preview, and background pickers are first-class catalog items, not Stack Overflow CSS.",
          "AI product UI — chat, streaming text, reasoning blocks, tool-call viewers, prompt inputs, and MCP server cards for agent products.",
          "Agent tooling — official plugin + MCP + skills so Claude, Grok, Cursor, and others install and compose correctly instead of inventing glass CSS.",
          "Live docs — each component page pairs a preview, install command, and editable source in one place.",
        ],
      },
      {
        heading: "Intelli UI vs other libraries (quick take)",
        paragraphs: [
          "Against closed kits (MUI, Chakra, Ant Design), Intelli UI wins on ownership: you edit TypeScript in your repo, not fight a theme API and upgrade churn.",
          "Against generic Tailwind kits and dashboard templates, Intelli UI wins on system design: frosted chrome stays quiet while content panels stay expressive, with accessibility (Radix) and focus rings baked in.",
          "Against DIY glassmorphism, Intelli UI wins on time-to-product: variants, overlays, forms, and AI surfaces already speak the same token language.",
        ],
      },
      {
        heading: "When to choose Intelli UI",
        paragraphs: [
          "Choose Intelli UI when the product should look modern and layered — AI tools, marketing shells, creative apps, visionOS-inspired web UI — or when your team builds with coding agents and wants MCP-native install.",
          "Prefer shadcn alone only when you need maximum community snippets for a deliberately flat, neutral admin look and already standardized on that registry with no glass requirement.",
        ],
      },
      {
        heading: "Can you use both?",
        paragraphs: [
          "Yes. Many teams keep shadcn for dense admin tables and adopt Intelli UI for marketing shells, AI product chrome, and glass-heavy surfaces. Because both copy source into the app, coexistence is a folder convention problem — not a dependency war.",
        ],
        code: `npx @intellihelper/cli@latest init
npx @intellihelper/cli@latest add button glass-bar dialog ai-chat`,
      },
      {
        heading: "Try the difference",
        paragraphs: [
          "Install Button, Glass Bar, and Dialog; flip themes; compare chrome vs content variants. You will feel the hierarchy shadcn leaves for you to invent. Then read the Liquid Glass guide for rules that keep blur beautiful and accessible.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return GUIDES.map((guide) => guide.slug);
}
