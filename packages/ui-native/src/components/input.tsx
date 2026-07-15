import { forwardRef } from "react";
import {
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import { useTheme } from "../theme";
import { cn } from "../utils/cn";

export type FieldVariant = "chrome" | "outline";
export type FieldSize = "sm" | "default" | "lg";
export type FieldState = "default" | "error" | "success";

export interface InputProps extends TextInputProps {
  variant?: FieldVariant;
  size?: FieldSize;
  state?: FieldState;
  style?: StyleProp<TextStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(
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
    const height = size === "sm" ? 36 : size === "lg" ? 44 : 40;
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
        editable={editable}
        placeholderTextColor={
          placeholderTextColor ?? colors.glassChromeFgMuted
        }
        style={cn(
          {
            width: "100%",
            height,
            borderRadius: theme.radii.xl,
            paddingHorizontal: size === "lg" ? theme.spacing[4] : theme.spacing[3],
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
Input.displayName = "Input";
