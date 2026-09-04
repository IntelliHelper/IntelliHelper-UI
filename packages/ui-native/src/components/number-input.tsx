import { Input, type InputProps } from "./input";

export interface NumberInputProps extends Omit<InputProps, "keyboardType" | "value" | "onChangeText"> {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
  prefix?: string;
}

export function NumberInput({
  value,
  onValueChange,
  prefix,
  ...props
}: NumberInputProps) {
  return (
    <Input
      keyboardType="decimal-pad"
      value={
        value === undefined || Number.isNaN(value)
          ? ""
          : `${prefix ?? ""}${value}`
      }
      onChangeText={(t) => {
        const raw = t.replace(/[^\d.-]/g, "");
        if (raw === "" || raw === "-") {
          onValueChange?.(undefined);
          return;
        }
        onValueChange?.(Number(raw));
      }}
      {...props}
    />
  );
}

export type CurrencyInputProps = NumberInputProps;

export function CurrencyInput({ prefix = "$", ...props }: CurrencyInputProps) {
  return <NumberInput prefix={prefix} {...props} />;
}
