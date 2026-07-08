import type { ReactNode } from "react";
import { PlaygroundShell } from "../../components/playground-shell";

export default function PlaygroundLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <PlaygroundShell>{children}</PlaygroundShell>;
}