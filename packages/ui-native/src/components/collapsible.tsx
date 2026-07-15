import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { cn } from "../utils/cn";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export interface CollapsibleProps extends ViewProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  style,
  ...props
}: CollapsibleProps) {
  const isControlled = openProp !== undefined;
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? !!openProp : internal;
  const setOpen = (next: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <View style={style} {...props}>
        {children}
      </View>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  children,
  style,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error("CollapsibleTrigger must be within Collapsible");
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: ctx.open }}
      onPress={() => ctx.setOpen(!ctx.open)}
      style={style}
    >
      {children}
    </Pressable>
  );
}

export function CollapsibleContent({
  children,
  style,
  ...props
}: ViewProps & { style?: StyleProp<ViewStyle> }) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx || !ctx.open) return null;
  return (
    <View style={cn(style)} {...props}>
      {children}
    </View>
  );
}
