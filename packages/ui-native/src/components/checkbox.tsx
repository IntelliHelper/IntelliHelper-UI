import { forwardRef, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { useBooleanSpring, usePressScale } from "../utils/animation";
import { cn } from "../utils/cn";

export type CheckboxVariant = "chrome" | "outline";
export type CheckboxSize = "sm" | "default" | "lg";
export type CheckedState = boolean | "indeterminate";

export interface CheckboxProps extends Omit<PressableProps, "onPress"> {
  checked?: CheckedState;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  style?: StyleProp<ViewStyle>;
}

export const Checkbox = forwardRef<
  React.ElementRef<typeof Pressable>,
  CheckboxProps
>(
  (
    {
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      variant = "chrome",
      size = "default",
      disabled,
      style,
      onPressIn,
      onPressOut,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const isControlled = checkedProp !== undefined;
    const [internal, setInternal] = useState(defaultChecked);
    const checked = isControlled ? checkedProp : internal;
    const isOn = checked === true || checked === "indeterminate";
    const checkAnim = useBooleanSpring(isOn, "snappy");
    const press = usePressScale({ pressedScale: 0.9, disabled: !!disabled });

    const dim = size === "sm" ? 16 : size === "lg" ? 22 : 18;

    return (
      <Animated.View style={press.style}>
        <Pressable
          ref={ref}
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: checked === "indeterminate" ? "mixed" : !!checked,
            disabled: !!disabled,
          }}
          disabled={disabled}
          onPressIn={(e) => {
            press.onPressIn();
            onPressIn?.(e);
          }}
          onPressOut={(e) => {
            press.onPressOut();
            onPressOut?.(e);
          }}
          onPress={() => {
            const next = checked !== true;
            if (!isControlled) setInternal(next);
            onCheckedChange?.(next);
          }}
          style={cn(
            {
              width: dim,
              height: dim,
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: isOn
                ? "rgba(26,26,26,0.35)"
                : colors.glassChromeBorder,
              backgroundColor: isOn
                ? colors.primary
                : variant === "outline"
                  ? colors.glassSurfaceFill
                  : colors.glassChromeBgEnv,
              alignItems: "center",
              justifyContent: "center",
              opacity: disabled ? 0.5 : 1,
            },
            style,
          )}
          {...props}
        >
          {isOn ? (
            <Animated.View
              style={{
                opacity: checkAnim,
                transform: [
                  {
                    scale: checkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              }}
            >
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontSize: dim * 0.65,
                  fontWeight: "700",
                  lineHeight: dim,
                }}
              >
                {checked === "indeterminate" ? "−" : "✓"}
              </Text>
            </Animated.View>
          ) : null}
        </Pressable>
      </Animated.View>
    );
  },
);
Checkbox.displayName = "Checkbox";
