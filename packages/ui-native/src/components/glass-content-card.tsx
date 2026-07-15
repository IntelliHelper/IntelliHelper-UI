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

export interface GlassContentCardProps extends ViewProps {
  gradient?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const GlassContentCard = forwardRef<View, GlassContentCardProps>(
  ({ gradient, children, style, ...props }, ref) => {
    return (
      <GlassSurface
        ref={ref}
        variant="content"
        contentBackground={gradient}
        style={cn({ overflow: "hidden" }, style)}
        {...props}
      >
        {children}
      </GlassSurface>
    );
  },
);
GlassContentCard.displayName = "GlassContentCard";

export interface GlassContentPanelProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const GlassContentPanel = forwardRef<View, GlassContentPanelProps>(
  ({ children, style, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            padding: theme.spacing[6],
            gap: theme.spacing[2],
          },
          style,
        )}
        {...props}
      >
        {children}
      </View>
    );
  },
);
GlassContentPanel.displayName = "GlassContentPanel";
