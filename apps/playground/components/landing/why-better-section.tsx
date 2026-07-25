import Link from "next/link";
import { Badge, Button } from "@intelli/ui";
import {
  AgentsStage,
  AiComponentsStage,
  DesignSystemStage,
  GlassPrimitivesStage,
  LivePreviewsStage,
  SourceOwnershipStage,
} from "./why-better-stages";

const WHY_BETTER = [
  {
    id: "design-system",
    title: "A real design system, not flat defaults",
    vs: "shadcn & most kits",
    body: "shadcn ships a neutral, flat baseline you restyle yourself. Intelli UI is Liquid Glass first — chrome vs content layers, frosted primitives, and five themes so product UI looks intentional on day one.",
    stage: DesignSystemStage,
  },
  {
    id: "glass-primitives",
    title: "Glass primitives others leave to you",
    vs: "hand-rolled glass",
    body: "Glass-bar, content cards, preview stages, and background pickers ship first-class — not blog CSS glued onto a generic Button.",
    stage: GlassPrimitivesStage,
  },
  {
    id: "ai-components",
    title: "AI product components included",
    vs: "generic catalogs",
    body: "Chat, streaming text, reasoning blocks, tool-call viewers, and prompt inputs ship ready. Build agent UIs without stitching half-styled demos.",
    stage: AiComponentsStage,
  },
  {
    id: "agents",
    title: "Agents that know the system",
    vs: "docs-only libraries",
    body: "Official plugin + MCP teach Claude, Grok, Cursor, and others to install correctly and respect chrome vs content.",
    stage: AgentsStage,
  },
  {
    id: "source",
    title: "You own the source",
    vs: "black-box UI kits",
    body: "CLI copies TypeScript into your repo — same ownership as shadcn, without package lock-in from MUI, Chakra, or Ant.",
    stage: SourceOwnershipStage,
  },
  {
    id: "live-previews",
    title: "Live previews + install",
    vs: "docs-heavy ecosystems",
    body: "Every catalog page pairs a live demo, install command, and editable source — less tab-hopping between Storybook, npm, and Figma.",
    stage: LivePreviewsStage,
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

function FeatureCard({
  item,
  className = "",
}: {
  item: (typeof WHY_BETTER)[number];
  className?: string;
}) {
  const Stage = item.stage;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_42%,transparent)] shadow-[var(--glass-chrome-shadow)] backdrop-blur-[var(--glass-blur)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--primary)_32%,var(--glass-chrome-border))] hover:shadow-[0_20px_50px_color-mix(in_oklch,black_14%,transparent)] ${className}`}
    >
      {/* Badges sit in a chrome header — never overlaid on the live demo */}
      <div className="flex items-center justify-between gap-2 border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--background)_45%,transparent)] px-3.5 py-2.5 sm:px-4">
        <Badge variant="secondary" size="sm" className="max-w-[70%] truncate">
          vs {item.vs}
        </Badge>
        <Badge variant="outline" size="sm" className="shrink-0">
          Live UI
        </Badge>
      </div>

      <div className="border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--background)_35%,transparent)]">
        <Stage />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
      </div>
    </article>
  );
}

/**
 * Premium marketing section: live Intelli UI component stages + comparison table.
 * Stages render real catalog components so the product sells itself.
 */
export function WhyBetterSection() {
  const [designSystem, glassPrimitives, ...rest] = WHY_BETTER;

  return (
    <section aria-labelledby="compare-heading" className="relative space-y-10">
      <div
        className="pointer-events-none absolute -left-16 top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.16 270 / 0.35), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 top-48 h-56 w-56 rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.14 200 / 0.3), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              vs shadcn &amp; other libraries
            </p>
            <Badge variant="secondary" size="sm">
              Built with Intelli UI
            </Badge>
          </div>
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
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 self-start sm:self-auto">
          <Button asChild variant="primary" size="sm">
            <Link href="/guides/shadcn-vs-intelli-ui">
              shadcn vs Intelli UI
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/components">Browse components</Link>
          </Button>
        </div>
      </div>

      <div className="relative grid gap-4 lg:grid-cols-2 lg:gap-5">
        <FeatureCard item={designSystem} />
        <FeatureCard item={glassPrimitives} />
      </div>

      <ul className="relative grid gap-4 sm:grid-cols-2 lg:gap-5">
        {rest.map((item) => (
          <li key={item.id} className="min-h-0">
            <FeatureCard item={item} className="lg:min-h-full" />
          </li>
        ))}
      </ul>

      <div className="relative overflow-hidden rounded-3xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] shadow-[var(--glass-chrome-shadow)] backdrop-blur-[var(--glass-blur)]">
        <div className="border-b border-[var(--glass-chrome-border)] px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Side-by-side
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            What you get compared to typical kits
          </p>
        </div>
        <div className="grid text-sm md:grid-cols-[1.1fr_1fr_1fr]">
          <div className="hidden border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--background)_40%,transparent)] px-4 py-3 font-medium text-muted-foreground md:block md:px-5">
            Capability
          </div>
          <div className="hidden border-b border-l border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--background)_40%,transparent)] px-4 py-3 font-medium text-muted-foreground md:block md:px-5">
            Typical UI kits / shadcn
          </div>
          <div className="hidden border-b border-l border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--primary)_8%,transparent)] px-4 py-3 font-semibold text-foreground md:block md:px-5">
            Intelli UI
          </div>

          {COMPARISON_ROWS.map((row, index, arr) => (
            <div key={row.capability} className="contents">
              <div
                className={`border-[var(--glass-chrome-border)] px-4 py-3.5 font-medium text-foreground md:border-b md:px-5 ${
                  index === arr.length - 1 ? "md:border-b-0" : ""
                } border-t md:border-t-0`}
              >
                {row.capability}
                <p className="mt-1 text-xs font-normal text-muted-foreground md:hidden">
                  Others: {row.other}
                </p>
                <p className="mt-1 text-xs font-normal text-foreground md:hidden">
                  Intelli: {row.us}
                </p>
              </div>
              <div
                className={`hidden border-l border-[var(--glass-chrome-border)] px-4 py-3.5 text-muted-foreground md:block md:border-b md:px-5 ${
                  index === arr.length - 1 ? "md:border-b-0" : ""
                }`}
              >
                {row.other}
              </div>
              <div
                className={`hidden border-l border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--primary)_5%,transparent)] px-4 py-3.5 font-medium text-foreground md:block md:border-b md:px-5 ${
                  index === arr.length - 1 ? "md:border-b-0" : ""
                }`}
              >
                {row.us}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-[var(--glass-chrome-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-muted-foreground">
            Full write-up: when to pick Intelli UI vs shadcn for glass product UI.
          </p>
          <Button asChild variant="primary" size="sm" className="shrink-0">
            <Link href="/guides/shadcn-vs-intelli-ui">Read comparison guide</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
