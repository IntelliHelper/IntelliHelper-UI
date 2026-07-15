import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type AnyStyle = ViewStyle | TextStyle;

/**
 * Merge RN styles, filtering falsy entries.
 * Drop-in conceptual counterpart to web `cn()` without Tailwind.
 */
export function cn<T extends AnyStyle = ViewStyle>(
  ...styles: Array<StyleProp<T> | false | null | undefined>
): StyleProp<T> {
  return styles.filter(Boolean) as StyleProp<T>;
}
