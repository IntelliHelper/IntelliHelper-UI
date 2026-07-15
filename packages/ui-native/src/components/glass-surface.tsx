import { forwardRef, type ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type GlassSurfaceVariant =
  | "chrome"
  | "elevated"
  | "content"
  | "outline"
  | "panel"
  | "field"
  | "button";

export interface GlassSurfaceProps extends ViewProps {
  variant?: GlassSurfaceVariant;
  /** Prefer blur when expo-blur is available. Default true. */
  blur?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Optional solid content gradient fill for content cards. */
  contentBackground?: string;
}

/**
 * Shared glass surface. Uses translucent fills by default.
 * When `expo-blur` is installed, chrome/panel variants can wrap BlurView
 * (resolved lazily so the package remains optional).
 */
export const GlassSurface = forwardRef<View, GlassSurfaceProps>(
  (
    {
      variant = "chrome",
      blur = true,
      children,
      style,
      contentStyle,
      contentBackground,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const radius =
      variant === "content" ? theme.radii["3xl"] : theme.radii["2xl"];

    const base: ViewStyle = {
      borderRadius: radius,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: colors.glassChromeBorder,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        },
        android: { elevation: 3 },
        default: {},
      }),
    };

    const byVariant: Record<GlassSurfaceVariant, ViewStyle> = {
      chrome: {
        backgroundColor: colors.glassChromeBgEnv,
      },
      elevated: {
        backgroundColor: colors.glassChromeBg,
      },
      content: {
        backgroundColor: contentBackground ?? colors.primary,
        borderColor: "rgba(0,0,0,0.1)",
      },
      outline: {
        backgroundColor: colors.glassSurfaceFill,
        borderColor: colors.glassChromeBorder,
      },
      panel: {
        backgroundColor: colors.glassChromeBgEnv,
      },
      field: {
        backgroundColor: colors.glassChromeBgEnv,
        borderRadius: theme.radii.xl,
      },
      button: {
        backgroundColor: colors.glassButtonUiBg,
        borderColor: colors.glassButtonUiBorder,
      },
    };

    const BlurView = blur ? tryGetBlurView() : null;

    if (BlurView && (variant === "chrome" || variant === "panel" || variant === "elevated")) {
      return (
        <View ref={ref} style={cn(base, byVariant[variant], style)} {...props}>
          <BlurView
            intensity={40}
            tint={theme.mode === "dark" ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
          <View style={cn({ flex: 1 }, contentStyle)}>{children}</View>
        </View>
      );
    }

    return (
      <View
        ref={ref}
        style={cn(base, byVariant[variant], style)}
        {...props}
      >
        {children}
      </View>
    );
  },
);
GlassSurface.displayName = "GlassSurface";

type BlurViewComponent = React.ComponentType<{
  intensity?: number;
  tint?: "light" | "dark" | "default";
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}>;

function tryGetBlurView(): BlurViewComponent | null {
  try {
    // Optional peer — not required for the package to load.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("expo-blur") as { BlurView?: BlurViewComponent };
    return mod.BlurView ?? null;
  } catch {
    return null;
  }
}
