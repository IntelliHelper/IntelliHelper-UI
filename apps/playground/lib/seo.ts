import type { Metadata } from "next";
import type { CatalogItem } from "./catalog";
import { CATEGORY_META } from "./catalog";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ui.intellihelper.in";

export const SITE_NAME = "Intelli UI";
export const BRAND_NAME = "IntelliHelper";
export const LOGO_PATH = "/intellihelper.png";

export const DEFAULT_TITLE =
  "Intelli UI — Liquid Glass Component Library for React & Next.js";

export const DEFAULT_DESCRIPTION =
  "Intelli UI by IntelliHelper is a Liquid Glass component library for React and Next.js. Browse 40+ copy-paste Tailwind components with live previews, CLI install, and full customization.";

export const DEFAULT_KEYWORDS = [
  "IntelliHelper",
  "Intelli UI",
  "liquid glass ui",
  "glass morphism components",
  "react component library",
  "next.js ui components",
  "tailwind component library",
  "shadcn ui alternative",
  "copy paste react components",
  "ui kit",
  "design system",
];

type CreatePageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
  noIndex = false,
  absoluteTitle = false,
}: CreatePageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const pageTitle = title;

  return {
    title: absoluteTitle ? { absolute: pageTitle } : pageTitle,
    description,
    keywords: [...new Set([...DEFAULT_KEYWORDS, ...keywords])],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title: pageTitle,
      description,
      siteName: `${SITE_NAME} by ${BRAND_NAME}`,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
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
  const description = `${item.description} Install the ${item.title} Liquid Glass component in your Next.js + Tailwind project with npx @intellihelper/cli.`;

  return createPageMetadata({
    title: `${item.title} Component`,
    description,
    path,
    keywords: [
      item.title,
      item.slug,
      category.label,
      `${item.title} react component`,
      `${item.title} tailwind`,
      "liquid glass",
      "glass morphism",
      "next.js component",
      "radix ui",
    ],
    type: "article",
  });
}

export function createComponentDescription(item: CatalogItem): string {
  return `${item.description} Install the ${item.title} Liquid Glass component in your Next.js + Tailwind project with npx @intellihelper/cli.`;
}