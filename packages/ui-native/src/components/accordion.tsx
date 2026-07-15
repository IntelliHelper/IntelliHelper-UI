import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  type: AccordionType;
  open: string[];
  toggle: (value: string) => void;
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<string>("");

export interface AccordionProps extends ViewProps {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function toArray(v?: string | string[]) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

export const Accordion = forwardRef<View, AccordionProps>(
  (
    {
      type = "single",
      value: valueProp,
      defaultValue,
      onValueChange,
      collapsible = true,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = useState(toArray(defaultValue));
    const open = isControlled ? toArray(valueProp) : internal;

    const toggle = (item: string) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      let next: string[];
      if (type === "single") {
        if (open.includes(item)) {
          next = collapsible ? [] : open;
        } else {
          next = [item];
        }
      } else {
        next = open.includes(item)
          ? open.filter((v) => v !== item)
          : [...open, item];
      }
      if (!isControlled) setInternal(next);
      onValueChange?.(type === "single" ? (next[0] ?? "") : next);
    };

    return (
      <AccordionContext.Provider value={{ type, open, toggle, collapsible }}>
        <View ref={ref} style={cn({ gap: theme.spacing[2] }, style)} {...props}>
          {children}
        </View>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

export interface AccordionItemProps extends ViewProps {
  value: string;
  style?: StyleProp<ViewStyle>;
}

export const AccordionItem = forwardRef<View, AccordionItemProps>(
  ({ value, style, children, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <ItemContext.Provider value={value}>
        <View
          ref={ref}
          style={cn(
            {
              borderRadius: theme.radii.xl,
              borderWidth: 1,
              borderColor: colors.glassChromeBorder,
              backgroundColor: colors.glassChromeBgEnv,
              overflow: "hidden",
            },
            style,
          )}
          {...props}
        >
          {children}
        </View>
      </ItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AccordionTrigger({ children, style }: AccordionTriggerProps) {
  const { theme, colors } = useTheme();
  const ctx = useContext(AccordionContext);
  const value = useContext(ItemContext);
  if (!ctx) throw new Error("AccordionTrigger must be within Accordion");
  const open = ctx.open.includes(value);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={() => ctx.toggle(value)}
      style={cn(
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3.5],
        },
        style,
      )}
    >
      {typeof children === "string" ? (
        <Text
          style={{
            color: colors.foreground,
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontWeights.medium,
            flex: 1,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      <Text style={{ color: colors.mutedForeground, marginLeft: 8 }}>
        {open ? "▴" : "▾"}
      </Text>
    </Pressable>
  );
}

export interface AccordionContentProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export const AccordionContent = forwardRef<View, AccordionContentProps>(
  ({ style, children, ...props }, ref) => {
    const { theme, colors } = useTheme();
    const ctx = useContext(AccordionContext);
    const value = useContext(ItemContext);
    if (!ctx || !ctx.open.includes(value)) return null;

    return (
      <View
        ref={ref}
        style={cn(
          {
            paddingHorizontal: theme.spacing[4],
            paddingBottom: theme.spacing[4],
          },
          style,
        )}
        {...props}
      >
        {typeof children === "string" ? (
          <Text
            style={{
              color: colors.mutedForeground,
              fontSize: theme.fontSizes.sm,
              lineHeight: theme.fontSizes.sm * theme.lineHeights.relaxed,
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    );
  },
);
AccordionContent.displayName = "AccordionContent";
