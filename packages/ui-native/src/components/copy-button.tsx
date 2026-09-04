import { useState } from "react";
import { Button, type ButtonProps } from "./button";

export interface CopyButtonProps extends Omit<ButtonProps, "onPress"> {
  value: string;
  copiedLabel?: string;
}

export function CopyButton({
  value,
  copiedLabel = "Copied",
  children = "Copy",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      {...props}
      onPress={() => {
        try {
          // Optional Expo clipboard; no-op if the peer is missing.
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const clip = require("expo-clipboard") as {
            setStringAsync?: (v: string) => Promise<void>;
          };
          void clip.setStringAsync?.(value);
        } catch {
          /* clipboard optional */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? copiedLabel : children}
    </Button>
  );
}
