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

interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  size: "sm" | "default" | "lg";
  variant: "chrome" | "plain";
}

const TabsContext = createContext<TabsContextValue>({
  size: "default",
  variant: "chrome",
});

export interface TabsProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "default" | "lg";
  variant?: "chrome" | "plain";
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Tabs = forwardRef<View, TabsProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      size = "default",
      variant = "chrome",
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = useState(defaultValue);
    const value = isControlled ? valueProp : internal;

    return (
      <TabsContext.Provider
        value={{
          value,
          onValueChange: (v) => {
            if (!isControlled) setInternal(v);
            onValueChange?.(v);
          },
          size,
          variant,
        }}
      >
        <View ref={ref} style={style} {...props}>
          {children}
        </View>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export const TabsList = forwardRef<View, TabsListProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    const ctx = useContext(TabsContext);
    const height = ctx.size === "sm" ? 36 : ctx.size === "lg" ? 44 : 40;

    return (
      <View
        ref={ref}
        style={cn(
          {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing[1],
            padding: theme.spacing[1],
            height,
            borderRadius: theme.radii["2xl"],
            backgroundColor:
              ctx.variant === "chrome"
                ? colors.glassChromeBgEnv
                : colors.glassSurfaceFill,
            borderWidth: 1,
            borderColor: colors.glassChromeBorder,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends Omit<PressableProps, "children"> {
  value: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const TabsTrigger = forwardRef<
  React.ElementRef<typeof Pressable>,
  TabsTriggerProps
>(({ value, children, style, ...props }, ref) => {
  const { theme, colors } = useTheme();
  const ctx = useContext(TabsContext);
  const active = ctx.value === value;
  const fontSize =
    ctx.size === "sm" ? theme.fontSizes.xs : theme.fontSizes.sm;

  return (
    <Pressable
      ref={ref}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={() => ctx.onValueChange?.(value)}
      style={cn(
        {
          flex: 1,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radii.xl,
          paddingHorizontal: theme.spacing[3],
          backgroundColor: active ? colors.glassIndicatorBg : "transparent",
        },
        style,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          style={{
            color: active ? colors.foreground : colors.mutedForeground,
            fontSize,
            fontWeight: active
              ? theme.fontWeights.semibold
              : theme.fontWeights.medium,
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
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends ViewProps {
  value: string;
  style?: StyleProp<ViewStyle>;
}

export const TabsContent = forwardRef<View, TabsContentProps>(
  ({ value, style, children, ...props }, ref) => {
    const ctx = useContext(TabsContext);
    if (ctx.value !== value) return null;
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn({ marginTop: theme.spacing[4] }, style)}
        {...props}
      >
        {children}
      </View>
    );
  },
);
TabsContent.displayName = "TabsContent";
