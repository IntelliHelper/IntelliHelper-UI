import { forwardRef, type ReactNode } from "react";
import {
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { cn } from "../utils/cn";

export interface ScrollAreaProps extends ScrollViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  horizontal?: boolean;
}

export const ScrollArea = forwardRef<ScrollView, ScrollAreaProps>(
  ({ children, style, contentContainerStyle, horizontal, ...props }, ref) => {
    return (
      <ScrollView
        ref={ref}
        horizontal={horizontal}
        showsVerticalScrollIndicator={!horizontal}
        showsHorizontalScrollIndicator={!!horizontal}
        style={cn({ flexGrow: 0 }, style)}
        contentContainerStyle={contentContainerStyle}
        {...props}
      >
        {children}
      </ScrollView>
    );
  },
);
ScrollArea.displayName = "ScrollArea";

/** Visual stub for web ScrollBar parity — RN uses native indicators. */
export function ScrollBar() {
  return null;
}
