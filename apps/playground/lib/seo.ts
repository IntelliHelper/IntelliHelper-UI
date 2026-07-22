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
export const AGENT_SKILLS_URL =
  "https://github.com/IntelliHelper/agent-skills";
export const AGENT_SKILLS_REPO = "IntelliHelper/agent-skills";
export const REGISTRY_URL = "https://ui.intellihelper.in/r/registry.json";
export const CLI_PACKAGE = "@intellihelper/cli";

export const DEFAULT_TITLE =
  "Intelli UI — Free Liquid Glass React Components for Next.js & Tailwind CSS";

/** ~155 chars: value prop + proof + CTA for SERP CTR */
export const DEFAULT_DESCRIPTION =
  "80+ free Liquid Glass React components for Next.js & Tailwind CSS. Live previews, copy-paste source, CLI install. Build glassmorphism UIs you own — shadcn-style workflow.";

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
  "agent skills",
  "claude code plugin",
  "grok plugin",
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
  const title = `${item.title} React Component — Free Liquid Glass UI for Next.js`;
  const description = trimMetaDescription(
    `${item.description} Free ${item.title} React component for Next.js & Tailwind CSS. Live preview + source. Install: npx ${CLI_PACKAGE} add ${item.slug}.`,
  );

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
      "free react component",
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
  const title = `${meta.label} React Components — Free Liquid Glass UI`;
  const description = trimMetaDescription(
    `${meta.description}. Browse ${count} free ${meta.label.toLowerCase()} Liquid Glass components for React, Next.js & Tailwind — CLI install, live previews, full source ownership.`,
  );

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
      `glassmorphism ${meta.label.toLowerCase()}`,
      "liquid glass ui",
      "free react components",
      "component category",
    ],
    type: "website",
    imagePath: `/categories/${category}/opengraph-image`,
    imageAlt: `${meta.label} components — Intelli UI`,
  });
}

/** Keep SERP snippets in the high-CTR 150–160 char band when possible. */
export function trimMetaDescription(text: string, max = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const sliced = normalized.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 120 ? sliced.slice(0, lastSpace) : sliced).trimEnd()}…`;
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

> ${SITE_NAME} by ${BRAND_NAME} is a Liquid Glass component library for React and Next.js. Copy-paste accessible Tailwind components you own in your codebase. Includes a CLI (\`${CLI_PACKAGE}\`), shadcn-compatible registry, an official agent plugin (\`${AGENT_SKILLS_REPO}\`), and an MCP server (\`intellihelper-ui\`) for AI coding agents. Open source. Open code. AI-ready.

## Overview

- [Home](${absoluteUrl("/")}): Marketing landing for Liquid Glass React components, CLI, and agent tooling.
- [Components](${absoluteUrl("/components")}): Full component catalog with live previews, search, and install commands.
- [Getting started](${absoluteUrl("/getting-started")}): Install with the CLI, agent plugin, or MCP clients (Cursor, Claude, VS Code, Codex, OpenCode, Grok).
- [Guides](${absoluteUrl("/guides")}): Liquid Glass tutorials and shadcn comparison articles.
- [Agent plugin](${absoluteUrl("/getting-started#plugin")}): One-step install for Claude Code, Grok, Codex, Gemini (skills + MCP + commands).
- [MCP](${absoluteUrl("/getting-started#mcp")}): Tools-only setup for coding agents.
- [HTML sitemap](${absoluteUrl("/sitemap")}): Human-readable index of every public page.
- [XML sitemap](${absoluteUrl("/sitemap.xml")}): Machine-readable sitemap for crawlers.
- [RSS feed](${absoluteUrl("/rss.xml")}): Component, guides, and docs feed.
- [Registry](${REGISTRY_URL}): JSON registry of installable components.
- [GitHub](${GITHUB_URL}): Source repository.
- [Agent skills](${AGENT_SKILLS_URL}): Official agent plugin repository.

## Installation

\`\`\`bash
npx ${CLI_PACKAGE}@latest init
npx ${CLI_PACKAGE}@latest add button card dialog
npx ${CLI_PACKAGE}@latest mcp init --client cursor

# Agent plugin (skills + MCP + slash commands)
claude plugin marketplace add ${AGENT_SKILLS_REPO}
grok plugin install ${AGENT_SKILLS_REPO} --trust
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
- Agent plugin: \`${AGENT_SKILLS_REPO}\` (plugin id \`intellihelper-ui\`)
- MCP server name: \`intellihelper-ui\`
- Primary keywords: liquid glass, glass morphism, React UI, Next.js components, Tailwind, shadcn alternative, agent skills, MCP
`;
}
