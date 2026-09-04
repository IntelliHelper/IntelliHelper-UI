"use client";

import {
  Box,
  Button,
  Center,
  Cluster,
  Container,
  Flex,
  Grid,
  Spacer,
  Split,
  Stack,
} from "@intelli/ui";
import { Badge } from "@intelli/ui/badge";

const surface =
  "rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%, var(--glass-mix-into))] p-3 text-sm text-muted-foreground";

export function LayoutStackDemo() {
  return (
    <Stack gap={3} className="w-full max-w-sm">
      <p className="text-sm font-medium text-foreground">Stack (vertical)</p>
      <Box as="div" className={surface}>
        Item one
      </Box>
      <Box as="div" className={surface}>
        Item two
      </Box>
      <Box as="div" className={surface}>
        Item three
      </Box>
    </Stack>
  );
}

export function LayoutClusterDemo() {
  return (
    <Stack gap={3} className="w-full max-w-md">
      <p className="text-sm font-medium text-foreground">Cluster (wrap)</p>
      <Cluster gap={2}>
        <Badge variant="secondary" size="sm">
          Stack
        </Badge>
        <Badge variant="outline" size="sm">
          Cluster
        </Badge>
        <Badge variant="outline" size="sm">
          Grid
        </Badge>
        <Badge variant="outline" size="sm">
          Flex
        </Badge>
        <Badge variant="outline" size="sm">
          Center
        </Badge>
        <Badge variant="outline" size="sm">
          Split
        </Badge>
        <Badge variant="outline" size="sm">
          Container
        </Badge>
        <Badge variant="outline" size="sm">
          Box
        </Badge>
        <Badge variant="outline" size="sm">
          Spacer
        </Badge>
      </Cluster>
      <Cluster gap={3}>
        <Button size="sm" variant="primary">
          Primary
        </Button>
        <Button size="sm" variant="outline">
          Outline
        </Button>
        <Button size="sm" variant="ghost">
          Ghost
        </Button>
      </Cluster>
    </Stack>
  );
}

export function LayoutGridDemo() {
  return (
    <Stack gap={3} className="w-full">
      <p className="text-sm font-medium text-foreground">
        Grid (responsive columns)
      </p>
      <Grid cols={1} smCols={2} mdCols={3} gap={3}>
        {["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta"].map((label) => (
          <Box key={label} className={surface}>
            {label}
          </Box>
        ))}
      </Grid>
    </Stack>
  );
}

export function LayoutSplitDemo() {
  return (
    <Stack gap={3} className="w-full max-w-lg">
      <p className="text-sm font-medium text-foreground">
        Split + Spacer + Center
      </p>
      <Split
        gap={3}
        className="rounded-xl border border-[var(--glass-chrome-border)] p-4"
      >
        <Stack gap={1}>
          <p className="text-sm font-semibold text-foreground">Section title</p>
          <p className="text-xs text-muted-foreground">
            Toolbar-style header with trailing action
          </p>
        </Stack>
        <Button size="sm" variant="outline">
          Action
        </Button>
      </Split>
      <Flex
        align="center"
        className="rounded-xl border border-[var(--glass-chrome-border)] px-3 py-2"
      >
        <span className="text-sm text-foreground">Left</span>
        <Spacer />
        <span className="text-sm text-muted-foreground">Right via Spacer</span>
      </Flex>
      <Center
        className="h-24 rounded-xl border border-dashed border-[var(--glass-chrome-border)]"
        gap={2}
      >
        <Badge variant="chrome" size="sm">
          Centered
        </Badge>
        <span className="text-xs text-muted-foreground">content block</span>
      </Center>
    </Stack>
  );
}

export function LayoutContainerDemo() {
  return (
    <Container
      size="sm"
      padded={false}
      className="rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_28%, var(--glass-mix-into))] p-4"
    >
      <Stack gap={2}>
        <p className="text-sm font-medium text-foreground">Container</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Constrains content width (`size=&quot;sm&quot;` → max-w-xl) without
          hand-written mx-auto / max-w utilities on every page.
        </p>
      </Stack>
    </Container>
  );
}

/** Combined showcase — not used in per-component examples. */
export function LayoutPrimitivesDemo() {
  return (
    <Stack gap={8} className="w-full">
      <Grid cols={1} lgCols={2} gap={8}>
        <LayoutStackDemo />
        <LayoutClusterDemo />
      </Grid>
      <LayoutGridDemo />
      <Grid cols={1} lgCols={2} gap={8}>
        <LayoutSplitDemo />
        <LayoutContainerDemo />
      </Grid>
    </Stack>
  );
}
