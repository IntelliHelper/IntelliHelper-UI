"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn, focusRing } from "@intelli/utils";
import { Button } from "./button";
import {
  centerTourCard,
  clampTourIndex,
  inflateRect,
  placeTourCard,
  type TourAlign,
  type TourPlacement,
  type TourPreferredSide,
  type TourRect,
  type TourSide,
} from "./tour-utils";

const tourCardVariants = cva(
  [
    "fixed z-[calc(var(--z-modal)+1)] rounded-xl text-sm",
    "shadow-[var(--glass-chrome-shadow)]",
    "animate-scale-in outline-none",
  ],
  {
    variants: {
      variant: {
        chrome: "text-[var(--glass-chrome-fg)]",
        elevated: "text-foreground",
        outline: "text-foreground",
      },
      size: {
        sm: "w-64",
        default: "w-80",
        lg: "w-[22.5rem]",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

const tourSurfaceVariants = cva(
  "pointer-events-none absolute inset-0 rounded-xl border border-[var(--glass-chrome-border)] bg-background",
  {
    variants: {
      variant: {
        chrome: "",
        elevated: "shadow-[var(--glass-chrome-shadow)]",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

/**
 * Glass buttons sample backdrop-filter and punch a hole through the card frost.
 * Opaque fills keep Back / Next in front of the page showing through the panel.
 */
const tourControlStyle = {
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
} as const;

const tourBackStyle = {
  ...tourControlStyle,
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
} as const;

const tourNextStyle = {
  ...tourControlStyle,
  backgroundColor: "var(--primary)",
  color: "var(--primary-foreground)",
} as const;

const ESTIMATED_CARD: Record<NonNullable<VariantProps<typeof tourCardVariants>["size"]>, { width: number; height: number }> = {
  sm: { width: 256, height: 156 },
  default: { width: 320, height: 168 },
  lg: { width: 360, height: 180 },
};

export type TourStep = {
  /** Stable id. Falls back to the step index. */
  id?: string;
  /** CSS selector for the element to spotlight. */
  target: string;
  title: ReactNode;
  description?: ReactNode;
  /** Preferred side. Flips when the card would leave the viewport. */
  side?: TourPreferredSide;
  align?: TourAlign;
};

export type TourLabels = {
  back?: string;
  next?: string;
  finish?: string;
  skip?: string;
  progress?: (current: number, total: number) => string;
};

export interface TourProps extends VariantProps<typeof tourCardVariants> {
  steps: readonly TourStep[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Zero-based step index. */
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  onFinish?: () => void;
  onSkip?: () => void;
  /** Padding around the spotlight hole, in pixels. */
  spotlightPadding?: number;
  /** Gap between the target and the card, in pixels. */
  gap?: number;
  /** Minimum distance from the viewport edge, in pixels. */
  viewportMargin?: number;
  /** Scroll the target into view when the step changes. */
  scrollIntoView?: boolean;
  /** Reset an uncontrolled step index each time the tour opens. */
  resetOnOpen?: boolean;
  closeOnOverlayClick?: boolean;
  showSkip?: boolean;
  showProgress?: boolean;
  labels?: TourLabels;
  className?: string;
}

const DEFAULT_LABELS: Required<TourLabels> = {
  back: "Back",
  next: "Next",
  finish: "Done",
  skip: "Skip",
  progress: (current, total) => `Step ${current} of ${total}`,
};

function findTarget(selector: string) {
  if (typeof document === "undefined" || selector.length === 0) return null;
  try {
    const node = document.querySelector(selector);
    return node instanceof HTMLElement ? node : null;
  } catch {
    return null;
  }
}

function readViewport(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function Tour({
  steps,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  step: stepProp,
  defaultStep = 0,
  onStepChange,
  onFinish,
  onSkip,
  spotlightPadding = 8,
  gap = 12,
  viewportMargin = 12,
  scrollIntoView = true,
  resetOnOpen = true,
  closeOnOverlayClick = false,
  showSkip = true,
  showProgress = true,
  labels,
  variant,
  size,
  className,
}: TourProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const [stepState, setStepState] = useState(() =>
    clampTourIndex(defaultStep, steps.length),
  );
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<TourRect | null>(null);
  const [placement, setPlacement] = useState<TourPlacement | null>(null);
  const [cardSize, setCardSize] = useState(ESTIMATED_CARD[size ?? "default"]);

  const open = openProp ?? openState;
  const step = clampTourIndex(stepProp ?? stepState, steps.length);
  const current = steps[step];

  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const maskId = `tour-mask-${useId().replace(/:/g, "")}`;
  const restoreFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(open);
  const scrolledStep = useRef<number | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );

  const setStep = useCallback(
    (next: number) => {
      const clamped = clampTourIndex(next, steps.length);
      if (stepProp === undefined) setStepState(clamped);
      onStepChange?.(clamped);
    },
    [onStepChange, stepProp, steps.length],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && !wasOpen.current && resetOnOpen && stepProp === undefined) {
      setStepState(clampTourIndex(defaultStep, steps.length));
    }
    wasOpen.current = open;
  }, [defaultStep, open, resetOnOpen, stepProp, steps.length]);

  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const frame = window.requestAnimationFrame(() => {
      cardRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      restoreFocus.current?.focus();
    };
  }, [open]);

  const targetSelector = current?.target ?? "";
  const preferredSide = current?.side ?? "auto";
  const align = current?.align ?? "center";

  const measure = useCallback(() => {
    if (!targetSelector) {
      setTargetRect(null);
      setPlacement(null);
      return;
    }

    const node = findTarget(targetSelector);
    const viewport = readViewport();
    const measuredCard = cardRef.current?.getBoundingClientRect();
    const nextCard = {
      width: measuredCard?.width || cardSize.width,
      height: measuredCard?.height || cardSize.height,
    };

    if (!node) {
      const centered = centerTourCard(nextCard, viewport, viewportMargin);
      setTargetRect(null);
      setPlacement({ ...centered, side: "bottom" });
      return;
    }

    const box = node.getBoundingClientRect();
    const hole = inflateRect(
      { top: box.top, left: box.left, width: box.width, height: box.height },
      spotlightPadding,
    );
    setTargetRect(hole);
    setPlacement(
      placeTourCard(
        hole,
        nextCard,
        viewport,
        preferredSide,
        align,
        gap,
        viewportMargin,
      ),
    );
  }, [
    align,
    cardSize.height,
    cardSize.width,
    gap,
    preferredSide,
    spotlightPadding,
    targetSelector,
    viewportMargin,
  ]);

  useEffect(() => {
    if (!open) {
      scrolledStep.current = null;
      return;
    }
    if (!scrollIntoView || !targetSelector || scrolledStep.current === step) return;
    const node = findTarget(targetSelector);
    if (!node) {
      scrolledStep.current = step;
      return;
    }
    const box = node.getBoundingClientRect();
    const fullyVisible =
      box.top >= 0 &&
      box.left >= 0 &&
      box.bottom <= window.innerHeight &&
      box.right <= window.innerWidth;
    if (!fullyVisible) {
      node.scrollIntoView({ block: "center", inline: "nearest" });
    }
    scrolledStep.current = step;
  }, [open, scrollIntoView, step, targetSelector]);

  useLayoutEffect(() => {
    if (!open) return;
    measure();
  }, [measure, open, step]);

  useEffect(() => {
    if (!open) return;
    const onLayout = () => measure();
    window.addEventListener("resize", onLayout);
    window.addEventListener("scroll", onLayout, true);
    return () => {
      window.removeEventListener("resize", onLayout);
      window.removeEventListener("scroll", onLayout, true);
    };
  }, [measure, open]);

  useLayoutEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    setCardSize((prev) => {
      if (
        Math.abs(prev.width - box.width) < 1 &&
        Math.abs(prev.height - box.height) < 1
      ) {
        return prev;
      }
      return { width: box.width, height: box.height };
    });
  }, [open, step, current?.title, current?.description, size, variant]);

  const finish = useCallback(() => {
    onFinish?.();
    setOpen(false);
  }, [onFinish, setOpen]);

  const skip = useCallback(() => {
    onSkip?.();
    setOpen(false);
  }, [onSkip, setOpen]);

  const back = useCallback(() => {
    setStep(step - 1);
  }, [setStep, step]);

  const next = useCallback(() => {
    if (step >= steps.length - 1) finish();
    else setStep(step + 1);
  }, [finish, setStep, step, steps.length]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        back();
        return;
      }
      if (event.key !== "Tab" || !cardRef.current) return;

      const focusable = [
        ...cardRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [back, next, setOpen],
  );

  if (!mounted || !open || !current || !placement) return null;

  const copy = { ...DEFAULT_LABELS, ...labels };
  const progress = copy.progress(step + 1, steps.length);
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;
  const describedBy = current.description ? descriptionId : undefined;

  return createPortal(
    <div data-slot="tour">
      <svg
        data-slot="tour-overlay"
        className="fixed inset-0 z-[var(--z-modal)] h-full w-full"
        aria-hidden="true"
        onClick={closeOnOverlayClick ? () => setOpen(false) : undefined}
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            {targetRect ? (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="12"
                fill="black"
              />
            ) : null}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="black"
          fillOpacity="0.55"
          mask={`url(#${maskId})`}
        />
      </svg>
      {targetRect ? (
        <div
          data-slot="tour-spotlight"
          aria-hidden="true"
          className="pointer-events-none fixed z-[var(--z-modal)] rounded-xl ring-2 ring-white/80"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
        />
      ) : null}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={describedBy}
        tabIndex={-1}
        data-slot="tour-card"
        data-side={placement.side satisfies TourSide}
        data-missing-target={targetRect ? undefined : "true"}
        className={cn(tourCardVariants({ variant, size }), focusRing, className)}
        style={{ top: placement.top, left: placement.left }}
        onKeyDown={onKeyDown}
      >
        <div
          aria-hidden="true"
          data-slot="tour-card-surface"
          className={tourSurfaceVariants({ variant })}
        />
        <div className="relative z-[1] flex flex-col gap-3 p-4">
        {showProgress ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs glass-chrome-text-muted" aria-live="polite">
              {progress}
            </p>
            <div className="flex gap-1" aria-hidden="true">
              {steps.map((item, index) => (
                <span
                  key={item.id ?? index}
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    index <= step ? "bg-foreground/80" : "bg-foreground/15",
                  )}
                />
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <h2 id={titleId} data-slot="tour-title" className="text-sm font-semibold leading-none">
            {current.title}
          </h2>
          {current.description ? (
            <p
              id={descriptionId}
              data-slot="tour-description"
              className="text-xs leading-relaxed glass-chrome-text-muted"
            >
              {current.description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-2">
          {showSkip ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              style={tourControlStyle}
              onClick={skip}
            >
              {copy.skip}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              style={tourBackStyle}
              onClick={back}
              disabled={isFirst}
            >
              {copy.back}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              style={tourNextStyle}
              onClick={next}
            >
              {isLast ? copy.finish : copy.next}
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export { tourCardVariants, tourSurfaceVariants };
