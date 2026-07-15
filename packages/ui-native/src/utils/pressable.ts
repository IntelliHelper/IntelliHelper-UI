import type { ViewStyle } from "react-native";

export function disabledStyle(disabled?: boolean): ViewStyle {
  if (!disabled) return {};
  return { opacity: 0.5 };
}

export function pressedOpacity(pressed: boolean, base = 1): number {
  return pressed ? Math.max(0.75, base * 0.88) : base;
}
