import { forwardRef, type ReactNode } from "react";
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";
import { GlassSurface } from "./glass-surface";

export interface GlassBarProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const GlassBar = forwardRef<View, GlassBarProps>(
  ({ children, style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <GlassSurface
        ref={ref}
        variant="chrome"
        style={cn(
          {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing[3],
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[2],
            borderRadius: theme.radii.full,
            minHeight: 56,
          },
          style,
        )}
        {...props}
      >
        {children}
      </GlassSurface>
    );
  },
);
GlassBar.displayName = "GlassBar";

export const GlassBarMedia = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            width: 40,
            height: 40,
            borderRadius: theme.radii.lg,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        )}
        {...props}
      />
    );
  },
);
GlassBarMedia.displayName = "GlassBarMedia";

export const GlassBarInfo = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={cn({ flex: 1, minWidth: 0, justifyContent: "center" }, style)}
      {...props}
    />
  ),
);
GlassBarInfo.displayName = "GlassBarInfo";

export const GlassBarControls = forwardRef<View, ViewProps>(
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
GlassBarControls.displayName = "GlassBarControls";
