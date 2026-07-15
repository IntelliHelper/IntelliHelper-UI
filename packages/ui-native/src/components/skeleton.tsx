import { useEffect, useRef, forwardRef } from "react";
import {
  Animated,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type SkeletonVariant = "default" | "chrome" | "text";
export type SkeletonRounded = "none" | "sm" | "md" | "lg" | "full";

export interface SkeletonProps extends ViewProps {
  variant?: SkeletonVariant;
  animated?: boolean;
  rounded?: SkeletonRounded;
  style?: StyleProp<ViewStyle>;
  width?: number | `${number}%`;
  height?: number;
}

export const Skeleton = forwardRef<View, SkeletonProps>(
  (
    {
      variant = "default",
      animated = true,
      rounded = "md",
      style,
      width,
      height,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const opacity = useRef(new Animated.Value(0.45)).current;

    useEffect(() => {
      if (!animated) return;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.45,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }, [animated, opacity]);

    const radiusMap = {
      none: 0,
      sm: theme.radii.sm,
      md: theme.radii.md,
      lg: theme.radii.lg,
      full: theme.radii.full,
    };

    const bg =
      variant === "chrome" ? colors.glassChromeBgEnv : colors.glassChromeBgEnv;

    return (
      <Animated.View
        ref={ref}
        style={cn(
          {
            backgroundColor: bg,
            borderRadius: radiusMap[rounded],
            opacity: animated ? opacity : 1,
            width: width ?? (variant === "text" ? "100%" : undefined),
            height: height ?? (variant === "text" ? 16 : undefined),
            minHeight: height ?? (variant === "text" ? 16 : 12),
          },
          style,
        )}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";
