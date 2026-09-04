import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme";
import { Input, type InputProps } from "./input";

export type PasswordInputProps = InputProps;

export function PasswordInput({ style, ...props }: PasswordInputProps) {
  const [hidden, setHidden] = useState(true);
  const { theme, colors } = useTheme();
  return (
    <View style={{ width: "100%", position: "relative" }}>
      <Input
        secureTextEntry={hidden}
        autoCapitalize="none"
        autoCorrect={false}
        style={[{ paddingRight: 56 }, style]}
        {...props}
      />
      <Pressable
        onPress={() => setHidden((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={hidden ? "Show password" : "Hide password"}
        style={{
          position: "absolute",
          right: theme.spacing[3],
          top: 0,
          bottom: 0,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: colors.primary,
            fontSize: theme.fontSizes.xs,
            fontWeight: theme.fontWeights.medium,
          }}
        >
          {hidden ? "Show" : "Hide"}
        </Text>
      </Pressable>
    </View>
  );
}
