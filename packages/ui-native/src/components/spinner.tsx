import {
  forwardRef,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type SpinnerVariant = "default" | "primary" | "muted" | "chrome";
export type SpinnerSize = "sm" | "default" | "lg" | "xl";
/** Visual spinner style. Color stays on `variant`. */
export type SpinnerType =
  | "default"
  | "ring"
  | "dots"
  | "bars"
  | "pulse"
  | "apple";

export interface SpinnerProps extends ViewProps {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  type?: SpinnerType;
  style?: StyleProp<ViewStyle>;
}

const sizeMap: Record<SpinnerSize, "small" | "large"> = {
  sm: "small",
  default: "small",
  lg: "large",
  xl: "large",
};

const dimMap: Record<SpinnerSize, number> = {
  sm: 14,
  default: 16,
  lg: 24,
  xl: 32,
};

function useLoop(
  duration: number,
  config?: { useNativeDriver?: boolean },
) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: config?.useNativeDriver ?? true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
      value.setValue(0);
    };
  }, [duration, value, config?.useNativeDriver]);

  return value;
}

function DotsSpinner({
  color,
  dim,
}: {
  color: string;
  dim: number;
}) {
  const progress = useLoop(900);
  const dots = [0, 1, 2] as const;

  return (
    <View
      style={{
        width: dim,
        height: dim,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Math.max(2, dim * 0.12),
      }}
    >
      {dots.map((index) => {
        const inputRange = [0, 0.2 + index * 0.15, 0.45 + index * 0.15, 1];
        const translateY = progress.interpolate({
          inputRange,
          outputRange: [0, -dim * 0.22, 0, 0],
          extrapolate: "clamp",
        });
        const opacity = progress.interpolate({
          inputRange,
          outputRange: [0.45, 1, 0.45, 0.45],
          extrapolate: "clamp",
        });
        const size = Math.max(3, dim * 0.22);
        return (
          <Animated.View
            key={index}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              opacity,
              transform: [{ translateY }],
            }}
          />
        );
      })}
    </View>
  );
}

function BarsSpinner({
  color,
  dim,
}: {
  color: string;
  dim: number;
}) {
  const progress = useLoop(800);
  const bars = [0, 1, 2] as const;

  return (
    <View
      style={{
        width: dim,
        height: dim,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Math.max(2, dim * 0.1),
      }}
    >
      {bars.map((index) => {
        const inputRange = [0, 0.2 + index * 0.12, 0.45 + index * 0.12, 1];
        const scaleY = progress.interpolate({
          inputRange,
          outputRange: [0.35, 1, 0.35, 0.35],
          extrapolate: "clamp",
        });
        const width = Math.max(2, dim * 0.16);
        return (
          <Animated.View
            key={index}
            style={{
              width,
              height: dim * 0.72,
              borderRadius: width,
              backgroundColor: color,
              transform: [{ scaleY }],
            }}
          />
        );
      })}
    </View>
  );
}

function PulseSpinner({
  color,
  dim,
}: {
  color: string;
  dim: number;
}) {
  const progress = useLoop(1100);

  const scale = progress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0.55, 1, 0.55],
  });
  const pingScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.35],
  });
  const pingOpacity = progress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.35, 0.08, 0],
  });

  return (
    <View
      style={{
        width: dim,
        height: dim,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: color,
          opacity: pingOpacity,
          transform: [{ scale: pingScale }],
        }}
      />
      <Animated.View
        style={{
          width: dim * 0.45,
          height: dim * 0.45,
          borderRadius: dim,
          backgroundColor: color,
          transform: [{ scale }],
        }}
      />
    </View>
  );
}

/** Classic iOS-style 12-spoke activity indicator */
function AppleSpinner({
  color,
  dim,
}: {
  color: string;
  dim: number;
}) {
  const progress = useLoop(850);
  const spokeCount = 12;
  const spokeWidth = Math.max(1.5, dim * 0.12);
  const spokeHeight = dim * 0.28;
  const radius = dim * 0.5 - spokeHeight * 0.55;

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        width: dim,
        height: dim,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate }],
      }}
    >
      {Array.from({ length: spokeCount }, (_, index) => {
        const angle = (index * 360) / spokeCount;
        return (
          <View
            key={index}
            style={{
              position: "absolute",
              width: spokeWidth,
              height: spokeHeight,
              borderRadius: spokeWidth,
              backgroundColor: color,
              opacity: 0.15 + (index / (spokeCount - 1)) * 0.85,
              transform: [
                { rotate: `${angle}deg` },
                { translateY: -radius },
              ],
            }}
          />
        );
      })}
    </Animated.View>
  );
}

export const Spinner = forwardRef<View, SpinnerProps>(
  (
    {
      variant = "default",
      size = "default",
      type = "default",
      style,
      ...props
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const color =
      variant === "primary"
        ? colors.primary
        : variant === "muted"
          ? colors.mutedForeground
          : variant === "chrome"
            ? colors.glassChromeFg
            : colors.foreground;
    const dim = dimMap[size];

    let body: ReactNode;
    if (type === "dots") {
      body = <DotsSpinner color={color} dim={dim} />;
    } else if (type === "bars") {
      body = <BarsSpinner color={color} dim={dim} />;
    } else if (type === "pulse") {
      body = <PulseSpinner color={color} dim={dim} />;
    } else if (type === "apple") {
      body = <AppleSpinner color={color} dim={dim} />;
    } else {
      // default + ring both use the platform indicator (single visual family)
      body = <ActivityIndicator color={color} size={sizeMap[size]} />;
    }

    return (
      <View
        ref={ref}
        accessibilityRole="progressbar"
        accessibilityLabel="Loading"
        accessibilityState={{ busy: true }}
        style={cn(
          {
            width: dim,
            height: dim,
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        )}
        {...props}
      >
        {body}
      </View>
    );
  },
);
Spinner.displayName = "Spinner";
