export type ImageEditorCrop = {
  /** Normalized 0–1 relative to the displayed (transformed) image box */
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageEditorFilters = {
  brightness: number; // 0–200, 100 = none
  contrast: number;
  saturate: number;
  grayscale: number; // 0–100
  sepia: number; // 0–100
  blur: number; // px 0–20
};

export type ImageEditorTransform = {
  rotation: number; // degrees, multiples of 90 typically
  flipX: boolean;
  flipY: boolean;
};

export type ImageEditorExportOptions = {
  mimeType?: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

export const DEFAULT_IMAGE_FILTERS: ImageEditorFilters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
};

export const DEFAULT_IMAGE_TRANSFORM: ImageEditorTransform = {
  rotation: 0,
  flipX: false,
  flipY: false,
};

export const DEFAULT_IMAGE_CROP: ImageEditorCrop = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
};

export type ImageAspectPreset = "free" | "1:1" | "4:3" | "3:2" | "16:9" | "9:16";

export function aspectPresetRatio(preset: ImageAspectPreset): number | null {
  switch (preset) {
    case "1:1":
      return 1;
    case "4:3":
      return 4 / 3;
    case "3:2":
      return 3 / 2;
    case "16:9":
      return 16 / 9;
    case "9:16":
      return 9 / 16;
    default:
      return null;
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeRotation(degrees: number) {
  const n = ((degrees % 360) + 360) % 360;
  return n;
}

export function filtersToCss(filters: ImageEditorFilters): string {
  return [
    `brightness(${filters.brightness}%)`,
    `contrast(${filters.contrast}%)`,
    `saturate(${filters.saturate}%)`,
    `grayscale(${filters.grayscale}%)`,
    `sepia(${filters.sepia}%)`,
    `blur(${filters.blur}px)`,
  ].join(" ");
}

export function areFiltersDefault(filters: ImageEditorFilters) {
  return (
    filters.brightness === DEFAULT_IMAGE_FILTERS.brightness &&
    filters.contrast === DEFAULT_IMAGE_FILTERS.contrast &&
    filters.saturate === DEFAULT_IMAGE_FILTERS.saturate &&
    filters.grayscale === DEFAULT_IMAGE_FILTERS.grayscale &&
    filters.sepia === DEFAULT_IMAGE_FILTERS.sepia &&
    filters.blur === DEFAULT_IMAGE_FILTERS.blur
  );
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

/**
 * Fit crop rect to an aspect ratio while keeping it inside [0,1] bounds.
 * Anchors from the crop center.
 */
export function fitCropToAspect(
  crop: ImageEditorCrop,
  aspect: number | null,
): ImageEditorCrop {
  if (!aspect || aspect <= 0) {
    return {
      x: clamp(crop.x, 0, 1),
      y: clamp(crop.y, 0, 1),
      width: clamp(crop.width, 0.05, 1),
      height: clamp(crop.height, 0.05, 1),
    };
  }

  let width = clamp(crop.width, 0.05, 1);
  let height = width / aspect;

  if (height > 1) {
    height = 1;
    width = height * aspect;
  }
  if (width > 1) {
    width = 1;
    height = width / aspect;
  }

  const cx = crop.x + crop.width / 2;
  const cy = crop.y + crop.height / 2;
  let x = cx - width / 2;
  let y = cy - height / 2;
  x = clamp(x, 0, 1 - width);
  y = clamp(y, 0, 1 - height);

  return { x, y, width, height };
}

/**
 * Draw the image with rotation, flip, filters, and optional crop into a canvas.
 * Rotation is applied in 90° steps for reliable pixel export.
 */
export async function renderEditedImage(
  source: string | HTMLImageElement,
  options: {
    crop?: ImageEditorCrop;
    transform?: ImageEditorTransform;
    filters?: ImageEditorFilters;
    exportOptions?: ImageEditorExportOptions;
  } = {},
): Promise<HTMLCanvasElement> {
  const img =
    typeof source === "string" ? await loadImageElement(source) : source;

  const crop = options.crop ?? DEFAULT_IMAGE_CROP;
  const transform = {
    ...DEFAULT_IMAGE_TRANSFORM,
    ...options.transform,
  };
  const filters = {
    ...DEFAULT_IMAGE_FILTERS,
    ...options.filters,
  };
  const exportOptions = options.exportOptions ?? {};

  const rotation = normalizeRotation(transform.rotation);
  const quarterTurns = Math.round(rotation / 90) % 4;
  const swap = quarterTurns % 2 === 1;

  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  // Work in source pixel space before rotation: crop is relative to pre-rotation display.
  const sx = clamp(crop.x, 0, 1) * srcW;
  const sy = clamp(crop.y, 0, 1) * srcH;
  const sw = clamp(crop.width, 0.01, 1) * srcW;
  const sh = clamp(crop.height, 0.01, 1) * srcH;

  let outW = Math.max(1, Math.round(sw));
  let outH = Math.max(1, Math.round(sh));
  if (swap) {
    const t = outW;
    outW = outH;
    outH = t;
  }

  if (exportOptions.maxWidth || exportOptions.maxHeight) {
    const maxW = exportOptions.maxWidth ?? outW;
    const maxH = exportOptions.maxHeight ?? outH;
    const scale = Math.min(1, maxW / outW, maxH / outH);
    outW = Math.max(1, Math.round(outW * scale));
    outH = Math.max(1, Math.round(outH * scale));
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D not available");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.filter = filtersToCss({ ...filters, blur: filters.blur });

  ctx.save();
  ctx.translate(outW / 2, outH / 2);
  ctx.rotate((quarterTurns * 90 * Math.PI) / 180);
  ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);

  const drawW = swap ? outH : outW;
  const drawH = swap ? outW : outH;
  ctx.drawImage(img, sx, sy, sw, sh, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  return canvas;
}

export async function exportEditedImage(
  source: string | HTMLImageElement,
  options: {
    crop?: ImageEditorCrop;
    transform?: ImageEditorTransform;
    filters?: ImageEditorFilters;
    exportOptions?: ImageEditorExportOptions;
  } = {},
): Promise<Blob> {
  const canvas = await renderEditedImage(source, options);
  const mimeType = options.exportOptions?.mimeType ?? "image/png";
  const quality = options.exportOptions?.quality ?? 0.92;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to export image"));
      },
      mimeType,
      quality,
    );
  });
}

export async function exportEditedDataUrl(
  source: string | HTMLImageElement,
  options: {
    crop?: ImageEditorCrop;
    transform?: ImageEditorTransform;
    filters?: ImageEditorFilters;
    exportOptions?: ImageEditorExportOptions;
  } = {},
): Promise<string> {
  const canvas = await renderEditedImage(source, options);
  const mimeType = options.exportOptions?.mimeType ?? "image/png";
  const quality = options.exportOptions?.quality ?? 0.92;
  return canvas.toDataURL(mimeType, quality);
}
