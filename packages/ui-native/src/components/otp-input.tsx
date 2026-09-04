import { useRef } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../theme";
import { Input } from "./input";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
  const { theme } = useTheme();
  const refs = useRef<Array<TextInput | null>>([]);
  const chars = value.split("");

  return (
    <View style={{ flexDirection: "row", gap: theme.spacing[2] }}>
      {Array.from({ length }, (_, i) => (
        <Input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={chars[i] ?? ""}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={(t) => {
            const next = chars.slice();
            next[i] = t.slice(-1);
            const joined = Array.from({ length }, (__, j) => next[j] ?? "").join("");
            onChange(joined);
            if (t && i < length - 1) refs.current[i + 1]?.focus();
          }}
          style={{ flex: 1, textAlign: "center", paddingHorizontal: 0 }}
        />
      ))}
    </View>
  );
}

export function PinInput(props: OtpInputProps) {
  return <OtpInput length={props.length ?? 4} {...props} />;
}
