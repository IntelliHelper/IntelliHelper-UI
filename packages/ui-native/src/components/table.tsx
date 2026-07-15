import { forwardRef, type ReactNode } from "react";
import {
  ScrollView,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type TableDensity = "compact" | "default" | "comfortable";

export interface TableProps extends ViewProps {
  density?: TableDensity;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Table = forwardRef<ScrollView, TableProps>(
  ({ density = "default", children, style, ...props }, ref) => {
    const { colors } = useTheme();
    return (
      <ScrollView
        ref={ref}
        horizontal
        style={cn(
          {
            width: "100%",
            borderWidth: 1,
            borderColor: colors.glassChromeBorder,
            borderRadius: 12,
          },
          style,
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        {...props}
      >
        <View style={{ minWidth: "100%" }} data-density={density}>
          {children}
        </View>
      </ScrollView>
    );
  },
);
Table.displayName = "Table";

export const TableHeader = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { colors } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            borderBottomWidth: 1,
            borderBottomColor: colors.glassChromeBorder,
            backgroundColor: colors.glassChromeBgEnv,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<View, ViewProps>((props, ref) => (
  <View ref={ref} {...props} />
));
TableBody.displayName = "TableBody";

export const TableFooter = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { colors } = useTheme();
    return (
      <View
        ref={ref}
        style={cn(
          {
            borderTopWidth: 1,
            borderTopColor: colors.glassChromeBorder,
            backgroundColor: colors.glassChromeBgEnv,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
TableFooter.displayName = "TableFooter";

export const TableRow = forwardRef<View, ViewProps>(({ style, ...props }, ref) => {
  const { colors } = useTheme();
  return (
    <View
      ref={ref}
      style={cn(
        {
          flexDirection: "row",
          borderBottomWidth: StyleSheetHairline,
          borderBottomColor: colors.border,
          alignItems: "center",
        },
        style,
      )}
      {...props}
    />
  );
});
TableRow.displayName = "TableRow";

const StyleSheetHairline = 1;

export const TableHead = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            flex: 1,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[3],
            color: colors.mutedForeground,
            fontSize: theme.fontSizes.xs,
            fontWeight: theme.fontWeights.semibold,
            textTransform: "uppercase",
          },
          style,
        )}
        {...props}
      />
    );
  },
);
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            flex: 1,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[3],
            color: colors.foreground,
            fontSize: theme.fontSizes.sm,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
TableCell.displayName = "TableCell";

export const TableCaption = forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { theme, colors } = useTheme();
    return (
      <Text
        ref={ref}
        style={cn(
          {
            marginTop: theme.spacing[2],
            color: colors.mutedForeground,
            fontSize: theme.fontSizes.sm,
            textAlign: "center",
          },
          style,
        )}
        {...props}
      />
    );
  },
);
TableCaption.displayName = "TableCaption";
