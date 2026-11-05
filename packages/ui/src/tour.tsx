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
    "fixed z-[calc(var(--z-modal)+1)] flex max-h-[calc(100dvh-1.5rem)] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl text-sm",
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

/** 16:9 media sits above the copy, so the first placement accounts for it. */
function estimateTourCard(
  size: NonNullable<VariantProps<typeof tourCardVariants>["size"]>,
  hasMedia: boolean,
) {
  const base = ESTIMATED_CARD[size];
  if (!hasMedia) return base;
  return {
    width: base.width,
    height: base.height + Math.round((base.width * 9) / 16),
  };
}

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export type TourImage = {
  type: "image";
  src: string;
  alt: string;
};

export type TourVideo = {
  type: "video";
  src: string;
  /** Shown before the file loads. */
  poster?: string;
  /** Accessible name for the player. Falls back to "Step video". */
  label?: string;
};

/** Image or video file shown above the step title. Omit it for a text step. */
export type TourMedia = TourImage | TourVideo;

export type TourStep = {
  /** Stable id. Falls back to the step index. */
  id?: string;
  /** CSS selector for the element to spotlight. */
  target: string;
  title: ReactNode;
  description?: ReactNode;
  /** Optional image or video above the title. */
  media?: TourMedia;
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

function nearly(a: number, b: number) {
  return Math.abs(a - b) < 0.5;
}

function sameRect(a: TourRect | null, b: TourRect | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    nearly(a.top, b.top) &&
    nearly(a.left, b.left) &&
    nearly(a.width, b.width) &&
    nearly(a.height, b.height)
  );
}

function samePlacement(a: TourPlacement | null, b: TourPlacement | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.side === b.side && nearly(a.top, b.top) && nearly(a.left, b.left);
}

function isTourField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return target.closest("input, textarea, select, video, audio, [contenteditable='true']") !== null;
}

function TourStepMedia({
  media,
  onReady,
}: {
  media: TourMedia;
  onReady: () => void;
}) {
  if (!media.src) return null;

  if (media.type === "image") {
    return (
      <img
        data-slot="tour-media"
        src={media.src}
        alt={media.alt}
        className="aspect-video w-full shrink-0 object-cover"
        onLoad={onReady}
      />
    );
  }

  return (
    <video
      data-slot="tour-media"
      src={media.src}
      poster={media.poster}
      aria-label={media.label || "Step video"}
      controls
      playsInline
      preload="metadata"
      className="aspect-video w-full shrink-0 bg-black object-contain"
      onLoadedMetadata={onReady}
    />
  );
}

function listTourFocusable(card: HTMLElement) {
  return [...card.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (node) => node.getClientRects().length > 0,
  );
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
    const fallback = estimateTourCard(size ?? "default", Boolean(current?.media?.src));
    const nextCard = {
      width: measuredCard?.width || fallback.width,
      height: measuredCard?.height || fallback.height,
    };

    if (!node) {
      const centered = centerTourCard(nextCard, viewport, viewportMargin);
      setTargetRect(null);
      setPlacement((prev) => {
        const next = { ...centered, side: "bottom" as const };
        return samePlacement(prev, next) ? prev : next;
      });
      return;
    }

    const box = node.getBoundingClientRect();
    const hole = inflateRect(
      { top: box.top, left: box.left, width: box.width, height: box.height },
      spotlightPadding,
    );
    setTargetRect((prev) => (sameRect(prev, hole) ? prev : hole));
    setPlacement((prev) => {
      const next = placeTourCard(
        hole,
        nextCard,
        viewport,
        preferredSide,
        align,
        gap,
        viewportMargin,
      );
      return samePlacement(prev, next) ? prev : next;
    });
  }, [
    align,
    gap,
    preferredSide,
    size,
    current?.media?.src,
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
    if (!open) {
      setPlacement(null);
      setTargetRect(null);
      return;
    }
    measure();
  }, [current?.description, current?.title, measure, open, size, step, variant]);

  useEffect(() => {
    if (!open) return;
    let frame = 0;
    const observed = new Set<Element>();
    const watcher = new ResizeObserver(() => schedule());

    const watchTarget = () => {
      const node = findTarget(targetSelector);
      if (!node || observed.has(node)) return;
      observed.add(node);
      watcher.observe(node);
    };

    const schedule = () => {
      watchTarget();
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => measure());
    };

    watcher.observe(document.documentElement);
    watcher.observe(document.body);
    if (cardRef.current) watcher.observe(cardRef.current);
    watchTarget();

    const tourRoot = cardRef.current?.closest("[data-slot='tour']");
    const mutations = new MutationObserver((records) => {
      const outside = records.some((record) => {
        const node = record.target;
        return !(node instanceof Node) || !tourRoot?.contains(node);
      });
      if (outside) schedule();
    });
    mutations.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden"],
    });

    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    document.addEventListener("load", schedule, true);
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", schedule);
    visualViewport?.addEventListener("scroll", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      watcher.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      document.removeEventListener("load", schedule, true);
      visualViewport?.removeEventListener("resize", schedule);
      visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [measure, open, targetSelector]);

  useEffect(() => {
    if (!open) return;
    const onFocusIn = (event: FocusEvent) => {
      const card = cardRef.current;
      if (!card || !(event.target instanceof Node) || card.contains(event.target)) return;
      const focusable = listTourFocusable(card);
      const first = focusable[0] ?? card;
      const last = focusable[focusable.length - 1] ?? card;
      const from = event.relatedTarget;
      if (from === last) first.focus();
      else if (from === first || from === card) last.focus();
      else first.focus();
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, [open]);

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
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        if (event.defaultPrevented || isTourField(event.target)) return;
        event.preventDefault();
        if (event.key === "ArrowRight") next();
        else back();
        return;
      }
      if (event.key !== "Tab" || !cardRef.current) return;

      const card = cardRef.current;
      const focusable = listTourFocusable(card);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      const active = document.activeElement;
      const outside = !(active instanceof Node) || !card.contains(active);
      if (event.shiftKey && (active === first || active === card || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || active === card || outside)) {
        event.preventDefault();
        first.focus();
      }
    },
    [back, next, setOpen],
  );

  if (!mounted || !open || !current) return null;

  const shown = placement ?? { top: 0, left: 0, side: "bottom" as TourSide };

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
        data-side={shown.side}
        data-missing-target={targetRect ? undefined : "true"}
        className={cn(tourCardVariants({ variant, size }), focusRing, className)}
        style={{
          top: shown.top,
          left: shown.left,
          visibility: placement ? undefined : "hidden",
        }}
        onKeyDown={onKeyDown}
      >
        <div
          aria-hidden="true"
          data-slot="tour-card-surface"
          className={tourSurfaceVariants({ variant })}
        />
        <div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden">
        {current.media ? (
          <TourStepMedia key={current.media.src} media={current.media} onReady={measure} />
        ) : null}
        <div className="flex min-h-0 flex-col gap-3 overflow-hidden p-4">
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
        <div className="flex min-h-0 flex-col gap-1.5 overflow-y-auto overscroll-contain">
          <h2 id={titleId} data-slot="tour-title" className="text-sm font-semibold leading-none">
            {current.title}
          </h2>
          {current.description ? (
            <div
              id={descriptionId}
              data-slot="tour-description"
              className="text-xs leading-relaxed glass-chrome-text-muted"
            >
              {current.description}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-2">
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
      </div>
    </div>,
    document.body,
  );
}

export { tourCardVariants, tourSurfaceVariants };
