import { CATALOG, CATEGORY_META, type CatalogItem } from "./catalog";
import {
  absoluteUrl,
  BRAND_NAME,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./seo";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/icon"),
    sameAs: [],
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: BRAND_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    inLanguage: "en-US",
  };
}

export function softwareApplicationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    featureList: [
      "Liquid Glass design system",
      "40+ React components",
      "Next.js and Tailwind CSS",
      "CLI install with npx @intellihelper/cli",
      "Live component previews",
    ],
  };
}

export function gettingStartedJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Install Intelli UI components",
    description:
      "Add Liquid Glass components to a Next.js project using the IntelliHelper CLI.",
    step: [
      {
        "@type": "HowToStep",
        name: "Initialize Intelli UI",
        text: "Run npx @intellihelper/cli@latest init in your Next.js project.",
      },
      {
        "@type": "HowToStep",
        name: "Add components",
        text: "Run npx @intellihelper/cli@latest add followed by component names such as button, card, or tabs.",
      },
      {
        "@type": "HowToStep",
        name: "Customize variants",
        text: "Edit the copied source files and use exported CVA helpers, className slots, and data-slot hooks.",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "IntelliHelper CLI",
      },
      {
        "@type": "HowToTool",
        name: "Next.js",
      },
      {
        "@type": "HowToTool",
        name: "Tailwind CSS",
      },
    ],
  };
}

export function componentBreadcrumbJsonLd(item: CatalogItem): JsonLd {
  const category = CATEGORY_META[item.category];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Components",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.label,
        item: absoluteUrl(`/#${item.category}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.title,
        item: absoluteUrl(`/components/${item.slug}`),
      },
    ],
  };
}

export function componentPageJsonLd(item: CatalogItem): JsonLd {
  const category = CATEGORY_META[item.category];

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${item.title} Component`,
    description: item.description,
    url: absoluteUrl(`/components/${item.slug}`),
    inLanguage: "en-US",
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "SoftwareSourceCode",
      name: `${item.title} React component`,
      programmingLanguage: "TypeScript",
      runtimePlatform: "React",
    },
    keywords: [
      item.title,
      category.label,
      "Intelli UI",
      "Liquid Glass",
      "React",
      "Next.js",
      "Tailwind CSS",
    ].join(", "),
  };
}

export function itemListJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} components`,
    numberOfItems: CATALOG.length,
    itemListElement: CATALOG.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: absoluteUrl(`/components/${item.slug}`),
    })),
  };
}