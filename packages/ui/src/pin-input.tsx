"use client";

import { forwardRef } from "react";
import { OtpInput, type OtpInputHandle, type OtpInputProps } from "./otp-input";
import { cn } from "@intelli/utils";

export type PinInputHandle = OtpInputHandle;

export interface PinInputProps extends Omit<OtpInputProps, "inputMode" | "autoComplete"> {
  /** Mask filled slots (PIN privacy). Default true. */
  masked?: boolean;
  inputMode?: OtpInputProps["inputMode"];
  autoComplete?: string;
}

/**
 * PIN entry — OTP-style slots tuned for short numeric PINs.
 * Defaults: length 4, masked, numeric keyboard.
 */
const PinInput = forwardRef<PinInputHandle, PinInputProps>(
  (
    {
      length = 4,
      masked = true,
      inputMode = "numeric",
      autoComplete = "one-time-code",
      "aria-label": ariaLabel = "PIN",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <OtpInput
        ref={ref}
        length={length}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        className={cn(masked && "[&_input]:[-webkit-text-security:disc] [&_input]:[text-security:disc]", className)}
        {...props}
      />
    );
  },
);
PinInput.displayName = "PinInput";

export { PinInput };
