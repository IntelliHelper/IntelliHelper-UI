"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type RefObject,
} from "react";
import { cn } from "@intelli/utils";
import {
  GlassIconButton,
  type GlassIconButtonProps,
} from "./glass-icon-button";

const scrollToTopVariants = cva(
  [
    "pointer-events-none opacity-0 scale-90",
    "transition-[opacity,transform] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-100 data-[visible=true]:scale-100",
  ],
  {
    variants: {
      position: {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
      },
      scope: {
        viewport: "fixed z-[var(--z-sticky)]",
        container: "absolute z-10",
      },
    },
    defaultVariants: {
      position: "bottom-right",
      scope: "viewport",
    },
  },
);

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function resolveScrollContainer(
  containerRef?: RefObject<HTMLElement | null>,
  withinRef?: RefObject<HTMLElement | null>,
) {
  if (containerRef?.current) {
    return containerRef.current;
  }

  if (withinRef?.current) {
    return withinRef.current.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
  }

  return null;
}

function getScrollTop(container: HTMLElement | null) {
  return container?.scrollTop ?? (typeof window !== "undefined" ? window.scrollY : 0);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function getScrollDuration(distance: number, duration?: number) {
  if (duration !== undefined) {
    return duration;
  }

  return Math.min(700, Math.max(350, distance * 0.45));
}

function setScrollTop(container: HTMLElement | null, value: number) {
  if (container) {
    container.scrollTop = value;
    return;
  }

  window.scrollTo(0, value);
}

function animateScrollToTop(
  container: HTMLElement | null,
  options: { smooth: boolean; duration?: number },
  frameRef: RefObject<number | null>,
) {
  const start = getScrollTop(container);

  if (start <= 0) {
    return;
  }

  if (frameRef.current !== null) {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }

  if (!options.smooth || prefersReducedMotion()) {
    setScrollTop(container, 0);
    return;
  }

  const scrollDuration = getScrollDuration(start, options.duration);
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / scrollDuration, 1);
    const next = start * (1 - easeOutCubic(progress));

    setScrollTop(container, next);

    if (progress < 1) {
      frameRef.current = requestAnimationFrame(step);
      return;
    }

    frameRef.current = null;
  };

  frameRef.current = requestAnimationFrame(step);
}

export interface ScrollToTopProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof scrollToTopVariants>,
    Pick<GlassIconButtonProps, "variant" | "size"> {
  threshold?: number;
  smooth?: boolean;
  duration?: number;
  label?: string;
  containerRef?: RefObject<HTMLElement | null>;
  withinRef?: RefObject<HTMLElement | null>;
}

const ScrollToTop = forwardRef<HTMLButtonElement, ScrollToTopProps>(
  (
    {
      className,
      threshold = 240,
      smooth = true,
      duration,
      label = "Scroll to top",
      containerRef,
      withinRef,
      position,
      scope: scopeProp,
      variant = "chrome",
      size = "default",
      onClick,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const scope =
      scopeProp ?? (containerRef || withinRef ? "container" : "viewport");

    useEffect(() => {
      const resolved = resolveScrollContainer(containerRef, withinRef);
      setContainer(resolved);
    }, [containerRef, withinRef]);

    useEffect(() => {
      const target = container ?? (typeof window !== "undefined" ? window : null);

      if (!target) {
        return;
      }

      const handleScroll = () => {
        setVisible(getScrollTop(container) > threshold);
      };

      handleScroll();
      target.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        target.removeEventListener("scroll", handleScroll);
      };
    }, [container, threshold]);

    useEffect(() => {
      const frameRef = animationFrameRef;

      return () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }, []);

    const scrollToTop = useCallback(() => {
      animateScrollToTop(
        container,
        { smooth, duration },
        animationFrameRef,
      );
    }, [container, smooth, duration]);

    return (
      <GlassIconButton
        ref={ref}
        type="button"
        data-slot="scroll-to-top"
        data-visible={visible}
        aria-label={label}
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        variant={variant}
        size={size}
        className={cn(scrollToTopVariants({ position, scope, className }))}
        onClick={(event) => {
          scrollToTop();
          onClick?.(event);
        }}
        {...props}
      >
        <ArrowUpIcon />
      </GlassIconButton>
    );
  },
);
ScrollToTop.displayName = "ScrollToTop";

export { ScrollToTop, scrollToTopVariants };