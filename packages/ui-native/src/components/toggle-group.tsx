import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

type ToggleGroupType = "single" | "multiple";

interface ToggleGroupContextValue {
  type: ToggleGroupType;
  value: string[];
  onItemPress: (value: string) => void;
  size: "sm" | "default" | "lg";
  variant: "default" | "outline" | "chrome";
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export interface ToggleGroupProps extends ViewProps {
  type?: ToggleGroupType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "chrome";
  disabled?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function toArray(v?: string | string[]): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

export const ToggleGroup = forwardRef<View, ToggleGroupProps>(
  (
    {
      type = "single",
      value: valueProp,
      defaultValue,
      onValueChange,
      size = "default",
      variant = "default",
      disabled,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = useState(toArray(defaultValue));
    const value = isControlled ? toArray(valueProp) : internal;

    const onItemPress = (item: string) => {
      let next: string[];
      if (type === "single") {
        next = value.includes(item) ? [] : [item];
      } else {
        next = value.includes(item)
          ? value.filter((v) => v !== item)
          : [...value, item];
      }
      if (!isControlled) setInternal(next);
      onValueChange?.(type === "single" ? (next[0] ?? "") : next);
    };

    return (
      <ToggleGroupContext.Provider
        value={{ type, value, onItemPress, size, variant, disabled }}
      >
        <View
          ref={ref}
          style={cn(
            {
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing[1],
              padding: theme.spacing[1],
              borderRadius: theme.radii.xl,
              backgroundColor: colors.glassChromeBgEnv,
              borderWidth: 1,
              borderColor: colors.glassChromeBorder,
            },
            style,
          )}
          {...props}
        >
          {children}
        </View>
      </ToggleGroupContext.Provider>
    );
  },
);
ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends Omit<PressableProps, "children"> {
  value: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ToggleGroupItem = forwardRef<
  React.ElementRef<typeof Pressable>,
  ToggleGroupItemProps
>(({ value, children, disabled, style, ...props }, ref) => {
  const { theme, colors } = useTheme();
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error("ToggleGroupItem must be used within ToggleGroup");

  const selected = ctx.value.includes(value);
  const isDisabled = disabled || ctx.disabled;
  const height = ctx.size === "sm" ? 28 : ctx.size === "lg" ? 36 : 32;
  const fontSize =
    ctx.size === "sm" ? theme.fontSizes.xs : theme.fontSizes.sm;

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!isDisabled }}
      disabled={isDisabled}
      onPress={() => ctx.onItemPress(value)}
      style={cn(
        {
          height,
          paddingHorizontal: theme.spacing[3],
          borderRadius: theme.radii.lg,
          backgroundColor: selected ? colors.primary : "transparent",
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          style={{
            color: selected ? colors.primaryForeground : colors.foreground,
            fontSize,
            fontWeight: theme.fontWeights.medium,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";
