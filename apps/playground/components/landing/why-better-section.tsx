"use client";

import Link from "next/link";
import { useCallback, type ComponentType } from "react";
import { Badge } from "@intelli/ui/badge";
import { Button } from "@intelli/ui/button";
import {
  Box,
  Cluster,
  Flex,
  Grid,
  Split,
  Stack,
} from "@intelli/ui/layout";
import { LazyStage } from "./lazy-stage";
import {
  DesignSystemStage,
  GlassPrimitivesStage,
} from "./why-better-stages-light";

const WHY_BETTER = [
  {
    id: "design-system",
    title: "A real design system, not flat defaults",
    vs: "shadcn & most kits",
    body: "shadcn ships a neutral, flat baseline you restyle yourself. Intelli UI is Liquid Glass first — chrome vs content layers, frosted primitives, and five themes so product UI looks intentional on day one.",
    stage: "light" as const,
    LightStage: DesignSystemStage,
  },
  {
    id: "glass-primitives",
    title: "Glass primitives others leave to you",
    vs: "hand-rolled glass",
    body: "Glass-bar, content cards, preview stages, and background pickers ship first-class — not blog CSS glued onto a generic Button.",
    stage: "light" as const,
    LightStage: GlassPrimitivesStage,
  },
  {
    id: "ai-components",
    title: "AI product components included",
    vs: "generic catalogs",
    body: "Chat, streaming text, reasoning blocks, tool-call viewers, and prompt inputs ship ready. Build agent UIs without stitching half-styled demos.",
    stage: "heavy" as const,
    load: () =>
      import("./why-better-stages-heavy").then((m) => ({
        default: m.AiComponentsStage,
      })),
  },
  {
    id: "agents",
    title: "Agents that know the system",
    vs: "docs-only libraries",
    body: "Official plugin + MCP teach Claude, Grok, Cursor, and others to install correctly and respect chrome vs content.",
    stage: "heavy" as const,
    load: () =>
      import("./why-better-stages-heavy").then((m) => ({
        default: m.AgentsStage,
      })),
  },
  {
    id: "source",
    title: "You own the source",
    vs: "black-box UI kits",
    body: "CLI copies TypeScript into your repo — same ownership as shadcn, without package lock-in from MUI, Chakra, or Ant.",
    stage: "heavy" as const,
    load: () =>
      import("./why-better-stages-heavy").then((m) => ({
        default: m.SourceOwnershipStage,
      })),
  },
  {
    id: "live-previews",
    title: "Live previews + install",
    vs: "docs-heavy ecosystems",
    body: "Every catalog page pairs a live demo, install command, and editable source — less tab-hopping between Storybook, npm, and Figma.",
    stage: "heavy" as const,
    load: () =>
      import("./why-better-stages-heavy").then((m) => ({
        default: m.LivePreviewsStage,
      })),
  },
] as const;

const COMPARISON_ROWS = [
  {
    capability: "Visual system",
    other: "Neutral / flat; you invent glass",
    us: "Liquid Glass chrome + content layers",
  },
  {
    capability: "Themes",
    other: "DIY tokens or one default palette",
    us: "Mono, aurora, sunset, frost, ocean",
  },
  {
    capability: "Source ownership",
    other: "shadcn: yes · MUI/Chakra: package lock-in",
    us: "CLI copy-paste — you own every file",
  },
  {
    capability: "AI agent install",
    other: "Docs only; agents guess CSS",
    us: "Plugin + MCP + skills for major agents",
  },
  {
    capability: "AI product UI",
    other: "Build chat chrome yourself",
    us: "Chat, streaming, reasoning, tool calls",
  },
  {
    capability: "Glass primitives",
    other: "Backdrop-filter recipes on Stack Overflow",
    us: "Glass-bar, content cards, preview stage",
  },
] as const;

type WhyItem = (typeof WHY_BETTER)[number];

function FeatureStage({ item }: { item: WhyItem }) {
  const loadHeavy = useCallback(() => {
    if (item.stage !== "heavy") {
      return Promise.resolve({ default: (() => null) as ComponentType });
    }
    return item.load();
  }, [item]);

  if (item.stage === "light") {
    const Stage = item.LightStage;
    return <Stage />;
  }

  return <LazyStage load={loadHeavy} />;
}

function FeatureCard({
  item,
  className = "",
}: {
  item: WhyItem;
  className?: string;
}) {
  return (
    <Stack
      as="article"
      gap={0}
      className={`group relative h-full overflow-hidden rounded-3xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_42%,transparent)] shadow-[var(--glass-chrome-shadow)] backdrop-blur-[var(--glass-blur)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--primary)_32%,var(--glass-chrome-border))] hover:shadow-[0_20px_50px_color-mix(in_oklch,black_14%,transparent)] ${className}`}
    >
      <Flex
        align="center"
        justify="between"
        gap={2}
        className="border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--background)_45%,transparent)] px-3.5 py-2.5 sm:px-4"
      >
        <Badge variant="secondary" size="sm" className="max-w-[70%] truncate">
          vs {item.vs}
        </Badge>
        <Badge variant="outline" size="sm" className="shrink-0">
          Live UI
        </Badge>
      </Flex>

      <Box className="border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--background)_35%,transparent)]">
        <FeatureStage item={item} />
      </Box>

      <Stack gap={2} className="flex-1 p-5 sm:p-6">
        <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.body}
        </p>
      </Stack>
    </Stack>
  );
}

/**
 * Premium marketing section: live Intelli UI component stages + comparison table.
 * Light stages ship with the page; heavy demos hydrate only near viewport.
 */
export function WhyBetterSection() {
  const [designSystem, glassPrimitives, ...rest] = WHY_BETTER;

  return (
    <Stack
      as="section"
      gap={10}
      aria-labelledby="compare-heading"
      className="relative cv-auto"
    >
      <Box
        className="pointer-events-none absolute -left-16 top-24 hidden h-64 w-64 rounded-full opacity-40 blur-3xl md:block"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.16 270 / 0.35), transparent 70%)",
        }}
        aria-hidden
      />
      <Box
        className="pointer-events-none absolute -right-10 top-48 hidden h-56 w-56 rounded-full opacity-35 blur-3xl md:block"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.14 200 / 0.3), transparent 70%)",
        }}
        aria-hidden
      />

      <Split
        gap={4}
        align="end"
        className="relative flex-col sm:flex-row"
      >
        <Stack gap={3} className="max-w-2xl">
          <Cluster gap={2}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              vs shadcn &amp; other libraries
            </p>
            <Badge variant="secondary" size="sm">
              Built with Intelli UI
            </Badge>
          </Cluster>
          <h2
            id="compare-heading"
            className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl lg:text-4xl"
          >
            Why teams pick Intelli UI instead
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Same copy-paste ownership as shadcn — then we go further. Every card
            below is real Intelli UI: Liquid Glass chrome, AI components, and
            agent tooling generic kits do not ship.
          </p>
        </Stack>
        <Cluster gap={2} className="shrink-0 self-start sm:self-auto">
          <Button asChild variant="primary" size="sm">
            <Link href="/guides/shadcn-vs-intelli-ui">
              shadcn vs Intelli UI
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/components">Browse components</Link>
          </Button>
        </Cluster>
      </Split>

      <Grid cols={1} lgCols={2} gap={4} className="relative lg:gap-5">
        <FeatureCard item={designSystem} />
        <FeatureCard item={glassPrimitives} />
      </Grid>

      <Grid as="ul" cols={1} smCols={2} gap={4} className="relative lg:gap-5">
        {rest.map((item) => (
          <li key={item.id} className="min-h-0">
            <FeatureCard item={item} className="lg:min-h-full" />
          </li>
        ))}
      </Grid>

      <Box className="relative overflow-hidden rounded-3xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] shadow-[var(--glass-chrome-shadow)] backdrop-blur-[var(--glass-blur)]">
        <Box className="border-b border-[var(--glass-chrome-border)] px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Side-by-side
          </p>
          <h3 className="mt-1 text-sm font-medium text-foreground">
            What you get compared to typical kits
          </h3>
        </Box>
        <Box className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Intelli UI compared to typical UI kits and shadcn/ui on visual
              system, themes, source ownership, AI agent install, AI product UI,
              and glass primitives
            </caption>
            <thead>
              <tr className="border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--background)_40%,transparent)]">
                <th
                  scope="col"
                  className="px-4 py-3 font-medium text-muted-foreground md:px-5"
                >
                  Capability
                </th>
                <th
                  scope="col"
                  className="border-l border-[var(--glass-chrome-border)] px-4 py-3 font-medium text-muted-foreground md:px-5"
                >
                  Typical UI kits / shadcn
                </th>
                <th
                  scope="col"
                  className="border-l border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--primary)_8%,transparent)] px-4 py-3 font-semibold text-foreground md:px-5"
                >
                  Intelli UI
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr
                  key={row.capability}
                  className="border-b border-[var(--glass-chrome-border)] last:border-b-0"
                >
                  <th
                    scope="row"
                    className="px-4 py-3.5 font-medium text-foreground md:px-5"
                  >
                    {row.capability}
                  </th>
                  <td className="border-l border-[var(--glass-chrome-border)] px-4 py-3.5 text-muted-foreground md:px-5">
                    {row.other}
                  </td>
                  <td className="border-l border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--primary)_5%,transparent)] px-4 py-3.5 font-medium text-foreground md:px-5">
                    {row.us}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <Flex
          direction="column"
          gap={3}
          className="border-t border-[var(--glass-chrome-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <p className="text-sm text-muted-foreground">
            Full write-up: when to pick Intelli UI vs shadcn for glass product
            UI.
          </p>
          <Button asChild variant="primary" size="sm" className="shrink-0">
            <Link href="/guides/shadcn-vs-intelli-ui">Read comparison guide</Link>
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
}
