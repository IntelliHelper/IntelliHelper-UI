"use client";

import { CropIcon, FlipHIcon, FlipVIcon, RotateIcon, RotateLeftIcon, SlidersIcon } from "./icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { GlassIconButton } from "./glass-icon-button";
import {
  DEFAULT_IMAGE_CROP,
  DEFAULT_IMAGE_FILTERS,
  DEFAULT_IMAGE_TRANSFORM,
  aspectPresetRatio,
  areFiltersDefault,
  exportEditedDataUrl,
  exportEditedImage,
  filtersToCss,
  fitCropToAspect,
  normalizeRotation,
  type ImageAspectPreset,
  type ImageEditorCrop,
  type ImageEditorExportOptions,
  type ImageEditorFilters,
  type ImageEditorTransform,
} from "./image-editor-utils";

const imageEditorVariants = cva(
  [
    "flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-inset)]",
        ],
        elevated: [
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_68%,transparent)]",
          "backdrop-blur-[var(--glass-blur)]",
          "shadow-[var(--glass-chrome-shadow),var(--glass-chrome-inset)]",
        ],
        outline: "bg-[color-mix(in_oklch,var(--background)_65%,transparent)]",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export type ImageEditorTool = "crop" | "adjust" | "transform";

export type ImageEditorHandle = {
  exportBlob: (options?: ImageEditorExportOptions) => Promise<Blob>;
  exportDataUrl: (options?: ImageEditorExportOptions) => Promise<string>;
  getState: () => {
    crop: ImageEditorCrop;
    transform: ImageEditorTransform;
    filters: ImageEditorFilters;
  };
  reset: () => void;
};

export interface ImageEditorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof imageEditorVariants> {
  src: string;
  alt?: string;
  /** Controlled crop aspect preset. Preset chips update this (or defaultAspect). */
  aspect?: ImageAspectPreset;
  defaultAspect?: ImageAspectPreset;
  onAspectChange?: (aspect: ImageAspectPreset) => void;
  defaultTool?: ImageEditorTool;
  tool?: ImageEditorTool;
  onToolChange?: (tool: ImageEditorTool) => void;
  crop?: ImageEditorCrop;
  defaultCrop?: ImageEditorCrop;
  onCropChange?: (crop: ImageEditorCrop) => void;
  transform?: ImageEditorTransform;
  defaultTransform?: ImageEditorTransform;
  onTransformChange?: (transform: ImageEditorTransform) => void;
  filters?: ImageEditorFilters;
  defaultFilters?: ImageEditorFilters;
  onFiltersChange?: (filters: ImageEditorFilters) => void;
  onExport?: (blob: Blob) => void;
  showExport?: boolean;
  exportLabel?: string;
  resetLabel?: string;
}

function ToolButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 min-h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium sm:h-9 sm:min-h-9 sm:px-3",
        "transition-[background,transform,color] duration-[var(--duration-fast)]",
        "active:scale-[0.98] touch-manipulation",
        focusRing,
        active
          ? "bg-[color-mix(in_oklch,var(--primary)_22%,transparent)] text-foreground"
          : "text-[var(--glass-chrome-fg)] hover:bg-[color-mix(in_oklch,var(--glass-chrome-fg)_10%,transparent)]",
      )}
    >
      {children}
    </button>
  );
}

function FilterSlider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = "",
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={id} className="font-medium text-foreground/90">
          {label}
        </label>
        <span className="tabular-nums text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full sm:h-1.5",
          "bg-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
          "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none sm:[&::-webkit-slider-thumb]:size-3.5",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full sm:[&::-moz-range-thumb]:size-3.5",
          "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary",
          "touch-manipulation",
          focusRing,
        )}
      />
    </div>
  );
}

type DragMode =
  | "move"
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw"
  | null;

const ImageEditor = forwardRef<ImageEditorHandle, ImageEditorProps>(
  (
    {
      className,
      variant,
      src,
      alt = "",
      aspect: aspectProp,
      defaultAspect = "free",
      onAspectChange,
      defaultTool = "crop",
      tool: toolProp,
      onToolChange,
      crop: cropProp,
      defaultCrop = DEFAULT_IMAGE_CROP,
      onCropChange,
      transform: transformProp,
      defaultTransform = DEFAULT_IMAGE_TRANSFORM,
      onTransformChange,
      filters: filtersProp,
      defaultFilters = DEFAULT_IMAGE_FILTERS,
      onFiltersChange,
      onExport,
      showExport = true,
      exportLabel = "Export",
      resetLabel = "Reset",
      ...props
    },
    ref,
  ) => {
    const stageRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const baseId = useId();

    const [uncontrolledTool, setUncontrolledTool] = useState(defaultTool);
    const [uncontrolledAspect, setUncontrolledAspect] = useState(defaultAspect);
    const [uncontrolledCrop, setUncontrolledCrop] = useState(defaultCrop);
    const [uncontrolledTransform, setUncontrolledTransform] =
      useState(defaultTransform);
    const [uncontrolledFilters, setUncontrolledFilters] =
      useState(defaultFilters);
    const [exporting, setExporting] = useState(false);
    const [imgReady, setImgReady] = useState(false);

    const tool = toolProp ?? uncontrolledTool;
    const aspect = aspectProp ?? uncontrolledAspect;
    const crop = cropProp ?? uncontrolledCrop;
    const transform = transformProp ?? uncontrolledTransform;
    const filters = filtersProp ?? uncontrolledFilters;

    const setTool = (next: ImageEditorTool) => {
      if (toolProp === undefined) setUncontrolledTool(next);
      onToolChange?.(next);
    };

    const setAspect = useCallback(
      (next: ImageAspectPreset) => {
        if (aspectProp === undefined) setUncontrolledAspect(next);
        onAspectChange?.(next);
      },
      [aspectProp, onAspectChange],
    );

    const setCrop = useCallback(
      (next: ImageEditorCrop) => {
        const ratio = aspectPresetRatio(aspect);
        const fitted = fitCropToAspect(next, ratio);
        if (cropProp === undefined) setUncontrolledCrop(fitted);
        onCropChange?.(fitted);
      },
      [aspect, cropProp, onCropChange],
    );

    const setTransform = useCallback(
      (next: ImageEditorTransform) => {
        const normalized = {
          ...next,
          rotation: normalizeRotation(next.rotation),
        };
        if (transformProp === undefined) setUncontrolledTransform(normalized);
        onTransformChange?.(normalized);
      },
      [onTransformChange, transformProp],
    );

    const setFilters = useCallback(
      (next: ImageEditorFilters) => {
        if (filtersProp === undefined) setUncontrolledFilters(next);
        onFiltersChange?.(next);
      },
      [filtersProp, onFiltersChange],
    );

    useEffect(() => {
      // Re-fit crop when aspect preset changes (from chips or controlled prop)
      setCrop(crop);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- only on aspect change
    }, [aspect]);

    const reset = useCallback(() => {
      if (aspectProp === undefined) setUncontrolledAspect(defaultAspect);
      onAspectChange?.(defaultAspect);
      const fitted = fitCropToAspect(
        DEFAULT_IMAGE_CROP,
        aspectPresetRatio(defaultAspect),
      );
      if (cropProp === undefined) setUncontrolledCrop(fitted);
      onCropChange?.(fitted);
      setTransform(DEFAULT_IMAGE_TRANSFORM);
      setFilters(DEFAULT_IMAGE_FILTERS);
    }, [
      aspectProp,
      cropProp,
      defaultAspect,
      onAspectChange,
      onCropChange,
      setFilters,
      setTransform,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        exportBlob: (exportOptions) =>
          exportEditedImage(src, {
            crop,
            transform,
            filters,
            exportOptions,
          }),
        exportDataUrl: (exportOptions) =>
          exportEditedDataUrl(src, {
            crop,
            transform,
            filters,
            exportOptions,
          }),
        getState: () => ({ crop, transform, filters }),
        reset,
      }),
      [crop, filters, reset, src, transform],
    );

    const handleExport = async () => {
      setExporting(true);
      try {
        const blob = await exportEditedImage(src, {
          crop,
          transform,
          filters,
        });
        onExport?.(blob);
        if (!onExport) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "edited-image.png";
          a.click();
          URL.revokeObjectURL(url);
        }
      } finally {
        setExporting(false);
      }
    };

    const dragRef = useRef<{
      mode: DragMode;
      startX: number;
      startY: number;
      origin: ImageEditorCrop;
    } | null>(null);

    const onCropPointerDown = (
      event: ReactPointerEvent,
      mode: Exclude<DragMode, null>,
    ) => {
      if (tool !== "crop") return;
      event.preventDefault();
      event.stopPropagation();
      (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
      dragRef.current = {
        mode,
        startX: event.clientX,
        startY: event.clientY,
        origin: { ...crop },
      };
    };

    const onStagePointerMove = (event: ReactPointerEvent) => {
      const drag = dragRef.current;
      const stage = stageRef.current;
      if (!drag || !stage) return;

      const rect = stage.getBoundingClientRect();
      const dx = (event.clientX - drag.startX) / rect.width;
      const dy = (event.clientY - drag.startY) / rect.height;
      const o = drag.origin;
      const mode = drag.mode;
      if (!mode) return;

      let next: ImageEditorCrop;

      if (mode === "move") {
        next = {
          ...o,
          x: Math.min(Math.max(0, o.x + dx), 1 - o.width),
          y: Math.min(Math.max(0, o.y + dy), 1 - o.height),
        };
      } else {
        next = { ...o };
        if (mode.includes("e")) {
          next.width = Math.max(0.05, o.width + dx);
        }
        if (mode.includes("s")) {
          next.height = Math.max(0.05, o.height + dy);
        }
        if (mode.includes("w")) {
          const width = Math.max(0.05, o.width - dx);
          next.x = o.x + o.width - width;
          next.width = width;
        }
        if (mode.includes("n")) {
          const height = Math.max(0.05, o.height - dy);
          next.y = o.y + o.height - height;
          next.height = height;
        }
        next.x = Math.min(Math.max(0, next.x), 1 - 0.05);
        next.y = Math.min(Math.max(0, next.y), 1 - 0.05);
        next.width = Math.min(next.width, 1 - next.x);
        next.height = Math.min(next.height, 1 - next.y);
      }

      setCrop(next);
    };

    const endDrag = () => {
      dragRef.current = null;
    };

    // Crop UI is authored in source space; only apply rotate/flip preview outside crop tool.
    const previewStyle = useMemo(() => {
      const turns = normalizeRotation(transform.rotation);
      const rotateFlip =
        tool === "crop"
          ? undefined
          : `rotate(${turns}deg) scaleX(${transform.flipX ? -1 : 1}) scaleY(${
              transform.flipY ? -1 : 1
            })`;
      return {
        filter: filtersToCss(filters),
        transform: rotateFlip,
      } as const;
    }, [filters, tool, transform]);

    const dirty =
      crop.x !== 0 ||
      crop.y !== 0 ||
      crop.width !== 1 ||
      crop.height !== 1 ||
      transform.rotation !== 0 ||
      transform.flipX ||
      transform.flipY ||
      !areFiltersDefault(filters);

    return (
      <div
        data-slot="image-editor"
        className={cn(imageEditorVariants({ variant, className }))}
        {...props}
      >
        {/* Toolbar */}
        <div
          data-slot="image-editor-toolbar"
          className={cn(
            "flex flex-col gap-2 border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_75%,transparent)] px-2 py-2",
            "sm:flex-row sm:flex-wrap sm:items-center sm:gap-1",
          )}
        >
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            <ToolButton
              label="Crop"
              active={tool === "crop"}
              onClick={() => setTool("crop")}
            >
              <CropIcon className="size-3.5 shrink-0" />
              <span className="max-[360px]:sr-only">Crop</span>
            </ToolButton>
            <ToolButton
              label="Adjust"
              active={tool === "adjust"}
              onClick={() => setTool("adjust")}
            >
              <SlidersIcon className="size-3.5 shrink-0" />
              <span className="max-[360px]:sr-only">Filters</span>
            </ToolButton>
            <ToolButton
              label="Transform"
              active={tool === "transform"}
              onClick={() => setTool("transform")}
            >
              <RotateIcon className="size-3.5 shrink-0" />
              <span className="max-[360px]:sr-only">Rotate</span>
            </ToolButton>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-1 sm:ml-auto">
            <button
              type="button"
              onClick={reset}
              disabled={!dirty}
              className={cn(
                "h-10 min-h-10 flex-1 rounded-full px-3 text-xs font-medium sm:h-9 sm:min-h-9 sm:flex-none",
                "text-[var(--glass-chrome-fg)]",
                "hover:bg-[color-mix(in_oklch,var(--glass-chrome-fg)_10%,transparent)]",
                "disabled:opacity-40",
                "touch-manipulation",
                focusRing,
              )}
            >
              {resetLabel}
            </button>
            {showExport ? (
              <button
                type="button"
                onClick={() => void handleExport()}
                disabled={exporting || !imgReady}
                className={cn(
                  "h-10 min-h-10 flex-1 rounded-full px-3 text-xs font-semibold sm:h-9 sm:min-h-9 sm:flex-none",
                  "bg-[color-mix(in_oklch,var(--primary)_88%,transparent)] text-primary-foreground",
                  "hover:brightness-110 active:scale-[0.98]",
                  "disabled:opacity-50",
                  "touch-manipulation",
                  focusRing,
                )}
              >
                {exporting ? "Exporting…" : exportLabel}
              </button>
            ) : null}
          </div>
        </div>

        {/* Stage */}
        <div
          ref={stageRef}
          data-slot="image-editor-stage"
          className={cn(
            "relative flex min-h-[200px] flex-1 items-center justify-center overflow-hidden",
            "bg-[color-mix(in_oklch,black_12%,transparent)] p-2 touch-none sm:min-h-[240px] sm:p-4",
          )}
          onPointerMove={onStagePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className="relative max-h-[min(50vh,420px)] max-w-full sm:max-h-[420px]">
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              draggable={false}
              onLoad={() => setImgReady(true)}
              className="max-h-[min(50vh,420px)] max-w-full select-none object-contain sm:max-h-[420px]"
              style={previewStyle}
            />

            {tool === "crop" && imgReady ? (
              <div
                className="absolute inset-0"
                aria-hidden={false}
                role="presentation"
              >
                {/* Dim outside crop */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    boxShadow: `0 0 0 9999px color-mix(in oklch, black 45%, transparent)`,
                    left: `${crop.x * 100}%`,
                    top: `${crop.y * 100}%`,
                    width: `${crop.width * 100}%`,
                    height: `${crop.height * 100}%`,
                  }}
                />
                {/* Crop frame */}
                <div
                  className="absolute cursor-move border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
                  style={{
                    left: `${crop.x * 100}%`,
                    top: `${crop.y * 100}%`,
                    width: `${crop.width * 100}%`,
                    height: `${crop.height * 100}%`,
                  }}
                  onPointerDown={(e) => onCropPointerDown(e, "move")}
                >
                  {/* Rule of thirds */}
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="border border-white/20"
                      />
                    ))}
                  </div>
                  {(
                    [
                      ["nw", "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize"],
                      ["ne", "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize"],
                      ["sw", "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize"],
                      ["se", "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize"],
                      ["n", "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize"],
                      ["s", "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-ns-resize"],
                      ["w", "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize"],
                      ["e", "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize"],
                    ] as const
                  ).map(([mode, pos]) => (
                    <button
                      key={mode}
                      type="button"
                      aria-label={`Resize crop ${mode}`}
                      className={cn(
                        /* Visible handle + larger invisible touch target on mobile */
                        "absolute flex size-5 items-center justify-center sm:size-3.5",
                        "touch-manipulation before:absolute before:inset-[-6px] before:content-[''] sm:before:inset-[-4px]",
                        pos,
                      )}
                      onPointerDown={(e) => onCropPointerDown(e, mode)}
                    >
                      <span className="size-3.5 rounded-sm bg-white shadow sm:size-3" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Tool panels */}
        <div
          data-slot="image-editor-panel"
          className="border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_75%,transparent)] p-2.5 sm:p-3"
        >
          {tool === "crop" ? (
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["free", "Free"],
                  ["1:1", "1:1"],
                  ["4:3", "4:3"],
                  ["3:2", "3:2"],
                  ["16:9", "16:9"],
                  ["9:16", "9:16"],
                ] as const
              ).map(([value, label]) => {
                const active = aspect === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setAspect(value)}
                    className={cn(
                      "h-9 min-h-9 rounded-full border px-2.5 text-xs font-medium sm:h-8 sm:min-h-8 sm:px-3",
                      "border-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
                      "hover:bg-[color-mix(in_oklch,var(--glass-chrome-fg)_8%,transparent)]",
                      "touch-manipulation",
                      active &&
                        "border-[color-mix(in_oklch,var(--primary)_55%,transparent)] bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]",
                      focusRing,
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {tool === "transform" ? (
            <div className="flex flex-wrap items-center gap-2">
              <GlassIconButton
                type="button"
                variant="ghost"
                size="default"
                aria-label="Rotate left 90°"
                onClick={() =>
                  setTransform({
                    ...transform,
                    rotation: transform.rotation - 90,
                  })
                }
              >
                <RotateLeftIcon className="size-4" />
              </GlassIconButton>
              <GlassIconButton
                type="button"
                variant="ghost"
                size="default"
                aria-label="Rotate right 90°"
                onClick={() =>
                  setTransform({
                    ...transform,
                    rotation: transform.rotation + 90,
                  })
                }
              >
                <RotateIcon className="size-4" />
              </GlassIconButton>
              <GlassIconButton
                type="button"
                variant="ghost"
                size="default"
                aria-label="Flip horizontal"
                onClick={() =>
                  setTransform({ ...transform, flipX: !transform.flipX })
                }
              >
                <FlipHIcon className="size-4" />
              </GlassIconButton>
              <GlassIconButton
                type="button"
                variant="ghost"
                size="default"
                aria-label="Flip vertical"
                onClick={() =>
                  setTransform({ ...transform, flipY: !transform.flipY })
                }
              >
                <FlipVIcon className="size-4" />
              </GlassIconButton>
              <span className="w-full text-xs text-muted-foreground sm:ml-2 sm:w-auto">
                Rotation {normalizeRotation(transform.rotation)}°
                {transform.flipX ? " · Flip X" : ""}
                {transform.flipY ? " · Flip Y" : ""}
              </span>
            </div>
          ) : null}

          {tool === "adjust" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <FilterSlider
                id={`${baseId}-brightness`}
                label="Brightness"
                value={filters.brightness}
                min={0}
                max={200}
                unit="%"
                onChange={(brightness) => setFilters({ ...filters, brightness })}
              />
              <FilterSlider
                id={`${baseId}-contrast`}
                label="Contrast"
                value={filters.contrast}
                min={0}
                max={200}
                unit="%"
                onChange={(contrast) => setFilters({ ...filters, contrast })}
              />
              <FilterSlider
                id={`${baseId}-saturate`}
                label="Saturation"
                value={filters.saturate}
                min={0}
                max={200}
                unit="%"
                onChange={(saturate) => setFilters({ ...filters, saturate })}
              />
              <FilterSlider
                id={`${baseId}-grayscale`}
                label="Grayscale"
                value={filters.grayscale}
                min={0}
                max={100}
                unit="%"
                onChange={(grayscale) => setFilters({ ...filters, grayscale })}
              />
              <FilterSlider
                id={`${baseId}-sepia`}
                label="Sepia"
                value={filters.sepia}
                min={0}
                max={100}
                unit="%"
                onChange={(sepia) => setFilters({ ...filters, sepia })}
              />
              <FilterSlider
                id={`${baseId}-blur`}
                label="Blur"
                value={filters.blur}
                min={0}
                max={12}
                step={0.5}
                unit="px"
                onChange={(blur) => setFilters({ ...filters, blur })}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);
ImageEditor.displayName = "ImageEditor";

export {
  ImageEditor,
  imageEditorVariants,
  DEFAULT_IMAGE_CROP,
  DEFAULT_IMAGE_FILTERS,
  DEFAULT_IMAGE_TRANSFORM,
};
