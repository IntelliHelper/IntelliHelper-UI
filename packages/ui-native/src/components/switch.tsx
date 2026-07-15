import { forwardRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { springs } from "../utils/animation";
import { cn } from "../utils/cn";

export type SwitchVariant = "chrome" | "outline";
export type SwitchSize = "sm" | "default" | "lg";

export interface SwitchProps extends Omit<PressableProps, "onPress"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  variant?: SwitchVariant;
  size?: SwitchSize;
  style?: StyleProp<ViewStyle>;
}

export const Switch = forwardRef<React.ElementRef<typeof Pressable>, SwitchProps>(
  (
    {
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      variant = "chrome",
      size = "default",
      disabled,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const isControlled = checkedProp !== undefined;
    const [internal, setInternal] = useState(defaultChecked);
    const checked = isControlled ? !!checkedProp : internal;

    const dims =
      size === "sm"
        ? { w: 36, h: 20, thumb: 14, travel: 16 }
        : size === "lg"
          ? { w: 52, h: 28, thumb: 24, travel: 22 }
          : { w: 44, h: 24, thumb: 20, travel: 18 };

    const anim = useRef(new Animated.Value(checked ? 1 : 0)).current;

    useEffect(() => {
      Animated.spring(anim, {
        toValue: checked ? 1 : 0,
        ...springs.thumb,
      }).start();
    }, [checked, anim]);

    const trackBg = checked
      ? variant === "outline"
        ? colors.primary
        : colors.primary
      : variant === "outline"
        ? colors.glassSurfaceFill
        : colors.glassChromeBgEnv;

    return (
      <Pressable
        ref={ref}
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled: !!disabled }}
        disabled={disabled}
        onPress={() => {
          const next = !checked;
          if (!isControlled) setInternal(next);
          onCheckedChange?.(next);
        }}
        style={cn(
          {
            width: dims.w,
            height: dims.h,
            borderRadius: theme.radii.full,
            borderWidth: 1,
            borderColor: checked
              ? "rgba(26,26,26,0.25)"
              : colors.glassChromeBorder,
            backgroundColor: trackBg,
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
            paddingHorizontal: 2,
          },
          style,
        )}
        {...props}
      >
        <Animated.View
          style={{
            width: dims.thumb,
            height: dims.thumb,
            borderRadius: theme.radii.full,
            backgroundColor: colors.glassIndicatorBg,
            borderWidth: 1,
            borderColor: colors.glassIndicatorBorder,
            transform: [
              {
                translateX: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, dims.travel],
                }),
              },
            ],
          }}
        />
      </Pressable>
    );
  },
);
Switch.displayName = "Switch";
