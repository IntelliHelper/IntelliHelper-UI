import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: ReactNode;
  setContent: (c: ReactNode) => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltip() {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip components must be used within Tooltip");
  return ctx;
}

export function TooltipProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export interface TooltipProps {
  children?: ReactNode;
  delayDuration?: number;
}

export function Tooltip({ children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  return (
    <TooltipContext.Provider value={{ open, setOpen, content, setContent }}>
      {children}
      <TooltipModal />
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
  delayDuration = 400,
}: {
  children?: ReactNode;
  delayDuration?: number;
}) {
  const { setOpen } = useTooltip();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <Pressable
      onLongPress={() => setOpen(true)}
      onPressIn={() => {
        timer.current = setTimeout(() => setOpen(true), delayDuration);
      }}
      onPressOut={() => {
        if (timer.current) clearTimeout(timer.current);
        setOpen(false);
      }}
      delayLongPress={delayDuration}
    >
      {children}
    </Pressable>
  );
}

export interface TooltipContentProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  side?: "top" | "bottom";
}

export function TooltipContent({ children }: TooltipContentProps) {
  const { setContent } = useTooltip();
  useEffect(() => {
    setContent(children);
  }, [children, setContent]);
  return null;
}

function TooltipModal() {
  const { theme, colors } = useTheme();
  const ctx = useContext(TooltipContext);
  if (!ctx) return null;

  return (
    <Modal
      visible={ctx.open}
      transparent
      animationType="fade"
      onRequestClose={() => ctx.setOpen(false)}
    >
      <Pressable
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing[6],
        }}
        onPress={() => ctx.setOpen(false)}
      >
        <View
          style={cn({
            backgroundColor: colors.popover,
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            borderColor: colors.glassChromeBorder,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[2],
            maxWidth: 280,
          })}
        >
          {typeof ctx.content === "string" ? (
            <Text
              style={{
                color: colors.popoverForeground,
                fontSize: theme.fontSizes.sm,
              }}
            >
              {ctx.content}
            </Text>
          ) : (
            ctx.content
          )}
        </View>
      </Pressable>
    </Modal>
  );
}
