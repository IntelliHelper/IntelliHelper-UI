import { useEffect, useRef, useState } from "react";
import { Animated, Easing, type ViewStyle } from "react-native";
import { durations } from "../theme/tokens";

/** Spring configs roughly matching web `--ease-spring`. */
export const springs = {
  snappy: { friction: 7, tension: 140, useNativeDriver: true as const },
  soft: { friction: 9, tension: 80, useNativeDriver: true as const },
  thumb: { friction: 8, tension: 80, useNativeDriver: true as const },
} as const;

export const timings = {
  fast: durations.fast,
  normal: durations.normal,
  slow: durations.slow,
  enter: durations.enter,
} as const;

export function springTo(
  value: Animated.Value,
  toValue: number,
  config: keyof typeof springs = "snappy",
) {
  return Animated.spring(value, {
    toValue,
    ...springs[config],
  });
}

export function timingTo(
  value: Animated.Value,
  toValue: number,
  duration: number = timings.normal,
  easing = Easing.out(Easing.cubic),
) {
  return Animated.timing(value, {
    toValue,
    duration,
    easing,
    useNativeDriver: true,
  });
}

/**
 * Presence animation for overlays (Dialog, Sheet, Select, Popover).
 * Keeps content mounted through the exit animation, then unmounts.
 */
export function usePresence(open: boolean, duration: number = timings.normal) {
  const [mounted, setMounted] = useState(open);
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    let cancelled = false;

    if (open) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: Math.max(120, duration - 40),
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        // Only unmount if still closed (handles rapid open/close).
        if (finished && !cancelled && !openRef.current) {
          setMounted(false);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [open, duration, progress]);

  return { mounted, progress };
}

/** Overlay fade style from presence progress. */
export function overlayStyle(progress: Animated.Value): ViewStyle {
  return {
    opacity: progress as unknown as number,
  };
}

/** Center dialog: fade + slight scale-up (web dialog enter). */
export function dialogContentStyle(progress: Animated.Value): ViewStyle {
  return {
    opacity: progress as unknown as number,
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.96, 1],
        }) as unknown as number,
      },
    ],
  };
}

/** Sheet slide from an edge + fade. */
export function sheetContentStyle(
  progress: Animated.Value,
  side: "bottom" | "top" | "left" | "right",
): ViewStyle {
  const distance = 28;
  const from =
    side === "bottom" || side === "right" ? distance : -distance;

  if (side === "left" || side === "right") {
    return {
      opacity: progress as unknown as number,
      transform: [
        {
          translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [from, 0],
          }) as unknown as number,
        },
      ],
    };
  }

  return {
    opacity: progress as unknown as number,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [from, 0],
        }) as unknown as number,
      },
    ],
  };
}

/**
 * Press scale feedback (web button transform on active).
 * Returns animated style + press handlers to merge into Pressable.
 */
export function usePressScale(options?: {
  pressedScale?: number;
  disabled?: boolean | null;
}) {
  const pressedScale = options?.pressedScale ?? 0.97;
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (options?.disabled) return;
    Animated.spring(scale, {
      toValue: pressedScale,
      ...springs.snappy,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      ...springs.soft,
    }).start();
  };

  const style = {
    transform: [{ scale }],
  };

  return { scale, style, onPressIn, onPressOut };
}

/** Animate a 0–1 value when a boolean toggles (checkbox check, toggle on). */
export function useBooleanSpring(
  on: boolean,
  config: keyof typeof springs = "snappy",
) {
  const value = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(value, {
      toValue: on ? 1 : 0,
      ...springs[config],
    }).start();
  }, [on, value, config]);

  return value;
}

/**
 * Animate progress bar fill. Uses JS driver because width % is layout.
 */
export function useProgressWidth(pct: number, duration = timings.normal) {
  const width = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: pct,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, duration, width]);

  return width;
}
