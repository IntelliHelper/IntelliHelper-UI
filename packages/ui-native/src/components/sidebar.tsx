import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  Modal,
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
import { Separator } from "./separator";

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SidebarProvider({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
  style,
}: SidebarProviderProps) {
  const isControlled = openProp !== undefined;
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? !!openProp : internal;
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, toggle: () => setOpen(!open) }}
    >
      <View style={cn({ flex: 1, flexDirection: "row" }, style)}>
        {children}
      </View>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends ViewProps {
  side?: "left" | "right";
  /** Use modal drawer overlay (mobile default). */
  collapsible?: "offcanvas" | "none";
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  width?: number;
}

export function Sidebar({
  side = "left",
  collapsible = "offcanvas",
  children,
  style,
  width = 280,
  ...props
}: SidebarProps) {
  const { theme, colors } = useTheme();
  const { open, setOpen } = useSidebar();

  if (collapsible === "none") {
    return (
      <View
        style={cn(
          {
            width,
            backgroundColor: colors.glassChromeBgEnv,
            borderRightWidth: side === "left" ? 1 : 0,
            borderLeftWidth: side === "right" ? 1 : 0,
            borderColor: colors.glassChromeBorder,
            padding: theme.spacing[3],
          },
          style,
        )}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: colors.overlay, flexDirection: "row" }}
        onPress={() => setOpen(false)}
      >
        <Pressable
          onPress={(e) => e.stopPropagation?.()}
          style={cn(
            {
              width,
              height: "100%",
              backgroundColor: colors.popover,
              borderColor: colors.glassChromeBorder,
              borderRightWidth: side === "left" ? 1 : 0,
              borderLeftWidth: side === "right" ? 1 : 0,
              padding: theme.spacing[3],
              marginLeft: side === "right" ? "auto" : 0,
            },
            style,
          )}
          {...props}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function SidebarTrigger({
  style,
  ...props
}: Omit<PressableProps, "onPress"> & { style?: StyleProp<ViewStyle> }) {
  const { theme, colors } = useTheme();
  const { toggle } = useSidebar();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Toggle sidebar"
      onPress={toggle}
      style={cn(
        {
          width: 36,
          height: 36,
          borderRadius: theme.radii.lg,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.glassChromeBgEnv,
          borderWidth: 1,
          borderColor: colors.glassChromeBorder,
        },
        style,
      )}
      {...props}
    >
      <Text style={{ color: colors.foreground }}>☰</Text>
    </Pressable>
  );
}

export function SidebarRail() {
  return null;
}

export const SidebarInset = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={cn({ flex: 1 }, style)} {...props} />
  ),
);
SidebarInset.displayName = "SidebarInset";

export const SidebarHeader = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            gap: theme.spacing[2],
            paddingBottom: theme.spacing[3],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            marginTop: "auto" as unknown as number,
            gap: theme.spacing[2],
            paddingTop: theme.spacing[3],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
SidebarFooter.displayName = "SidebarFooter";

export const SidebarContent = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={cn({ flex: 1, gap: 4 }, style)} {...props} />
  ),
);
SidebarContent.displayName = "SidebarContent";

export function SidebarSeparator(props: ViewProps) {
  return <Separator {...props} />;
}

export const SidebarGroup = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn({ gap: theme.spacing[1], marginBottom: theme.spacing[3] }, style)}
        {...props}
      />
    );
  },
);
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = forwardRef<Text, { children?: ReactNode; style?: StyleProp<ViewStyle> }>(
  ({ children, style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color: colors.mutedForeground,
            fontSize: theme.fontSizes.xs,
            fontWeight: theme.fontWeights.semibold,
            textTransform: "uppercase",
            paddingHorizontal: theme.spacing[2],
            paddingVertical: theme.spacing[1],
          },
          style as object,
        )}
        {...props}
      >
        {children}
      </Text>
    );
  },
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = forwardRef<View, ViewProps>((props, ref) => (
  <View ref={ref} {...props} />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarMenu = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={cn({ gap: 2 }, style)} {...props} />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = forwardRef<View, ViewProps>((props, ref) => (
  <View ref={ref} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

export interface SidebarMenuButtonProps
  extends Omit<PressableProps, "children"> {
  isActive?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SidebarMenuButton = forwardRef<
  React.ElementRef<typeof Pressable>,
  SidebarMenuButtonProps
>(({ isActive, children, style, ...props }, ref) => {
  const { theme, colors } = useTheme();
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ selected: !!isActive }}
      style={cn(
        {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing[2],
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[2.5],
          borderRadius: theme.radii.lg,
          backgroundColor: isActive ? colors.glassChromeBg : "transparent",
        },
        style,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          style={{
            color: colors.foreground,
            fontSize: theme.fontSizes.sm,
            fontWeight: isActive
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
SidebarMenuButton.displayName = "SidebarMenuButton";
