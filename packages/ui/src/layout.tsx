import { Slot } from "@radix-ui/react-slot";
import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import {
  layoutAlignClass,
  layoutColsClass,
  layoutGapClass,
  layoutJustifyClass,
  paddingClass,
  spacerSizeClass,
  type LayoutAlign,
  type LayoutCols,
  type LayoutGap,
  type LayoutJustify,
} from "./layout-utils";

export type {
  LayoutAlign,
  LayoutCols,
  LayoutGap,
  LayoutJustify,
} from "./layout-utils";
export {
  layoutAlignClass,
  layoutColsClass,
  layoutGapClass,
  layoutJustifyClass,
} from "./layout-utils";

/* ── Shared polymorphic props ───────────────────────────────────── */

type PolymorphicLayoutProps = {
  /**
   * Render as a different element (`section`, `ul`, `main`, …).
   * Ignored when `asChild` is true.
   */
  as?: ElementType;
  /**
   * Merge props onto the immediate child (Radix Slot) instead of wrapping.
   * Prefer this when the child already is the correct landmark element.
   */
  asChild?: boolean;
  children?: ReactNode;
};

type CommonLayoutProps = HTMLAttributes<HTMLElement> & PolymorphicLayoutProps;

function resolveComp(asChild: boolean | undefined, as: ElementType | undefined) {
  if (asChild) return Slot;
  return as ?? "div";
}

/* ── Box ─────────────────────────────────────────────────────────── */

export interface BoxProps extends CommonLayoutProps {
  /** Uniform padding using the shared spacing scale. */
  p?: LayoutGap;
}

const Box = forwardRef<HTMLElement, BoxProps>(
  ({ as, asChild = false, className, p, ...props }, ref) => {
    const Comp = resolveComp(asChild, as);
    return (
      <Comp
        ref={ref}
        data-slot="box"
        className={cn(p !== undefined && paddingClass[p], className)}
        {...props}
      />
    );
  },
);
Box.displayName = "Box";

/* ── Stack ───────────────────────────────────────────────────────── */

export interface StackProps extends CommonLayoutProps {
  /** Flex direction. Defaults to vertical (column). */
  direction?: "vertical" | "horizontal";
  /** Gap between children (Tailwind spacing scale). Defaults to 4. */
  gap?: LayoutGap;
  /** Cross-axis alignment (`items-*`). */
  align?: LayoutAlign;
  /** Main-axis distribution (`justify-*`). */
  justify?: LayoutJustify;
}

const Stack = forwardRef<HTMLElement, StackProps>(
  (
    {
      as,
      asChild = false,
      className,
      direction = "vertical",
      gap = 4,
      align,
      justify,
      ...props
    },
    ref,
  ) => {
    const Comp = resolveComp(asChild, as);
    return (
      <Comp
        ref={ref}
        data-slot="stack"
        data-direction={direction}
        className={cn(
          "flex",
          direction === "vertical" ? "flex-col" : "flex-row",
          layoutGapClass(gap),
          layoutAlignClass(align),
          layoutJustifyClass(justify),
          className,
        )}
        {...props}
      />
    );
  },
);
Stack.displayName = "Stack";

/* ── Cluster ─────────────────────────────────────────────────────── */

export interface ClusterProps extends CommonLayoutProps {
  /** Gap between wrapped items. Defaults to 2. */
  gap?: LayoutGap;
  /** Cross-axis alignment. Defaults to `center`. */
  align?: LayoutAlign;
  /** Main-axis distribution. Defaults to `start`. */
  justify?: LayoutJustify;
}

/**
 * Wrapping horizontal group — badges, button rows, tag chips.
 * Prefer Cluster over nested `flex flex-wrap` divs.
 */
const Cluster = forwardRef<HTMLElement, ClusterProps>(
  (
    {
      as,
      asChild = false,
      className,
      gap = 2,
      align = "center",
      justify = "start",
      ...props
    },
    ref,
  ) => {
    const Comp = resolveComp(asChild, as);
    return (
      <Comp
        ref={ref}
        data-slot="cluster"
        className={cn(
          "flex flex-wrap",
          layoutGapClass(gap),
          layoutAlignClass(align),
          layoutJustifyClass(justify),
          className,
        )}
        {...props}
      />
    );
  },
);
Cluster.displayName = "Cluster";

/* ── Grid ────────────────────────────────────────────────────────── */

export interface GridProps extends CommonLayoutProps {
  /** Base column count. Defaults to 1. */
  cols?: LayoutCols;
  /** `sm:` column count. */
  smCols?: LayoutCols;
  /** `md:` column count. */
  mdCols?: LayoutCols;
  /** `lg:` column count. */
  lgCols?: LayoutCols;
  /** Gap between cells. Defaults to 4. */
  gap?: LayoutGap;
  /** Cross-axis alignment of grid items. */
  align?: LayoutAlign;
  /** Inline-axis distribution of grid items. */
  justify?: LayoutJustify;
}

const Grid = forwardRef<HTMLElement, GridProps>(
  (
    {
      as,
      asChild = false,
      className,
      cols = 1,
      smCols,
      mdCols,
      lgCols,
      gap = 4,
      align,
      justify,
      ...props
    },
    ref,
  ) => {
    const Comp = resolveComp(asChild, as);
    return (
      <Comp
        ref={ref}
        data-slot="grid"
        className={cn(
          "grid",
          layoutColsClass(cols, smCols, mdCols, lgCols),
          layoutGapClass(gap),
          layoutAlignClass(align),
          layoutJustifyClass(justify),
          className,
        )}
        {...props}
      />
    );
  },
);
Grid.displayName = "Grid";

/* ── Flex ────────────────────────────────────────────────────────── */

export interface FlexProps extends CommonLayoutProps {
  /** Flex direction. Defaults to `row`. */
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  gap?: LayoutGap;
  align?: LayoutAlign;
  justify?: LayoutJustify;
  /** Allow items to wrap. */
  wrap?: boolean | "reverse";
  /** Grow to fill available space (`flex-1 min-w-0`). */
  grow?: boolean;
}

const directionClass = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
} as const;

/**
 * General-purpose flex container when Stack / Cluster / Split are too narrow.
 */
const Flex = forwardRef<HTMLElement, FlexProps>(
  (
    {
      as,
      asChild = false,
      className,
      direction = "row",
      gap,
      align,
      justify,
      wrap = false,
      grow = false,
      ...props
    },
    ref,
  ) => {
    const Comp = resolveComp(asChild, as);
    return (
      <Comp
        ref={ref}
        data-slot="flex"
        className={cn(
          "flex",
          directionClass[direction],
          wrap === true && "flex-wrap",
          wrap === "reverse" && "flex-wrap-reverse",
          grow && "min-w-0 flex-1",
          layoutGapClass(gap),
          layoutAlignClass(align),
          layoutJustifyClass(justify),
          className,
        )}
        {...props}
      />
    );
  },
);
Flex.displayName = "Flex";

/* ── Center ──────────────────────────────────────────────────────── */

export interface CenterProps extends CommonLayoutProps {
  /** Also center on the block axis (default true). */
  inline?: boolean;
  /** Minimum height utility — useful for empty/hero stages. */
  minH?: "none" | "full" | "screen" | "svh";
  gap?: LayoutGap;
}

const minHClass = {
  none: undefined,
  full: "min-h-full",
  screen: "min-h-screen",
  svh: "min-h-svh",
} as const;

/**
 * Centers children on both axes (or inline-only when `inline={false}`).
 */
const Center = forwardRef<HTMLElement, CenterProps>(
  (
    {
      as,
      asChild = false,
      className,
      inline = true,
      minH = "none",
      gap,
      ...props
    },
    ref,
  ) => {
    const Comp = resolveComp(asChild, as);
    return (
      <Comp
        ref={ref}
        data-slot="center"
        className={cn(
          "flex",
          inline ? "items-center justify-center" : "justify-center",
          minHClass[minH],
          layoutGapClass(gap),
          className,
        )}
        {...props}
      />
    );
  },
);
Center.displayName = "Center";

/* ── Split ───────────────────────────────────────────────────────── */

export interface SplitProps extends CommonLayoutProps {
  /** Gap when the row wraps on small screens. Defaults to 3. */
  gap?: LayoutGap;
  /** Cross-axis alignment. Defaults to `center`. */
  align?: LayoutAlign;
  /**
   * Allow wrapping (common for section headers with a trailing action).
   * Defaults to true.
   */
  wrap?: boolean;
}

/**
 * Space-between row — section headers, toolbars, card title + action.
 * Stacks cleanly when `wrap` is enabled.
 */
const Split = forwardRef<HTMLElement, SplitProps>(
  (
    {
      as,
      asChild = false,
      className,
      gap = 3,
      align = "center",
      wrap = true,
      ...props
    },
    ref,
  ) => {
    const Comp = resolveComp(asChild, as);
    return (
      <Comp
        ref={ref}
        data-slot="split"
        className={cn(
          "flex justify-between",
          wrap && "flex-wrap",
          layoutGapClass(gap),
          layoutAlignClass(align),
          className,
        )}
        {...props}
      />
    );
  },
);
Split.displayName = "Split";

/* ── Container ───────────────────────────────────────────────────── */

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps extends CommonLayoutProps {
  /** Max width. Defaults to `lg`. */
  size?: ContainerSize;
  /** Horizontal padding. Defaults to true. */
  padded?: boolean;
}

const containerSizeClass: Record<ContainerSize, string> = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-none",
};

/**
 * Page-level width constraint with optional horizontal padding.
 */
const Container = forwardRef<HTMLElement, ContainerProps>(
  (
    {
      as,
      asChild = false,
      className,
      size = "lg",
      padded = true,
      ...props
    },
    ref,
  ) => {
    const Comp = resolveComp(asChild, as);
    return (
      <Comp
        ref={ref}
        data-slot="container"
        data-size={size}
        className={cn(
          "mx-auto w-full",
          containerSizeClass[size],
          padded && "px-4 sm:px-6",
          className,
        )}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";

/* ── Spacer ──────────────────────────────────────────────────────── */

export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Fixed flex-basis instead of grow (e.g. visual breathing room).
   * Uses the shared spacing scale when set; otherwise grows (`flex-1`).
   */
  size?: LayoutGap;
  orientation?: "horizontal" | "vertical";
  asChild?: boolean;
}

/**
 * Flexible space between flex children, or a fixed-size spacer when `size` is set.
 */
const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  (
    {
      className,
      size,
      orientation = "horizontal",
      asChild = false,
      style,
      "aria-hidden": ariaHidden = true,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "div";
    const fixed = size !== undefined ? spacerSizeClass[size] : null;
    const mergedStyle: CSSProperties | undefined = fixed
      ? style
      : { flexGrow: 1, ...style };

    return (
      <Comp
        ref={ref}
        data-slot="spacer"
        aria-hidden={ariaHidden}
        className={cn(
          "shrink-0",
          fixed
            ? orientation === "vertical"
              ? fixed.h
              : fixed.w
            : "min-h-0 min-w-0 flex-1",
          className,
        )}
        style={mergedStyle}
        {...props}
      />
    );
  },
);
Spacer.displayName = "Spacer";

export {
  Box,
  Stack,
  Cluster,
  Grid,
  Flex,
  Center,
  Split,
  Container,
  Spacer,
};
