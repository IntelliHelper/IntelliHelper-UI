"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useEffect,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";
import { appendStreamChunk } from "./ai-utils";

const streamingTextVariants = cva(
  "whitespace-pre-wrap text-sm leading-relaxed text-[var(--glass-chrome-fg)]",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-muted-foreground",
        mono: "font-mono text-[13px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface StreamingTextProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof streamingTextVariants> {
  /** Full text to display (controlled). */
  text?: string;
  /** Optional progressive reveal speed (chars per tick). 0 = show all. */
  streamRate?: number;
  /** Show blinking caret while streaming. */
  showCaret?: boolean;
  /** Whether content is still arriving from the model. */
  isStreaming?: boolean;
  onStreamComplete?: () => void;
}

const StreamingText = forwardRef<HTMLDivElement, StreamingTextProps>(
  (
    {
      className,
      variant,
      text = "",
      streamRate = 0,
      showCaret = true,
      isStreaming = false,
      onStreamComplete,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(
      streamRate > 0 ? "" : text,
    );

    useEffect(() => {
      if (streamRate <= 0) {
        setVisible(text);
        return;
      }

      setVisible("");
      let index = 0;
      let cancelled = false;
      const id = window.setInterval(() => {
        if (cancelled) {
          return;
        }
        index = Math.min(text.length, index + streamRate);
        setVisible(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(id);
          onStreamComplete?.();
        }
      }, 24);

      return () => {
        cancelled = true;
        window.clearInterval(id);
      };
    }, [onStreamComplete, streamRate, text]);

    const display =
      streamRate > 0 ? visible : text;
    const caret =
      showCaret && (isStreaming || (streamRate > 0 && display.length < text.length));

    return (
      <div
        ref={ref}
        data-slot="streaming-text"
        data-streaming={isStreaming || undefined}
        className={cn(streamingTextVariants({ variant }), className)}
        {...props}
      >
        {display}
        {caret ? (
          <span
            data-slot="streaming-text-caret"
            className="ml-0.5 inline-block h-[1em] w-[0.45ch] translate-y-[0.1em] animate-pulse bg-current align-baseline"
            aria-hidden
          />
        ) : null}
      </div>
    );
  },
);
StreamingText.displayName = "StreamingText";

/** Helper re-export for consumers composing stream buffers. */
export { StreamingText, streamingTextVariants, appendStreamChunk };
