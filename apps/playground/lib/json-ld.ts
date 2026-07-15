import {
  CATALOG,
  CATEGORY_META,
  type CatalogItem,
  type ComponentCategory,
} from "./catalog";
import {
  absoluteUrl,
  BRAND_NAME,
  CLI_PACKAGE,
  DEFAULT_DESCRIPTION,
  GITHUB_URL,
  SITE_NAME,
  SITE_URL,
} from "./seo";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/intellihelper.png"),
      width: 500,
      height: 500,
    },
    sameAs: [GITHUB_URL],
    foundingDate: "2025",
    description:
      "IntelliHelper builds Liquid Glass UI tools and AI-ready component infrastructure for modern React apps.",
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: [BRAND_NAME, "IntelliHelper UI", "IntelliHelper UI Components"],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareApplicationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "UI Component Library",
    operatingSystem: "Web, macOS, Windows, Linux",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    downloadUrl: absoluteUrl("/getting-started"),
    installUrl: absoluteUrl("/getting-started"),
    softwareVersion: "latest",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    codeRepository: GITHUB_URL,
    programmingLanguage: ["TypeScript", "JavaScript"],
    runtimePlatform: "React, Next.js",
    featureList: [
      "Liquid Glass design system",
      `${CATALOG.length}+ React components`,
      "Next.js and Tailwind CSS",
      `CLI install with npx ${CLI_PACKAGE}`,
      "MCP server for AI coding agents (intellihelper-ui)",
      "Live component previews and source",
      "Copy-paste ownership of component code",
      "Accessible primitives and keyboard support",
    ],
    keywords: [
      "liquid glass",
      "react components",
      "next.js",
      "tailwind css",
      "shadcn alternative",
      "design system",
    ].join(", "),
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
  type = "WebPage",
}: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "FAQPage" | "TechArticle";
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#software` },
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function gettingStartedJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Install IntelliHelper UI components",
    description:
      "Add Liquid Glass components to a Next.js project using the IntelliHelper CLI, or connect AI agents via the intellihelper-ui MCP server.",
    totalTime: "PT5M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    tool: [
      { "@type": "HowToTool", name: "IntelliHelper CLI" },
      { "@type": "HowToTool", name: "IntelliHelper UI MCP (intellihelper-ui)" },
      { "@type": "HowToTool", name: "Next.js" },
      { "@type": "HowToTool", name: "Tailwind CSS" },
      { "@type": "HowToTool", name: "Node.js" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Initialize IntelliHelper UI",
        text: `Run npx ${CLI_PACKAGE}@latest init in your Next.js project.`,
        url: absoluteUrl("/getting-started"),
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Add components",
        text: `Run npx ${CLI_PACKAGE}@latest add followed by component names such as button, card, or tabs.`,
        url: absoluteUrl("/getting-started"),
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Connect MCP for AI agents",
        text: `Run npx ${CLI_PACKAGE}@latest mcp init --client cursor (or claude, vscode, codex, opencode) to wire the intellihelper-ui MCP server into your coding agent.`,
        url: absoluteUrl("/getting-started#mcp"),
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Customize variants",
        text: "Edit the copied source files and use exported CVA helpers, className slots, and data-slot hooks.",
        url: absoluteUrl("/getting-started"),
      },
    ],
  };
}

export function gettingStartedFaqJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Intelli UI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Intelli UI by IntelliHelper is a Liquid Glass component library for React and Next.js. Components are installed into your codebase with a CLI so you fully own and customize the source.",
        },
      },
      {
        "@type": "Question",
        name: "How do I install IntelliHelper UI components?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Run npx ${CLI_PACKAGE}@latest init, then npx ${CLI_PACKAGE}@latest add button card dialog (or any component name from the catalog).`,
        },
      },
      {
        "@type": "Question",
        name: "Is Intelli UI a shadcn/ui alternative?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Intelli UI follows a copy-paste registry workflow similar to shadcn/ui, with a Liquid Glass visual system, CLI, and an MCP server for AI coding agents.",
        },
      },
      {
        "@type": "Question",
        name: "Does Intelli UI support AI coding agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The intellihelper-ui MCP server works with Cursor, Claude Code, VS Code, Codex, OpenCode, and Grok so agents can browse, search, and install components.",
        },
      },
      {
        "@type": "Question",
        name: "Is Intelli UI free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Components are free to install and use. You own the copied source files in your project.",
        },
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
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.label,
        item: absoluteUrl(`/categories/${item.category}`),
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

export function categoryBreadcrumbJsonLd(category: ComponentCategory): JsonLd {
  const meta = CATEGORY_META[category];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: meta.label,
        item: absoluteUrl(`/categories/${category}`),
      },
    ],
  };
}

export function componentPageJsonLd(item: CatalogItem): JsonLd {
  const category = CATEGORY_META[item.category];
  const url = absoluteUrl(`/components/${item.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: `${item.title} React Component`,
    alternativeHeadline: `${item.title} — Liquid Glass UI for Next.js`,
    description: item.description,
    url,
    mainEntityOfPage: url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: {
      "@type": "SoftwareSourceCode",
      name: `${item.title} React component`,
      description: item.description,
      programmingLanguage: "TypeScript",
      runtimePlatform: "React",
      codeRepository: GITHUB_URL,
      license: "https://opensource.org/licenses/MIT",
    },
    articleSection: category.label,
    keywords: [
      item.title,
      category.label,
      "Intelli UI",
      "Liquid Glass",
      "React",
      "Next.js",
      "Tailwind CSS",
      "component library",
    ].join(", "),
    image: absoluteUrl(`/components/${item.slug}/opengraph-image`),
  };
}

export function componentFaqJsonLd(item: CatalogItem): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I install the ${item.title} component?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Run npx ${CLI_PACKAGE}@latest add ${item.slug} in a project that has been initialized with IntelliHelper UI.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the ${item.title} component used for?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.description,
        },
      },
      {
        "@type": "Question",
        name: `Does ${item.title} work with Next.js and Tailwind CSS?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${item.title} is a Liquid Glass React component designed for Next.js and Tailwind CSS projects. Source files are copied into your app so you can customize variants freely.`,
        },
      },
    ],
  };
}

export function itemListJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} components`,
    description: `Complete catalog of ${CATALOG.length} Liquid Glass React components`,
    numberOfItems: CATALOG.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: CATALOG.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.description,
      url: absoluteUrl(`/components/${item.slug}`),
    })),
  };
}

export function categoryItemListJsonLd(category: ComponentCategory): JsonLd {
  const meta = CATEGORY_META[category];
  const items = CATALOG.filter((item) => item.category === category);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${meta.label} components`,
    description: meta.description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.description,
      url: absoluteUrl(`/components/${item.slug}`),
    })),
  };
}

/** Root graph for homepage — one script, cleaner crawler parsing */
export function homeGraphJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      websiteJsonLd(),
      softwareApplicationJsonLd(),
      webPageJsonLd({
        name: "Browse Liquid Glass React Components",
        description: DEFAULT_DESCRIPTION,
        path: "/",
        type: "CollectionPage",
      }),
      itemListJsonLd(),
    ].map((node) => {
      const rest = { ...node };
      delete rest["@context"];
      return rest;
    }),
  };
}
