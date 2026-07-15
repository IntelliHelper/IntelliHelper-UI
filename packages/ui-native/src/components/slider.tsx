import { forwardRef, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type SliderVariant = "chrome" | "outline";
export type SliderSize = "sm" | "default" | "lg";

export interface SliderProps extends ViewProps {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  variant?: SliderVariant;
  size?: SliderSize;
  style?: StyleProp<ViewStyle>;
}

export const Slider = forwardRef<View, SliderProps>(
  (
    {
      value: valueProp,
      defaultValue = [0],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      variant = "chrome",
      size = "default",
      style,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = useState(defaultValue);
    const values = isControlled ? valueProp! : internal;
    const current = values[0] ?? min;

    const trackWidth = useRef(0);
    const trackHeight = size === "sm" ? 4 : size === "lg" ? 8 : 6;
    const thumb = size === "sm" ? 16 : size === "lg" ? 24 : 20;

    const setFromX = (x: number) => {
      if (!trackWidth.current) return;
      const ratio = Math.min(1, Math.max(0, x / trackWidth.current));
      let next = min + ratio * (max - min);
      if (step > 0) {
        next = Math.round(next / step) * step;
      }
      next = Math.min(max, Math.max(min, next));
      const arr = [next];
      if (!isControlled) setInternal(arr);
      onValueChange?.(arr);
    };

    const pan = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => !disabled,
          onMoveShouldSetPanResponder: () => !disabled,
          onPanResponderGrant: (e) => setFromX(e.nativeEvent.locationX),
          onPanResponderMove: (e) => setFromX(e.nativeEvent.locationX),
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [disabled, min, max, step, isControlled],
    );

    const pct = ((current - min) / (max - min || 1)) * 100;

    return (
      <View
        ref={ref}
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: current }}
        onLayout={(e: LayoutChangeEvent) => {
          trackWidth.current = e.nativeEvent.layout.width;
        }}
        style={cn(
          {
            height: thumb + 8,
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
            width: "100%",
          },
          style,
        )}
        {...pan.panHandlers}
        {...props}
      >
        <View
          style={{
            height: trackHeight,
            borderRadius: theme.radii.full,
            backgroundColor:
              variant === "outline"
                ? colors.glassSurfaceFill
                : colors.glassChromeBgEnv,
            borderWidth: 1,
            borderColor: colors.glassChromeBorder,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${pct}%`,
              backgroundColor: colors.primary,
              borderRadius: theme.radii.full,
            }}
          />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: `${pct}%`,
            marginLeft: -thumb / 2,
            width: thumb,
            height: thumb,
            borderRadius: theme.radii.full,
            backgroundColor: colors.glassIndicatorBg,
            borderWidth: 1,
            borderColor: colors.glassIndicatorBorder,
          }}
        />
      </View>
    );
  },
);
Slider.displayName = "Slider";
