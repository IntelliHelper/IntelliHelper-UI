import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";

type TypographyProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants>;

const typographyVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      chrome: "glass-chrome-text",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function createTypographyComponent<T extends ElementType>(
  defaultElement: T,
  baseClassName: string,
) {
  const Component = forwardRef<HTMLElement, TypographyProps<T>>(
    ({ as, className, variant, children, ...props }, ref) => {
      const Tag = (as ?? defaultElement) as ElementType;
      return (
        <Tag
          ref={ref}
          data-slot={`typography-${String(defaultElement)}`}
          className={cn(
            typographyVariants({ variant }),
            baseClassName,
            className,
          )}
          {...props}
        >
          {children}
        </Tag>
      );
    },
  );
  Component.displayName = `Typography${String(defaultElement).toUpperCase()}`;
  return Component;
}

const TypographyH1 = createTypographyComponent(
  "h1",
  "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
);
const TypographyH2 = createTypographyComponent(
  "h2",
  "scroll-m-20 border-b border-[var(--glass-chrome-border)] pb-2 text-3xl font-semibold tracking-tight first:mt-0",
);
const TypographyH3 = createTypographyComponent(
  "h3",
  "scroll-m-20 text-2xl font-semibold tracking-tight",
);
const TypographyH4 = createTypographyComponent(
  "h4",
  "scroll-m-20 text-xl font-semibold tracking-tight",
);
const TypographyP = createTypographyComponent(
  "p",
  "leading-7 [&:not(:first-child)]:mt-6",
);
const TypographyBlockquote = createTypographyComponent(
  "blockquote",
  "mt-6 border-l-2 border-[var(--glass-chrome-border)] pl-6 italic glass-chrome-text-muted",
);
const TypographyInlineCode = createTypographyComponent(
  "code",
  "relative rounded-md bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)] px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
);
const TypographyLead = createTypographyComponent(
  "p",
  "text-xl text-muted-foreground",
);
const TypographyLarge = createTypographyComponent("div", "text-lg font-semibold");
const TypographySmall = createTypographyComponent("small", "text-sm font-medium leading-none");
const TypographyMuted = createTypographyComponent(
  "p",
  "text-sm text-muted-foreground",
);

const TypographyList = forwardRef<
  HTMLUListElement,
  HTMLAttributes<HTMLUListElement> & VariantProps<typeof typographyVariants>
>(({ className, variant, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="typography-list"
    className={cn(
      typographyVariants({ variant }),
      "my-6 ml-6 list-disc [&>li]:mt-2",
      className,
    )}
    {...props}
  />
));
TypographyList.displayName = "TypographyList";

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyBlockquote,
  TypographyInlineCode,
  TypographyLead,
  TypographyLarge,
  TypographySmall,
  TypographyMuted,
  TypographyList,
  typographyVariants,
};