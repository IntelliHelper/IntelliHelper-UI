import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import {
  overlayStyle,
  sheetContentStyle,
  timings,
  usePresence,
} from "../utils/animation";
import { cn } from "../utils/cn";

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("Sheet components must be used within Sheet");
  return ctx;
}

export interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function Sheet({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: SheetProps) {
  const isControlled = openProp !== undefined;
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? !!openProp : internal;
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({ children }: { children?: ReactNode }) {
  const { setOpen } = useSheet();
  return (
    <Pressable onPress={() => setOpen(true)} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

export function SheetClose({ children }: { children?: ReactNode }) {
  const { setOpen } = useSheet();
  return (
    <Pressable onPress={() => setOpen(false)} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

export type SheetSide = "bottom" | "top" | "left" | "right";

export interface SheetContentProps extends ViewProps {
  side?: SheetSide;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  showClose?: boolean;
}

export function SheetContent({
  side = "bottom",
  children,
  style,
  showClose = true,
  ...props
}: SheetContentProps) {
  const { theme, colors } = useTheme();
  const { open, setOpen } = useSheet();
  const { mounted, progress } = usePresence(open, timings.slow);

  const sideStyle: ViewStyle =
    side === "bottom"
      ? {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopLeftRadius: theme.radii["2xl"],
          borderTopRightRadius: theme.radii["2xl"],
          maxHeight: "85%",
          paddingBottom: theme.spacing[8],
        }
      : side === "top"
        ? {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            borderBottomLeftRadius: theme.radii["2xl"],
            borderBottomRightRadius: theme.radii["2xl"],
            maxHeight: "85%",
          }
        : side === "left"
          ? {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "80%",
              maxWidth: 360,
              borderTopRightRadius: theme.radii["2xl"],
              borderBottomRightRadius: theme.radii["2xl"],
            }
          : {
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "80%",
              maxWidth: 360,
              borderTopLeftRadius: theme.radii["2xl"],
              borderBottomLeftRadius: theme.radii["2xl"],
            };

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={() => setOpen(false)}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setOpen(false)}
        >
          <Animated.View
            style={[
              {
                flex: 1,
                backgroundColor: colors.overlay,
              },
              overlayStyle(progress),
            ]}
          />
        </Pressable>
        <Animated.View
          style={[
            sheetContentStyle(progress, side),
            sideStyle,
            {
              backgroundColor: colors.popover,
              borderWidth: 1,
              borderColor: colors.glassChromeBorder,
              padding: theme.spacing[6],
            },
            style,
          ]}
          {...props}
        >
          <Pressable onPress={(e) => e.stopPropagation?.()}>
            {side === "bottom" ? (
              <View
                style={{
                  alignItems: "center",
                  marginBottom: theme.spacing[3],
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colors.border,
                  }}
                />
              </View>
            ) : null}
            {showClose ? (
              <Pressable
                onPress={() => setOpen(false)}
                accessibilityLabel="Close"
                style={{
                  position: "absolute",
                  top: theme.spacing[3],
                  right: theme.spacing[3],
                  zIndex: 1,
                  padding: theme.spacing[2],
                }}
              >
                <Text style={{ color: colors.mutedForeground, fontSize: 18 }}>✕</Text>
              </Pressable>
            ) : null}
            {children}
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

export const SheetHeader = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            flexDirection: "column",
            gap: theme.spacing[1.5],
            marginBottom: theme.spacing[4],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
SheetHeader.displayName = "SheetHeader";

export const SheetFooter = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            flexDirection: "row",
            gap: theme.spacing[2],
            marginTop: theme.spacing[4],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
SheetFooter.displayName = "SheetFooter";

export const SheetTitle = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color: colors.foreground,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semibold,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color: colors.mutedForeground,
            fontSize: theme.fontSizes.sm,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
SheetDescription.displayName = "SheetDescription";

export const SheetPortal = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
