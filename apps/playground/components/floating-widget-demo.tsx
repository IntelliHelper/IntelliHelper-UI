"use client";

import { useState } from "react";
import {
  Button,
  FloatingWidget,
  FloatingWidgetBody,
  FloatingWidgetClose,
  FloatingWidgetContent,
  FloatingWidgetDescription,
  FloatingWidgetFooter,
  FloatingWidgetHeader,
  FloatingWidgetTitle,
  FloatingWidgetTrigger,
  Input,
  Textarea,
} from "@intelli/ui";

export function FloatingWidgetDemo() {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="relative h-[28rem] w-full overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)]">
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="max-w-sm space-y-2 text-center">
          <p className="text-sm font-medium">Floating feedback bubble</p>
          <p className="text-xs text-muted-foreground">
            Click the bubble in the corner to open the panel. Drop your own form,
            chat, or help content inside.
          </p>
        </div>
      </div>

      <FloatingWidget position="bottom-right" scope="container">
        <FloatingWidgetTrigger label="Open feedback" badge={sent ? undefined : 1} />
        <FloatingWidgetContent>
          <FloatingWidgetHeader>
            <FloatingWidgetTitle>Send feedback</FloatingWidgetTitle>
            <FloatingWidgetDescription>
              Tell us what is working and what we should improve.
            </FloatingWidgetDescription>
          </FloatingWidgetHeader>
          <FloatingWidgetBody className="space-y-3">
            {sent ? (
              <div className="rounded-xl border border-[color-mix(in_oklch,oklch(0.62_0.17_145)_35%,transparent)] bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_12%,transparent)] px-3 py-4 text-sm">
                Thanks — your feedback was captured in this demo.
              </div>
            ) : (
              <>
                <div className="grid gap-1.5">
                  <label htmlFor="fw-email" className="text-xs font-medium">
                    Email
                  </label>
                  <Input
                    id="fw-email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="fw-message" className="text-xs font-medium">
                    Message
                  </label>
                  <Textarea
                    id="fw-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="What should we know?"
                    rows={4}
                  />
                </div>
              </>
            )}
          </FloatingWidgetBody>
          <FloatingWidgetFooter>
            {sent ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSent(false);
                  setMessage("");
                }}
              >
                Send another
              </Button>
            ) : (
              <>
                <FloatingWidgetClose asChild>
                  <Button size="sm" variant="ghost" type="button">
                    Cancel
                  </Button>
                </FloatingWidgetClose>
                <Button
                  size="sm"
                  type="button"
                  disabled={message.trim().length === 0}
                  onClick={() => setSent(true)}
                >
                  Send feedback
                </Button>
              </>
            )}
          </FloatingWidgetFooter>
        </FloatingWidgetContent>
      </FloatingWidget>
    </div>
  );
}

export function FloatingWidgetChromeDemo() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)]">
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <p className="text-center text-xs text-muted-foreground">
          Chrome trigger + elevated panel
        </p>
      </div>

      <FloatingWidget position="bottom-left" scope="container">
        <FloatingWidgetTrigger variant="chrome" label="Open help" />
        <FloatingWidgetContent variant="elevated" size="sm">
          <FloatingWidgetHeader>
            <FloatingWidgetTitle>Need help?</FloatingWidgetTitle>
            <FloatingWidgetDescription>
              Quick links for support and docs.
            </FloatingWidgetDescription>
          </FloatingWidgetHeader>
          <FloatingWidgetBody className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Browse docs
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Contact support
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Keyboard shortcuts
            </Button>
          </FloatingWidgetBody>
        </FloatingWidgetContent>
      </FloatingWidget>
    </div>
  );
}
