import { type ReactNode } from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../theme";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

export const DropdownMenu = Popover;
export const DropdownMenuTrigger = PopoverTrigger;
export const DropdownMenuContent = PopoverContent;

export function DropdownMenuItem({
  children,
  onSelect,
}: {
  children?: ReactNode;
  onSelect?: () => void;
}) {
  const { theme, colors } = useTheme();
  return (
    <Pressable
      onPress={onSelect}
      style={{
        paddingVertical: theme.spacing[2],
        paddingHorizontal: theme.spacing[2],
        borderRadius: theme.radii.md,
      }}
    >
      <Text style={{ color: colors.foreground, fontSize: theme.fontSizes.sm }}>
        {children}
      </Text>
    </Pressable>
  );
}

export const ContextMenu = DropdownMenu;
export const ContextMenuTrigger = DropdownMenuTrigger;
export const ContextMenuContent = DropdownMenuContent;
export const ContextMenuItem = DropdownMenuItem;
