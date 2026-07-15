import { forwardRef } from "react";
import {
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";
import type { FieldSize, FieldState, FieldVariant } from "./input";

export interface TextareaProps extends TextInputProps {
  variant?: FieldVariant;
  size?: FieldSize;
  state?: FieldState;
  style?: StyleProp<TextStyle>;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  (
    {
      variant = "chrome",
      size = "default",
      state = "default",
      style,
      placeholderTextColor,
      editable = true,
      ...props
    },
    ref,
  ) => {
    const { theme, colors } = useTheme();
    const minHeight = size === "sm" ? 72 : size === "lg" ? 104 : 88;
    const fontSize =
      size === "sm"
        ? theme.fontSizes.xs
        : size === "lg"
          ? theme.fontSizes.base
          : theme.fontSizes.sm;

    const borderColor =
      state === "error"
        ? colors.destructive
        : state === "success"
          ? colors.success
          : colors.glassChromeBorder;

    return (
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        editable={editable}
        placeholderTextColor={
          placeholderTextColor ?? colors.glassChromeFgMuted
        }
        style={cn(
          {
            width: "100%",
            minHeight,
            borderRadius: theme.radii.xl,
            paddingHorizontal: size === "lg" ? theme.spacing[4] : theme.spacing[3],
            paddingVertical: size === "lg" ? theme.spacing[3] : theme.spacing[2.5],
            fontSize,
            color: colors.glassChromeFg,
            backgroundColor:
              variant === "outline"
                ? colors.glassSurfaceFill
                : colors.glassChromeBgEnv,
            borderWidth: 1,
            borderColor,
            opacity: editable === false ? 0.5 : 1,
          },
          style,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
