import { Input, type InputProps } from "./input";

export type PhoneInputProps = InputProps;

export function PhoneInput(props: PhoneInputProps) {
  return (
    <Input
      keyboardType="phone-pad"
      autoComplete="tel"
      placeholder={props.placeholder ?? "+1 555 0100"}
      {...props}
    />
  );
}
