export type TourSide = "top" | "right" | "bottom" | "left";
export type TourAlign = "start" | "center" | "end";
export type TourPreferredSide = TourSide | "auto";

export type TourRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type TourSize = {
  width: number;
  height: number;
};

export type TourViewport = {
  width: number;
  height: number;
};

const SIDE_ORDER: TourSide[] = ["bottom", "top", "right", "left"];

export function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

export function clampTourIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return clamp(Math.trunc(index), 0, length - 1);
}

export function inflateRect(rect: TourRect, padding: number): TourRect {
  return {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

function spaceFor(
  side: TourSide,
  target: TourRect,
  viewport: TourViewport,
  gap: number,
) {
  switch (side) {
    case "top":
      return target.top - gap;
    case "bottom":
      return viewport.height - (target.top + target.height) - gap;
    case "left":
      return target.left - gap;
    case "right":
      return viewport.width - (target.left + target.width) - gap;
    default: {
      const unreachable: never = side;
      return unreachable;
    }
  }
}

function spaceNeeded(side: TourSide, card: TourSize) {
  return side === "top" || side === "bottom" ? card.height : card.width;
}

export function chooseTourSide(
  target: TourRect,
  card: TourSize,
  viewport: TourViewport,
  preferred: TourPreferredSide,
  gap: number,
): TourSide {
  const fits = (side: TourSide) =>
    spaceFor(side, target, viewport, gap) >= spaceNeeded(side, card);

  const preferredSide: TourSide = preferred === "auto" ? "bottom" : preferred;
  if (preferred !== "auto" && fits(preferredSide)) return preferredSide;

  const candidates =
    preferred === "auto"
      ? SIDE_ORDER
      : [preferredSide, ...SIDE_ORDER.filter((side) => side !== preferredSide)];

  const fitting = candidates.find(fits);
  if (fitting) return fitting;

  return candidates.reduce((best, side) =>
    spaceFor(side, target, viewport, gap) > spaceFor(best, target, viewport, gap)
      ? side
      : best,
  );
}

function crossAxisStart(
  side: TourSide,
  target: TourRect,
  card: TourSize,
  align: TourAlign,
) {
  const horizontal = side === "top" || side === "bottom";
  const start = horizontal ? target.left : target.top;
  const size = horizontal ? target.width : target.height;
  const cross = horizontal ? card.width : card.height;

  if (align === "start") return start;
  if (align === "end") return start + size - cross;
  return start + (size - cross) / 2;
}

export type TourPlacement = {
  top: number;
  left: number;
  side: TourSide;
};

export function placeTourCard(
  target: TourRect,
  card: TourSize,
  viewport: TourViewport,
  preferred: TourPreferredSide,
  align: TourAlign,
  gap: number,
  margin: number,
): TourPlacement {
  const side = chooseTourSide(target, card, viewport, preferred, gap);
  const cross = crossAxisStart(side, target, card, align);

  let top = margin;
  let left = margin;

  switch (side) {
    case "bottom":
      top = target.top + target.height + gap;
      left = cross;
      break;
    case "top":
      top = target.top - gap - card.height;
      left = cross;
      break;
    case "right":
      left = target.left + target.width + gap;
      top = cross;
      break;
    case "left":
      left = target.left - gap - card.width;
      top = cross;
      break;
    default: {
      const unreachable: never = side;
      return unreachable;
    }
  }

  return {
    side,
    top: clamp(top, margin, viewport.height - card.height - margin),
    left: clamp(left, margin, viewport.width - card.width - margin),
  };
}

export function centerTourCard(
  card: TourSize,
  viewport: TourViewport,
  margin: number,
): Pick<TourPlacement, "top" | "left"> {
  return {
    top: clamp((viewport.height - card.height) / 2, margin, viewport.height - margin),
    left: clamp((viewport.width - card.width) / 2, margin, viewport.width - margin),
  };
}
