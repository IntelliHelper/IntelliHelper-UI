import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size: "sm" | "default" | "lg";
  variant: "chrome" | "outline";
}

const RadioGroupContext = createContext<RadioGroupContextValue>({
  size: "default",
  variant: "chrome",
});

export interface RadioGroupProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "chrome" | "outline";
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const RadioGroup = forwardRef<View, RadioGroupProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled,
      size = "default",
      variant = "chrome",
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = useState(defaultValue);
    const value = isControlled ? valueProp : internal;

    return (
      <RadioGroupContext.Provider
        value={{
          value,
          onValueChange: (v) => {
            if (!isControlled) setInternal(v);
            onValueChange?.(v);
          },
          disabled,
          size,
          variant,
        }}
      >
        <View
          ref={ref}
          accessibilityRole="radiogroup"
          style={cn({ gap: theme.spacing[2] }, style)}
          {...props}
        >
          {children}
        </View>
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends Omit<PressableProps, "onPress"> {
  value: string;
  style?: StyleProp<ViewStyle>;
}

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof Pressable>,
  RadioGroupItemProps
>(({ value, disabled, style, ...props }, ref) => {
  const { theme, colors } = useTheme();
  const ctx = useContext(RadioGroupContext);
  const selected = ctx.value === value;
  const isDisabled = disabled || ctx.disabled;
  const dim = ctx.size === "sm" ? 16 : ctx.size === "lg" ? 22 : 18;
  const dot = dim * 0.45;

  return (
    <Pressable
      ref={ref}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !!isDisabled }}
      disabled={isDisabled}
      onPress={() => ctx.onValueChange?.(value)}
      style={cn(
        {
          width: dim,
          height: dim,
          borderRadius: theme.radii.full,
          borderWidth: 1.5,
          borderColor: selected ? colors.primary : colors.glassChromeBorder,
          backgroundColor:
            ctx.variant === "outline"
              ? colors.glassSurfaceFill
              : colors.glassChromeBgEnv,
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      )}
      {...props}
    >
      {selected ? (
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: theme.radii.full,
            backgroundColor: colors.primary,
          }}
        />
      ) : null}
    </Pressable>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";
