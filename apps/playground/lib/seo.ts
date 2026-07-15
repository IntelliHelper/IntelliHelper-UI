import type { Metadata } from "next";
import type { CatalogItem, ComponentCategory } from "./catalog";
import { CATEGORY_META, CATALOG } from "./catalog";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ui.intellihelper.in";

export const SITE_NAME = "Intelli UI";
export const BRAND_NAME = "IntelliHelper";
export const LOGO_PATH = "/intellihelper.png";
export const OG_IMAGE_PATH = "/opengraph-image";
export const GITHUB_URL = "https://github.com/IntelliHelper/IntelliHelper-UI";
export const REGISTRY_URL = "https://ui.intellihelper.in/r/registry.json";
export const CLI_PACKAGE = "@intellihelper/cli";

export const DEFAULT_TITLE =
  "Intelli UI — Liquid Glass React Components for Next.js & Tailwind";

export const DEFAULT_DESCRIPTION =
  "Intelli UI is a Liquid Glass component library for React and Next.js. Copy-paste 40+ Tailwind components with live previews, CLI install (npx @intellihelper/cli), MCP for AI agents, and full source ownership — a modern shadcn-style workflow with glass design.";

export const DEFAULT_KEYWORDS = [
  "IntelliHelper",
  "Intelli UI",
  "liquid glass ui",
  "liquid glass components",
  "glass morphism components",
  "glassmorphism react",
  "react component library",
  "next.js ui components",
  "next.js tailwind components",
  "tailwind component library",
  "shadcn ui alternative",
  "shadcn alternative liquid glass",
  "copy paste react components",
  "ui kit",
  "design system",
  "radix ui components",
  "mcp ui components",
  "intellihelper-ui",
  "npx @intellihelper/cli",
  "react 19 components",
];

type CreatePageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
  absoluteTitle?: boolean;
  imagePath?: string;
  imageAlt?: string;
};

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

function resolveOgImage(imagePath = OG_IMAGE_PATH, imageAlt?: string) {
  return {
    url: absoluteUrl(imagePath),
    width: 1200,
    height: 630,
    alt: imageAlt ?? `${SITE_NAME} — Liquid Glass component library`,
    type: "image/png" as const,
  };
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
  noIndex = false,
  absoluteTitle = false,
  imagePath = OG_IMAGE_PATH,
  imageAlt,
}: CreatePageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const pageTitle = title;
  const ogImage = resolveOgImage(imagePath, imageAlt ?? pageTitle);

  return {
    title: absoluteTitle ? { absolute: pageTitle } : pageTitle,
    description,
    keywords: [...new Set([...DEFAULT_KEYWORDS, ...keywords])],
    authors: [{ name: BRAND_NAME, url: SITE_URL }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    category: "technology",
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": absoluteUrl("/rss.xml"),
      },
    },
    openGraph: {
      type,
      url,
      title: pageTitle,
      description,
      siteName: `${SITE_NAME} by ${BRAND_NAME}`,
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage.url],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function createComponentMetadata(item: CatalogItem): Metadata {
  const category = CATEGORY_META[item.category];
  const path = `/components/${item.slug}`;
  const title = `${item.title} React Component — Liquid Glass UI`;
  const description = `${item.description} Free ${item.title} component for React & Next.js with Tailwind CSS. Install via npx ${CLI_PACKAGE} add ${item.slug}. Live preview, source code, and Liquid Glass variants.`;

  return createPageMetadata({
    title,
    description,
    path,
    keywords: [
      item.title,
      item.slug,
      category.label,
      `${item.title} react component`,
      `${item.title} next.js`,
      `${item.title} tailwind`,
      `${item.title} component`,
      `${item.slug} shadcn alternative`,
      "liquid glass",
      "glass morphism",
      "next.js component",
      "radix ui",
      "copy paste component",
    ],
    type: "article",
    imagePath: `/components/${item.slug}/opengraph-image`,
    imageAlt: `${item.title} — Intelli UI Liquid Glass component`,
  });
}

export function createCategoryMetadata(category: ComponentCategory): Metadata {
  const meta = CATEGORY_META[category];
  const count = CATALOG.filter((item) => item.category === category).length;
  const path = `/categories/${category}`;
  const title = `${meta.label} Components — Liquid Glass React UI`;
  const description = `${meta.description}. Browse ${count} ${meta.label.toLowerCase()} components in Intelli UI — free React + Next.js + Tailwind components with CLI install and live previews.`;

  return createPageMetadata({
    title,
    description,
    path,
    keywords: [
      meta.label,
      `${meta.label} components`,
      `${meta.label.toLowerCase()} react components`,
      `${meta.label.toLowerCase()} next.js`,
      `${meta.label.toLowerCase()} tailwind`,
      "liquid glass ui",
      "component category",
    ],
    type: "website",
    imagePath: `/categories/${category}/opengraph-image`,
    imageAlt: `${meta.label} components — Intelli UI`,
  });
}

export function createComponentDescription(item: CatalogItem): string {
  return `${item.description} Free ${item.title} component for React & Next.js with Tailwind CSS. Install via npx ${CLI_PACKAGE} add ${item.slug}.`;
}

export function buildLlmsText(): string {
  const grouped = Object.entries(CATEGORY_META)
    .map(([key, meta]) => {
      const items = CATALOG.filter((item) => item.category === key);
      if (items.length === 0) return "";
      const lines = items
        .map(
          (item) =>
            `- [${item.title}](${absoluteUrl(`/components/${item.slug}`)}): ${item.description}`,
        )
        .join("\n");
      return `### ${meta.label}\n\n${lines}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `# ${SITE_NAME}

> ${SITE_NAME} by ${BRAND_NAME} is a Liquid Glass component library for React and Next.js. Copy-paste accessible Tailwind components you own in your codebase. Includes a CLI (\`${CLI_PACKAGE}\`), shadcn-compatible registry, and an MCP server (\`intellihelper-ui\`) for AI coding agents. Open source. Open code. AI-ready.

## Overview

- [Home](${absoluteUrl("/")}): Browse the full component catalog with live previews.
- [Getting started](${absoluteUrl("/getting-started")}): Install with the CLI or connect MCP clients (Cursor, Claude, VS Code, Codex, OpenCode, Grok).
- [HTML sitemap](${absoluteUrl("/sitemap")}): Human-readable index of every public page.
- [XML sitemap](${absoluteUrl("/sitemap.xml")}): Machine-readable sitemap for crawlers.
- [RSS feed](${absoluteUrl("/rss.xml")}): Component and docs feed.
- [Registry](${REGISTRY_URL}): JSON registry of installable components.
- [GitHub](${GITHUB_URL}): Source repository.

## Installation

\`\`\`bash
npx ${CLI_PACKAGE}@latest init
npx ${CLI_PACKAGE}@latest add button card dialog
npx ${CLI_PACKAGE}@latest mcp init --client cursor
\`\`\`

## Categories

${Object.entries(CATEGORY_META)
  .map(
    ([key, meta]) =>
      `- [${meta.label}](${absoluteUrl(`/categories/${key}`)}): ${meta.description}`,
  )
  .join("\n")}

## Components

${grouped}

## Optional

- Prefer \`llms-full.txt\` style depth: each component page includes install command, description, category, and live demo.
- MCP server name: \`intellihelper-ui\`
- Primary keywords: liquid glass, glass morphism, React UI, Next.js components, Tailwind, shadcn alternative
`;
}
