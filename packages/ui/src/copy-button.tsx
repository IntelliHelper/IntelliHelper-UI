"use client";

import { CheckIcon, CopyIcon } from "./icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { copyText } from "./copy-text";

const copyButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold",
    "transition-[filter,transform,color,background] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    focusRing,
  ],
  {
    variants: {
      variant: {
        chrome: "glass-chrome glass-chrome-interactive glass-chrome-text",
        outline: "glass-button-chrome glass-chrome-interactive",
        ghost: "glass-button-ghost glass-chrome-interactive",
        glass: "glass-button-glass glass-chrome-interactive",
      },
      size: {
        sm: "h-8 rounded-full px-3 text-xs",
        default: "h-9 rounded-full px-3.5 text-sm",
        lg: "h-10 rounded-full px-4 text-sm",
        icon: "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

export interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof copyButtonVariants> {
  /** Text written to the clipboard when clicked. */
  value: string;
  /** How long (ms) to show the copied state. */
  timeout?: number;
  label?: ReactNode;
  copiedLabel?: ReactNode;
  onCopied?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
  children?: ReactNode;
  showIcon?: boolean;
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      className,
      variant,
      size,
      value,
      timeout = 1600,
      label = "Copy",
      copiedLabel = "Copied",
      onCopied,
      onCopyError,
      onClick,
      disabled,
      children,
      showIcon = true,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, []);

    const handleCopy = useCallback(async () => {
      try {
        const ok = await copyText(value);
        if (!ok) {
          throw new Error("Copy failed");
        }
        setCopied(true);
        onCopied?.(value);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, timeout);
      } catch (error) {
        setCopied(false);
        onCopyError?.(error);
      }
    }, [onCopied, onCopyError, timeout, value]);

    return (
      <button
        ref={ref}
        type="button"
        data-slot="copy-button"
        data-copied={copied || undefined}
        aria-label={
          typeof (copied ? copiedLabel : label) === "string"
            ? String(copied ? copiedLabel : label)
            : copied
              ? "Copied"
              : "Copy"
        }
        disabled={disabled}
        className={cn(copyButtonVariants({ variant, size, className }))}
        onClick={(event) => {
          void handleCopy();
          onClick?.(event);
        }}
        {...props}
      >
        {children ?? (
          <>
            {showIcon ? (copied ? <CheckIcon /> : <CopyIcon />) : null}
            {size === "icon" ? (
              <span className="sr-only">
                {copied ? copiedLabel : label}
              </span>
            ) : (
              <span>{copied ? copiedLabel : label}</span>
            )}
          </>
        )}
      </button>
    );
  },
);
CopyButton.displayName = "CopyButton";

export { CopyButton, copyButtonVariants, copyText };
