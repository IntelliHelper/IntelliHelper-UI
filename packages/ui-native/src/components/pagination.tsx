import { forwardRef, type ReactNode } from "react";
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
import { pressedOpacity } from "../utils/pressable";

export const Pagination = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        accessibilityRole="none"
        style={cn(
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing[1],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
Pagination.displayName = "Pagination";

export const PaginationContent = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing[1],
          },
          style,
        )}
        {...props}
      />
    );
  },
);
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => <View ref={ref} style={style} {...props} />,
);
PaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps extends Omit<PressableProps, "children"> {
  isActive?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const PaginationLink = forwardRef<
  React.ElementRef<typeof Pressable>,
  PaginationLinkProps
>(({ isActive, children, style, disabled, ...props }, ref) => {
  const { theme, colors } = useTheme();
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ selected: !!isActive, disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) =>
        cn(
          {
            minWidth: 36,
            height: 36,
            paddingHorizontal: theme.spacing[2],
            borderRadius: theme.radii.lg,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isActive ? colors.primary : colors.glassChromeBgEnv,
            borderWidth: 1,
            borderColor: isActive ? "transparent" : colors.glassChromeBorder,
            opacity: pressedOpacity(pressed) * (disabled ? 0.5 : 1),
          },
          style,
        )
      }
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text
          style={{
            color: isActive ? colors.primaryForeground : colors.foreground,
            fontSize: theme.fontSizes.sm,
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
PaginationLink.displayName = "PaginationLink";

export function PaginationPrevious(
  props: Omit<PaginationLinkProps, "children">,
) {
  return <PaginationLink {...props}>Prev</PaginationLink>;
}

export function PaginationNext(props: Omit<PaginationLinkProps, "children">) {
  return <PaginationLink {...props}>Next</PaginationLink>;
}

export function PaginationEllipsis() {
  const { theme, colors } = useTheme();
  return (
    <View
      style={{
        minWidth: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: colors.mutedForeground, fontSize: theme.fontSizes.sm }}>
        …
      </Text>
    </View>
  );
}
