import { Badge, type BadgeProps } from "./badge";

export type KbdProps = BadgeProps;

export function Kbd(props: KbdProps) {
  return <Badge variant="outline" size="sm" {...props} />;
}
