import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
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
import { pressedOpacity } from "../utils/pressable";

interface SelectContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  labelByValue: Map<string, string>;
  registerLabel: (value: string, label: string) => void;
  size: "sm" | "default" | "lg";
  variant: "chrome" | "outline";
  disabled?: boolean;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be used within Select");
  return ctx;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "chrome" | "outline";
  children?: ReactNode;
}

export function Select({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  onOpenChange,
  disabled,
  size = "default",
  variant = "chrome",
  children,
}: SelectProps) {
  const isValueControlled = valueProp !== undefined;
  const isOpenControlled = openProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(false);
  const [labels, setLabels] = useState<Map<string, string>>(new Map());

  const value = isValueControlled ? valueProp : internalValue;
  const open = isOpenControlled ? !!openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isOpenControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const registerLabel = (v: string, label: string) => {
    setLabels((prev) => {
      if (prev.get(v) === label) return prev;
      const next = new Map(prev);
      next.set(v, label);
      return next;
    });
  };

  const ctx = useMemo(
    () => ({
      open,
      setOpen,
      value,
      onValueChange: (v: string) => {
        if (!isValueControlled) setInternalValue(v);
        onValueChange?.(v);
        setOpen(false);
      },
      labelByValue: labels,
      registerLabel,
      size,
      variant,
      disabled,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, value, labels, size, variant, disabled],
  );

  return (
    <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>
  );
}

export interface SelectTriggerProps extends Omit<PressableProps, "children"> {
  placeholder?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SelectTrigger = forwardRef<
  React.ElementRef<typeof Pressable>,
  SelectTriggerProps
>(({ placeholder = "Select…", children, style, ...props }, ref) => {
  const { theme, colors } = useTheme();
  const ctx = useSelect();
  const height = ctx.size === "sm" ? 36 : ctx.size === "lg" ? 44 : 40;
  const label =
    (ctx.value && ctx.labelByValue.get(ctx.value)) || children || placeholder;

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      disabled={ctx.disabled}
      onPress={() => ctx.setOpen(true)}
      style={({ pressed }) =>
        cn(
          {
            height,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: theme.spacing[3],
            borderRadius: theme.radii.xl,
            borderWidth: 1,
            borderColor: colors.glassChromeBorder,
            backgroundColor:
              ctx.variant === "outline"
                ? colors.glassSurfaceFill
                : colors.glassChromeBgEnv,
            opacity: pressedOpacity(pressed) * (ctx.disabled ? 0.5 : 1),
          },
          style,
        )
      }
      {...props}
    >
      {typeof label === "string" || typeof label === "number" ? (
        <Text
          style={{
            color: ctx.value ? colors.glassChromeFg : colors.glassChromeFgMuted,
            fontSize: theme.fontSizes.sm,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
      ) : (
        label
      )}
      <Text style={{ color: colors.glassChromeFgMuted, marginLeft: 8 }}>▾</Text>
    </Pressable>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { colors, theme } = useTheme();
  const ctx = useSelect();
  const label = ctx.value
    ? ctx.labelByValue.get(ctx.value) ?? ctx.value
    : placeholder ?? "Select…";
  return (
    <Text
      style={{
        color: ctx.value ? colors.glassChromeFg : colors.glassChromeFgMuted,
        fontSize: theme.fontSizes.sm,
      }}
      numberOfLines={1}
    >
      {label}
    </Text>
  );
}

export interface SelectContentProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  title?: string;
}

/** Collects SelectItem children for the modal list. */
export function SelectContent({ children, style, title }: SelectContentProps) {
  const { theme, colors } = useTheme();
  const ctx = useSelect();
  const items = flattenSelectItems(children);
  const { mounted, progress } = usePresence(ctx.open, timings.normal);

  if (!mounted) {
    // Keep children mounted for label registration even when closed
    return (
      <View style={{ height: 0, overflow: "hidden" }}>{children}</View>
    );
  }

  return (
    <>
      <View style={{ height: 0, overflow: "hidden" }}>{children}</View>
      <Modal
        visible={mounted}
        transparent
        animationType="none"
        onRequestClose={() => ctx.setOpen(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => ctx.setOpen(false)}
          >
            <Animated.View
              style={[
                { flex: 1, backgroundColor: colors.overlay },
                overlayStyle(progress),
              ]}
            />
          </Pressable>
          <Animated.View
            style={[
              sheetContentStyle(progress, "bottom"),
              {
                backgroundColor: colors.popover,
                borderTopLeftRadius: theme.radii["2xl"],
                borderTopRightRadius: theme.radii["2xl"],
                borderWidth: 1,
                borderColor: colors.glassChromeBorder,
                maxHeight: "55%",
                paddingBottom: theme.spacing[8],
              },
              style,
            ]}
          >
            <View
              style={{
                alignItems: "center",
                paddingVertical: theme.spacing[3],
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
              {title ? (
                <Text
                  style={{
                    marginTop: theme.spacing[2],
                    color: colors.foreground,
                    fontWeight: theme.fontWeights.semibold,
                  }}
                >
                  {title}
                </Text>
              ) : null}
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <SelectItemRow value={item.value} label={item.label} />
              )}
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

function SelectItemRow({ value, label }: { value: string; label: string }) {
  const { theme, colors } = useTheme();
  const ctx = useSelect();
  const selected = ctx.value === value;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => ctx.onValueChange?.(value)}
      style={({ pressed }) => ({
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3.5],
        backgroundColor: selected
          ? colors.glassChromeBgEnv
          : pressed
            ? colors.muted
            : "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      })}
    >
      <Text
        style={{
          color: colors.foreground,
          fontSize: theme.fontSizes.base,
          fontWeight: selected
            ? theme.fontWeights.semibold
            : theme.fontWeights.normal,
        }}
      >
        {label}
      </Text>
      {selected ? (
        <Text style={{ color: colors.primary, fontWeight: "700" }}>✓</Text>
      ) : null}
    </Pressable>
  );
}

export interface SelectItemProps {
  value: string;
  children?: ReactNode;
  disabled?: boolean;
}

/** Registers option label; rendered invisibly inside SelectContent. */
export function SelectItem({ value, children }: SelectItemProps) {
  const ctx = useSelect();
  const label =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : value;

  // register on each render (map is stable if unchanged)
  ctx.registerLabel(value, label);
  return null;
}

export function SelectGroup({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function SelectLabel({ children }: { children?: ReactNode }) {
  const { theme, colors } = useTheme();
  return (
    <Text
      style={{
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[2],
        color: colors.mutedForeground,
        fontSize: theme.fontSizes.xs,
        fontWeight: theme.fontWeights.semibold,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Text>
  );
}

export function SelectSeparator() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 4,
      }}
    />
  );
}

function flattenSelectItems(
  children: ReactNode,
): Array<{ value: string; label: string }> {
  const items: Array<{ value: string; label: string }> = [];

  function walk(node: ReactNode) {
    if (node == null || typeof node === "boolean") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node === "object" && node !== null && "props" in node) {
      const el = node as {
        type?: { displayName?: string; name?: string };
        props?: { value?: string; children?: ReactNode };
      };
      const name = el.type?.displayName || el.type?.name;
      if (name === "SelectItem" && el.props?.value) {
        const label =
          typeof el.props.children === "string" ||
          typeof el.props.children === "number"
            ? String(el.props.children)
            : el.props.value;
        items.push({ value: el.props.value, label });
      } else if (el.props?.children) {
        walk(el.props.children);
      }
    }
  }

  walk(children);
  return items;
}

SelectItem.displayName = "SelectItem";
