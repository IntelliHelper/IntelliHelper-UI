import Link from "next/link";
import type { ReactNode } from "react";
import {
  Box,
  Cluster,
  Container,
  Flex,
  Grid,
  Stack,
} from "@intelli/ui/layout";
import { Separator } from "@intelli/ui/separator";
import { CATEGORY_META, CATEGORY_ORDER } from "../lib/catalog";
import { GITHUB_URL } from "../lib/seo";
import { BrandLogo } from "./brand-logo";
import { PlaygroundNav } from "./playground-nav";
import { ScrollToTopLazy } from "./scroll-to-top-lazy";

type PlaygroundShellProps = {
  children: ReactNode;
};

export function PlaygroundShell({ children }: PlaygroundShellProps) {
  return (
    <Box className="relative min-h-screen pb-10">
      <PlaygroundNav githubUrl={GITHUB_URL} />

      <Container
        as="main"
        id="main-content"
        size="xl"
        className="min-w-0 max-w-6xl"
      >
        {children}
      </Container>

      <Container as="footer" size="xl" className="mt-20 max-w-6xl">
        <Box className="glass-panel rounded-2xl p-6 md:p-8 [background-color:var(--glass-dialog-elevated-bg)]">
          <Grid cols={1} mdCols={12} gap={10}>
            <Stack gap={3} className="md:col-span-5">
              <Cluster gap={2.5}>
                <BrandLogo size={30} />
                <Stack gap={0}>
                  <p className="text-sm font-semibold text-foreground">
                    Intelli UI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by IntelliHelper
                  </p>
                </Stack>
              </Cluster>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Liquid Glass components for React and Next.js. Install with the
                CLI, own the source, and ship with agent tooling when you need
                it.
              </p>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Looking for the workspace app?{" "}
                <a
                  href="https://intellihelper.in"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  IntelliHelper
                </a>
              </p>
            </Stack>

            <Grid
              cols={2}
              smCols={3}
              gap={8}
              className="md:col-span-7"
            >
              <Box>
                <p className="text-xs font-semibold text-foreground">Product</p>
                <Stack
                  as="ul"
                  gap={2}
                  className="mt-3 text-sm text-muted-foreground"
                >
                  <li>
                    <Link
                      href="/"
                      className="transition-colors hover:text-foreground"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/components"
                      className="transition-colors hover:text-foreground"
                    >
                      Components
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/getting-started"
                      className="transition-colors hover:text-foreground"
                    >
                      Getting started
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guides"
                      className="transition-colors hover:text-foreground"
                    >
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guides/shadcn-vs-intelli-ui"
                      className="transition-colors hover:text-foreground"
                    >
                      vs shadcn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="transition-colors hover:text-foreground"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/getting-started#plugin"
                      className="transition-colors hover:text-foreground"
                    >
                      Agent plugin
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/getting-started#mcp"
                      className="transition-colors hover:text-foreground"
                    >
                      MCP
                    </Link>
                  </li>
                </Stack>
              </Box>

              <Box>
                <p className="text-xs font-semibold text-foreground">
                  Categories
                </p>
                <Stack
                  as="ul"
                  gap={2}
                  className="mt-3 text-sm text-muted-foreground"
                >
                  {CATEGORY_ORDER.slice(0, 6).map((category) => (
                    <li key={category}>
                      <Link
                        href={`/categories/${category}`}
                        className="transition-colors hover:text-foreground"
                      >
                        {CATEGORY_META[category].label}
                      </Link>
                    </li>
                  ))}
                </Stack>
              </Box>

              <Box className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-foreground">Resources</p>
                <Stack
                  as="ul"
                  gap={2}
                  className="mt-3 text-sm text-muted-foreground"
                >
                  <li>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-foreground"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/sitemap"
                      className="transition-colors hover:text-foreground"
                    >
                      Sitemap
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/llms.txt"
                      className="transition-colors hover:text-foreground"
                    >
                      llms.txt
                    </a>
                  </li>
                  <li>
                    <a
                      href="/rss.xml"
                      className="transition-colors hover:text-foreground"
                    >
                      RSS
                    </a>
                  </li>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Separator className="my-6" variant="subtle" />

          <Flex
            direction="column"
            gap={2}
            className="text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
          >
            <p>
              © {new Date().getFullYear()} IntelliHelper. Open source Liquid
              Glass UI.
            </p>
            {/* Full muted token (no /80) — WCAG contrast on frosted glass */}
            <p className="text-muted-foreground">
              Built for teams that ship product UI.
            </p>
          </Flex>
        </Box>
      </Container>

      <ScrollToTopLazy />
    </Box>
  );
}
