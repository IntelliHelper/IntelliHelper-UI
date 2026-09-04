import { Input, type InputProps } from "./input";

export type SearchInputProps = InputProps;

export function SearchInput(props: SearchInputProps) {
  return (
    <Input
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      placeholder={props.placeholder ?? "Search"}
      {...props}
    />
  );
}
