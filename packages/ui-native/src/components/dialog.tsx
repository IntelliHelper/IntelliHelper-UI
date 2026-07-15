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
  dialogContentStyle,
  overlayStyle,
  timings,
  usePresence,
} from "../utils/animation";
import { cn } from "../utils/cn";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within Dialog");
  return ctx;
}

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const isControlled = openProp !== undefined;
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? !!openProp : internal;
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  asChild,
}: {
  children: ReactNode;
  asChild?: boolean;
}) {
  const { setOpen } = useDialog();
  if (asChild && typeof children === "object" && children !== null && "props" in (children as object)) {
    // consumers should wrap Pressable themselves
  }
  return (
    <Pressable onPress={() => setOpen(true)} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

export function DialogClose({ children }: { children?: ReactNode }) {
  const { setOpen } = useDialog();
  return (
    <Pressable onPress={() => setOpen(false)} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

export type DialogOverlayBlur = "none" | "sm" | "default" | "lg" | "xl" | "heavy";
export type DialogOverlayDim = "none" | "light" | "default" | "heavy";

export interface DialogContentProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  dim?: DialogOverlayDim;
  showClose?: boolean;
}

export function DialogContent({
  children,
  style,
  dim = "default",
  showClose = true,
  ...props
}: DialogContentProps) {
  const { theme, colors } = useTheme();
  const { open, setOpen } = useDialog();
  const { mounted, progress } = usePresence(open, timings.normal);

  const overlayBg =
    dim === "none"
      ? "transparent"
      : dim === "light"
        ? "rgba(0,0,0,0.12)"
        : dim === "heavy"
          ? colors.overlayHeavy
          : colors.overlay;

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={() => setOpen(false)}
    >
      <View style={{ flex: 1 }}>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              ...StyleSheetAbsoluteFill,
              backgroundColor: overlayBg,
            },
            overlayStyle(progress),
          ]}
        />
        <Pressable
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing[6],
          }}
          onPress={() => setOpen(false)}
        >
          <Animated.View style={dialogContentStyle(progress)}>
            <Pressable
              onPress={(e) => e.stopPropagation?.()}
              style={cn(
                {
                  width: "100%",
                  maxWidth: 420,
                  borderRadius: theme.radii["2xl"],
                  backgroundColor: colors.popover,
                  borderWidth: 1,
                  borderColor: colors.glassChromeBorder,
                  padding: theme.spacing[6],
                },
                style,
              )}
              {...props}
            >
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
        </Pressable>
      </View>
    </Modal>
  );
}

const StyleSheetAbsoluteFill = {
  position: "absolute" as const,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export const DialogHeader = forwardRef<View, ViewProps>(
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
            paddingRight: theme.spacing[6],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            flexDirection: "row",
            justifyContent: "flex-end",
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
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        accessibilityRole="header"
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
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color: colors.mutedForeground,
            fontSize: theme.fontSizes.sm,
            lineHeight: theme.fontSizes.sm * theme.lineHeights.relaxed,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
DialogDescription.displayName = "DialogDescription";

export const DialogPortal = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
export const DialogOverlay = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
