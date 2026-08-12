"use client";

import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, DownloadIcon, ZoomInIcon, ZoomOutIcon } from "./icons";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { GlassIconButton } from "./glass-icon-button";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export type ImagePreviewItem = {
  src: string;
  alt?: string;
  caption?: string;
  /** Optional higher-res or original URL for download */
  downloadSrc?: string;
};

const imagePreviewThumbVariants = cva(
  [
    "relative block overflow-hidden rounded-xl border",
    "transition-[box-shadow,transform,border-color] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "hover:scale-[1.01] active:scale-[0.99]",
    focusRing,
  ],
  {
    variants: {
      variant: {
        chrome: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_50%,transparent)]",
          "shadow-[var(--glass-chrome-inset)]",
          "hover:shadow-[var(--glass-chrome-shadow)]",
        ],
        outline: [
          "border-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
          "bg-[color-mix(in_oklch,var(--background)_55%,transparent)]",
        ],
        ghost: "border-transparent bg-transparent shadow-none",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

const imagePreviewToolbarVariants = cva(
  [
    "pointer-events-auto flex items-center gap-1 rounded-full px-1.5 py-1",
    "border border-[var(--glass-chrome-border)]",
    "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_72%,transparent)]",
    "text-[var(--glass-chrome-fg)]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
    "shadow-[var(--glass-chrome-shadow),var(--glass-chrome-inset)]",
  ],
  {
    variants: {
      size: {
        sm: "h-9 gap-0.5",
        default: "h-11 gap-1",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function normalizeItems(
  images?: ImagePreviewItem[],
  src?: string,
  alt?: string,
  caption?: string,
): ImagePreviewItem[] {
  if (images && images.length > 0) return images;
  if (src) return [{ src, alt, caption }];
  return [];
}

async function downloadImage(url: string, filename = "image") {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export interface ImagePreviewProps {
  images?: ImagePreviewItem[];
  /** Convenience single-image source when `images` is omitted */
  src?: string;
  alt?: string;
  caption?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  zoomable?: boolean;
  downloadable?: boolean;
  loop?: boolean;
  className?: string;
}

/**
 * Full-screen Liquid Glass image lightbox with zoom, pan, gallery nav, and download.
 * Pair with `ImagePreviewThumb` / `ImagePreviewGallery` for thumbnails.
 */
const ImagePreview = ({
  images,
  src,
  alt,
  caption,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  zoomable = true,
  downloadable = true,
  loop = true,
  className,
}: ImagePreviewProps) => {
  const items = useMemo(
    () => normalizeItems(images, src, alt, caption),
    [images, src, alt, caption],
  );
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledIndex, setUncontrolledIndex] = useState(
    clamp(defaultIndex, 0, Math.max(items.length - 1, 0)),
  );
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const open = openProp ?? uncontrolledOpen;
  const index = indexProp ?? uncontrolledIndex;
  const active = items[index] ?? items[0];
  const titleId = useId();
  const descId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }
    },
    [onOpenChange, openProp],
  );

  const setIndex = useCallback(
    (next: number) => {
      if (items.length === 0) return;
      const clamped = clamp(next, 0, items.length - 1);
      if (indexProp === undefined) setUncontrolledIndex(clamped);
      onIndexChange?.(clamped);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    },
    [indexProp, items.length, onIndexChange],
  );

  const goPrev = useCallback(() => {
    if (items.length <= 1) return;
    if (index <= 0) {
      if (loop) setIndex(items.length - 1);
      return;
    }
    setIndex(index - 1);
  }, [index, items.length, loop, setIndex]);

  const goNext = useCallback(() => {
    if (items.length <= 1) return;
    if (index >= items.length - 1) {
      if (loop) setIndex(0);
      return;
    }
    setIndex(index + 1);
  }, [index, items.length, loop, setIndex]);

  const zoomIn = useCallback(() => {
    if (!zoomable) return;
    setZoom((z) => clamp(Number((z + ZOOM_STEP).toFixed(2)), MIN_ZOOM, MAX_ZOOM));
  }, [zoomable]);

  const zoomOut = useCallback(() => {
    if (!zoomable) return;
    setZoom((z) => {
      const next = clamp(Number((z - ZOOM_STEP).toFixed(2)), MIN_ZOOM, MAX_ZOOM);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, [zoomable]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (!zoomable) return;
      event.preventDefault();
      if (event.deltaY < 0) zoomIn();
      else zoomOut();
    },
    [zoomIn, zoomOut, zoomable],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!zoomable || zoom <= 1) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: offset.x,
        originY: offset.y,
      };
    },
    [offset.x, offset.y, zoom, zoomable],
  );

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setOffset({
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    });
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setDragging(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn();
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomOut();
      } else if (event.key === "0") {
        event.preventDefault();
        resetZoom();
      }
    },
    [goNext, goPrev, resetZoom, zoomIn, zoomOut],
  );

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [open, index]);

  if (items.length === 0) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-slot="image-preview-overlay"
          className={cn(
            "fixed inset-0 z-[var(--z-modal)]",
            "bg-[color-mix(in_oklch,black_55%,transparent)]",
            "backdrop-blur-md",
            "data-[state=open]:animate-fade-in",
            "data-[state=closed]:opacity-0",
            "transition-opacity duration-[var(--duration-normal)]",
            className,
          )}
        />
        <DialogPrimitive.Content
          data-slot="image-preview-content"
          aria-labelledby={titleId}
          aria-describedby={active?.caption ? descId : undefined}
          className={cn(
            "fixed inset-0 z-[calc(var(--z-modal)+1)] flex flex-col outline-none",
            "data-[state=open]:animate-fade-in",
            "data-[state=closed]:opacity-0",
          )}
          onKeyDown={handleKeyDown}
        >
          <DialogPrimitive.Title id={titleId} className="sr-only">
            {active?.alt || active?.caption || "Image preview"}
          </DialogPrimitive.Title>
          {active?.caption ? (
            <DialogPrimitive.Description id={descId} className="sr-only">
              {active.caption}
            </DialogPrimitive.Description>
          ) : (
            <DialogPrimitive.Description className="sr-only">
              Use arrow keys to navigate, plus and minus to zoom, Escape to close.
            </DialogPrimitive.Description>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
            <div className={cn(imagePreviewToolbarVariants(), "pointer-events-auto")}>
              <span className="px-2 text-xs font-medium tabular-nums opacity-90">
                {index + 1} / {items.length}
              </span>
            </div>
            <div className={cn(imagePreviewToolbarVariants())}>
              {zoomable ? (
                <>
                  <GlassIconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Zoom out"
                    onClick={zoomOut}
                    disabled={zoom <= MIN_ZOOM}
                  >
                    <ZoomOutIcon />
                  </GlassIconButton>
                  <span className="min-w-12 text-center text-xs tabular-nums opacity-90">
                    {Math.round(zoom * 100)}%
                  </span>
                  <GlassIconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Zoom in"
                    onClick={zoomIn}
                    disabled={zoom >= MAX_ZOOM}
                  >
                    <ZoomInIcon />
                  </GlassIconButton>
                </>
              ) : null}
              {downloadable && active ? (
                <GlassIconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Download image"
                  onClick={() =>
                    void downloadImage(
                      active.downloadSrc ?? active.src,
                      active.alt?.replace(/\s+/g, "-").toLowerCase() || "image",
                    )
                  }
                >
                  <DownloadIcon />
                </GlassIconButton>
              ) : null}
              <DialogPrimitive.Close asChild>
                <GlassIconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Close preview"
                >
                  <CloseIcon />
                </GlassIconButton>
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            data-slot="image-preview-stage"
            className={cn(
              "relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-20 pt-16",
              zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default",
            )}
            onWheel={handleWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDoubleClick={resetZoom}
          >
            {items.length > 1 ? (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-2 z-10 flex items-center sm:left-4">
                  <GlassIconButton
                    type="button"
                    variant="chrome"
                    size="lg"
                    aria-label="Previous image"
                    className="pointer-events-auto"
                    onClick={goPrev}
                  >
                    <ChevronLeftIcon className="size-5" />
                  </GlassIconButton>
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-2 z-10 flex items-center sm:right-4">
                  <GlassIconButton
                    type="button"
                    variant="chrome"
                    size="lg"
                    aria-label="Next image"
                    className="pointer-events-auto"
                    onClick={goNext}
                  >
                    <ChevronRightIcon className="size-5" />
                  </GlassIconButton>
                </div>
              </>
            ) : null}

            {active ? (
              <img
                key={active.src}
                src={active.src}
                alt={active.alt ?? ""}
                draggable={false}
                className="max-h-full max-w-full select-none object-contain shadow-2xl"
                style={{
                  transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
                  transition: dragging
                    ? "none"
                    : "transform 160ms var(--ease-spring, cubic-bezier(0.22, 1, 0.36, 1))",
                }}
              />
            ) : null}
          </div>

          {active?.caption ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-4">
              <p
                className={cn(
                  imagePreviewToolbarVariants({ size: "sm" }),
                  "max-w-xl px-4 text-center text-sm",
                )}
              >
                {active.caption}
              </p>
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
ImagePreview.displayName = "ImagePreview";

export interface ImagePreviewThumbProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof imagePreviewThumbVariants> {
  src: string;
  alt?: string;
  index?: number;
  onOpen?: (index: number) => void;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
  children?: ReactNode;
}

/**
 * Thumbnail button for gallery layouts. Call `onOpen(index)` to open a controlled `ImagePreview`.
 */
const ImagePreviewThumb = forwardRef<HTMLButtonElement, ImagePreviewThumbProps>(
  (
    {
      className,
      variant,
      src,
      alt = "",
      index = 0,
      onOpen,
      onClick,
      imgProps,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        data-slot="image-preview-thumb"
        className={cn(imagePreviewThumbVariants({ variant, className }))}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) onOpen?.(index);
        }}
        {...props}
      >
        {children ?? (
          <img
            src={src}
            alt={alt}
            className={cn("aspect-square size-full object-cover", imgProps?.className)}
            {...imgProps}
          />
        )}
      </button>
    );
  },
);
ImagePreviewThumb.displayName = "ImagePreviewThumb";

export interface ImagePreviewGalleryProps
  extends Omit<ImagePreviewProps, "src" | "alt" | "caption"> {
  images: ImagePreviewItem[];
  thumbClassName?: string;
  thumbVariant?: VariantProps<typeof imagePreviewThumbVariants>["variant"];
  className?: string;
  gridClassName?: string;
}

/**
 * Thumb grid + lightbox wired together for common gallery use cases.
 */
const ImagePreviewGallery = ({
  images,
  thumbClassName,
  thumbVariant,
  className,
  gridClassName,
  open: openProp,
  defaultOpen,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  ...previewProps
}: ImagePreviewGalleryProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
  const open = openProp ?? uncontrolledOpen;
  const index = indexProp ?? uncontrolledIndex;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const setIndex = (next: number) => {
    if (indexProp === undefined) setUncontrolledIndex(next);
    onIndexChange?.(next);
  };

  return (
    <div data-slot="image-preview-gallery" className={cn("w-full", className)}>
      <div
        className={cn(
          "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
          gridClassName,
        )}
      >
        {images.map((item, i) => (
          <ImagePreviewThumb
            key={`${item.src}-${i}`}
            src={item.src}
            alt={item.alt}
            index={i}
            variant={thumbVariant}
            className={thumbClassName}
            onOpen={(next) => {
              setIndex(next);
              setOpen(true);
            }}
          />
        ))}
      </div>
      <ImagePreview
        images={images}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
        {...previewProps}
      />
    </div>
  );
};
ImagePreviewGallery.displayName = "ImagePreviewGallery";

export {
  ImagePreview,
  ImagePreviewThumb,
  ImagePreviewGallery,
  imagePreviewThumbVariants,
  imagePreviewToolbarVariants,
};
