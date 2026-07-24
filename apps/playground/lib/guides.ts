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
    title: "shadcn/ui vs Intelli UI: Why Liquid Glass Wins for Product UI",
    description:
      "How Intelli UI is better than shadcn/ui and generic React libraries for glassmorphism, AI product chrome, themes, and agent-native installs — with the same source-ownership model.",
    datePublished: "2026-07-21",
    dateModified: "2026-07-24",
    readingMinutes: 9,
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
