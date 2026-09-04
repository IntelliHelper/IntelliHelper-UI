import { Button, type ButtonProps } from "./button";
import { useTheme } from "../theme";

export type ThemeToggleProps = Omit<ButtonProps, "onPress" | "children">;

export function ThemeToggle(props: ThemeToggleProps) {
  const { mode, toggleMode } = useTheme();
  return (
    <Button
      variant="outline"
      size="icon"
      shape="pill"
      accessibilityLabel="Toggle color mode"
      onPress={toggleMode}
      {...props}
    >
      {mode === "dark" ? "☀" : "☾"}
    </Button>
  );
}
