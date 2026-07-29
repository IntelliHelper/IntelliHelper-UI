"use client";

import { useState } from "react";
import { Input, Label, OtpInput, PasswordInput, Textarea } from "@intelli/ui";

export function InputDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="input-chrome">Chrome input</Label>
        <Input
          id="input-chrome"
          placeholder="Enter your name"
          defaultValue="Adeeb Mirza"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="input-outline" variant="muted">
          Outline input
        </Label>
        <Input
          id="input-outline"
          variant="outline"
          placeholder="you@example.com"
          type="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="input-sizes">Sizes</Label>
        <div className="flex flex-col gap-2">
          <Input id="input-sizes" size="sm" placeholder="Small" />
          <Input placeholder="Default" />
          <Input size="lg" placeholder="Large" />
        </div>
      </div>
    </div>
  );
}

export function LabelDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label-default">Default label</Label>
        <Input id="label-default" placeholder="Linked to the label" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="label-required" required>
          Required email
        </Label>
        <Input
          id="label-required"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label variant="chrome" size="sm">
          Chrome small
        </Label>
        <Label variant="muted" size="lg">
          Muted large
        </Label>
      </div>
    </div>
  );
}

export function PasswordInputDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password-chrome">Password</Label>
        <PasswordInput
          id="password-chrome"
          placeholder="Enter password"
          defaultValue="liquid-glass"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-outline" variant="muted">
          Outline · error state
        </Label>
        <PasswordInput
          id="password-outline"
          variant="outline"
          state="error"
          placeholder="Confirm password"
        />
      </div>
      <div className="space-y-2">
        <Label>Sizes</Label>
        <div className="flex flex-col gap-2">
          <PasswordInput size="sm" placeholder="Small" />
          <PasswordInput placeholder="Default" />
          <PasswordInput size="lg" placeholder="Large" />
        </div>
      </div>
    </div>
  );
}

export function OtpInputDemo() {
  const [value, setValue] = useState("");
  const [complete, setComplete] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp-default">Verification code</Label>
        <OtpInput
          id="otp-default"
          value={value}
          onValueChange={(next) => {
            setValue(next);
            if (next.length < 6) setComplete(null);
          }}
          onComplete={setComplete}
          aria-label="Verification code"
        />
        <p className="text-xs text-muted-foreground">
          {complete
            ? `Complete: ${complete}`
            : value
              ? `Entered: ${value}`
              : "Paste or type a 6-digit code"}
        </p>
      </div>
      <div className="space-y-2">
        <Label>Outline · 4 digits</Label>
        <OtpInput length={4} variant="outline" size="sm" />
      </div>
    </div>
  );
}

export function TextareaDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="textarea-chrome">Chrome textarea</Label>
        <Textarea
          id="textarea-chrome"
          placeholder="Write a message..."
          defaultValue="Liquid Glass form fields with translucent chrome surfaces."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="textarea-outline" variant="muted">
          Outline textarea
        </Label>
        <Textarea
          id="textarea-outline"
          variant="outline"
          placeholder="Add a longer description..."
        />
      </div>
    </div>
  );
}

/** Combined showcase — not used in per-component examples. */
export function FormComponentsDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <InputDemo />
      <PasswordInputDemo />
      <OtpInputDemo />
      <TextareaDemo />
      <LabelDemo />
    </div>
  );
}
