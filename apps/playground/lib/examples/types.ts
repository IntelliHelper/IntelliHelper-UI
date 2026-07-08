import type { ReactNode } from "react";

export type ComponentExample = {
  title: string;
  description?: string;
  preview: ReactNode;
  code: string;
};