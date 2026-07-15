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

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover components must be used within Popover");
  return ctx;
}

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) {
  const isControlled = openProp !== undefined;
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? !!openProp : internal;
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children }: { children?: ReactNode }) {
  const { setOpen, open } = usePopover();
  return (
    <Pressable
      onPress={() => setOpen(!open)}
      accessibilityRole="button"
    >
      {children}
    </Pressable>
  );
}

export function PopoverAnchor({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export interface PopoverContentProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function PopoverContent({
  children,
  style,
  ...props
}: PopoverContentProps) {
  const { theme, colors } = useTheme();
  const { open, setOpen } = usePopover();
  const { mounted, progress } = usePresence(open, timings.fast);

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
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.08)",
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
                  minWidth: 220,
                  maxWidth: 320,
                  borderRadius: theme.radii.xl,
                  backgroundColor: colors.popover,
                  borderWidth: 1,
                  borderColor: colors.glassChromeBorder,
                  padding: theme.spacing[4],
                },
                style,
              )}
              {...props}
            >
              {children}
            </Pressable>
          </Animated.View>
        </Pressable>
      </View>
    </Modal>
  );
}

export const PopoverHeader = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn({ marginBottom: theme.spacing[2], gap: 4 }, style)}
        {...props}
      />
    );
  },
);
PopoverHeader.displayName = "PopoverHeader";

export const PopoverTitle = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            color: colors.foreground,
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontWeights.semibold,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
PopoverTitle.displayName = "PopoverTitle";

export const PopoverDescription = forwardRef<Text, TextProps>(
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
PopoverDescription.displayName = "PopoverDescription";
