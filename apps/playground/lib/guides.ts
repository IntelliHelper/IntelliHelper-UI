export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  code?: string;
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
    slug: "liquid-glass-ui-react",
    title: "Liquid Glass UI: What It Is & How to Build It in React",
    description:
      "Learn what Liquid Glass (glassmorphism) UI is, how chrome vs content layers work, and how to ship free React components for Next.js & Tailwind with Intelli UI.",
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
    readingMinutes: 8,
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
        ],
      },
      {
        heading: "Chrome layer vs content layer",
        paragraphs: [
          "Intelli UI splits surfaces into two mental layers:",
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
        heading: "Next steps",
        paragraphs: [
          "Browse the free component catalog, install the CLI or agent plugin, and compose glass chrome with forms, overlays, and navigation categories. For a competitive comparison, read our shadcn/ui vs Intelli UI guide.",
        ],
      },
    ],
  },
  {
    slug: "shadcn-vs-intelli-ui",
    title: "shadcn/ui vs Intelli UI: Which Copy-Paste Library Fits Your Stack?",
    description:
      "Compare shadcn/ui and Intelli UI — registry workflow, design systems, Liquid Glass, CLI, and MCP/agent support for React and Next.js teams.",
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
    readingMinutes: 7,
    keywords: [
      "shadcn alternative",
      "shadcn vs intelli ui",
      "shadcn ui liquid glass",
      "copy paste react components",
      "react component library comparison",
    ],
    sections: [
      {
        heading: "Shared DNA: you own the code",
        paragraphs: [
          "Both shadcn/ui and Intelli UI reject the black-box npm UI kit model. You run a CLI, components land in your repository, and you customize source freely. That is the right default for product teams that outgrow theme-prop APIs.",
        ],
      },
      {
        heading: "Where they differ",
        paragraphs: [
          "shadcn/ui is the default neutral system many teams already know — excellent docs, huge ecosystem, and a familiar Radix + Tailwind baseline.",
          "Intelli UI targets Liquid Glass: chrome vs content layers, frosted primitives, theme packs (mono, aurora, sunset, frost, ocean), and first-class AI agent workflows (official agent plugin + intellihelper-ui MCP).",
        ],
        bullets: [
          "Visual system — neutral (shadcn) vs Liquid Glass (Intelli UI).",
          "Agent tooling — Intelli UI ships skills, slash commands, and MCP for Claude Code, Grok, Cursor, and more.",
          "Catalog focus — Intelli UI includes glass-system primitives (glass-bar, glass content card, component preview) designed for glassmorphism products.",
        ],
      },
      {
        heading: "When to choose Intelli UI",
        paragraphs: [
          "Choose Intelli UI when glassmorphism is a product requirement, when you want free React components for Next.js & Tailwind with live previews out of the box, or when your team builds with coding agents and wants MCP-native install.",
          "Choose shadcn/ui when you need maximum community examples for a flat, neutral design language and already standardized on that registry.",
        ],
      },
      {
        heading: "Can you use both?",
        paragraphs: [
          "Yes. Many teams keep shadcn for dense admin patterns and adopt Intelli UI for marketing shells, AI product chrome, and glass-heavy surfaces. Because both copy source into the app, coexistence is a folder convention problem — not a dependency war.",
        ],
        code: `npx @intellihelper/cli@latest init
npx @intellihelper/cli@latest add button glass-bar dialog`,
      },
      {
        heading: "Try it",
        paragraphs: [
          "Install a Button and Dialog, flip themes, and compare chrome vs content variants. Then read the Liquid Glass guide for design-system rules that keep blur beautiful and accessible.",
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
