"use client";

import { useState, type ReactNode } from "react";
import {
  Button,
  Toast,
  ToastDescription,
  ToastIcon,
  ToastTitle,
  Toaster,
  toast,
  type ToastPosition,
} from "@intelli/ui";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function DemoStage({
  children,
  position = "bottom-right",
}: {
  children: ReactNode;
  position?: ToastPosition;
}) {
  return (
    <div className="relative h-[22rem] w-full overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)]">
      <div className="absolute inset-0 flex items-start justify-center p-6 pt-8">
        {children}
      </div>
      <Toaster position={position} scope="container" visibleToasts={4} />
    </div>
  );
}

export function ToastDemo() {
  return (
    <DemoStage>
      <div className="flex w-full max-w-md flex-wrap justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast("Event created", {
              description: "Sunday, July 12 at 10:00 AM",
            })
          }
        >
          Default
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() =>
            toast.success("Saved", {
              description: "Your workspace settings were updated.",
            })
          }
        >
          Success
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() =>
            toast.error("Payment failed", {
              description: "We could not charge the card on file.",
            })
          }
        >
          Error
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            toast.warning("Storage almost full", {
              description: "You have used 92% of your plan quota.",
            })
          }
        >
          Warning
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            toast.info("New feature", {
              description: "Keyboard shortcuts are available in settings.",
            })
          }
        >
          Info
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.message("Chrome notice", {
            description: "Neutral frosted toast for chrome surfaces.",
          })}
        >
          Chrome
        </Button>
      </div>
    </DemoStage>
  );
}

export function ToastActionDemo() {
  return (
    <DemoStage position="bottom-center">
      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <p className="text-center text-xs text-muted-foreground">
          Action toasts, loading states, and promise helpers.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            size="sm"
            onClick={() =>
              toast("File deleted", {
                description: "invoice-april.pdf was moved to trash.",
                action: {
                  label: "Undo",
                  onClick: () => toast.success("Restored"),
                },
              })
            }
          >
            With action
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const id = toast.loading("Uploading…", {
                description: "Preparing your export",
              });
              window.setTimeout(() => {
                toast.success("Upload complete", {
                  id,
                  description: "export.zip is ready to download.",
                });
              }, 1800);
            }}
          >
            Loading → success
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              void toast.promise(
                new Promise<{ rows: number }>((resolve) => {
                  window.setTimeout(() => resolve({ rows: 128 }), 1600);
                }),
                {
                  loading: "Syncing contacts…",
                  success: (data) => ({
                    title: "Sync complete",
                    description: `${data.rows} contacts updated.`,
                  }),
                  error: "Sync failed",
                },
              );
            }}
          >
            Promise
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toast.dismiss()}
          >
            Dismiss all
          </Button>
        </div>
      </div>
    </DemoStage>
  );
}

export function ToastStaticDemo() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Toast variant="success">
        <ToastIcon>
          <CheckIcon />
        </ToastIcon>
        <div className="grid gap-1 pr-2">
          <ToastTitle>Invoice sent</ToastTitle>
          <ToastDescription>
            INV-004 was delivered to the customer inbox.
          </ToastDescription>
        </div>
      </Toast>
      <Toast variant="destructive">
        <ToastIcon>
          <ErrorIcon />
        </ToastIcon>
        <div className="grid gap-1 pr-2">
          <ToastTitle>Payment failed</ToastTitle>
          <ToastDescription>
            Update your billing method to retry the charge.
          </ToastDescription>
        </div>
      </Toast>
      <Toast variant="chrome">
        <ToastIcon>
          <BellIcon />
        </ToastIcon>
        <div className="grid gap-1 pr-2">
          <ToastTitle>Chrome toast</ToastTitle>
          <ToastDescription>
            Frosted surface for neutral system feedback.
          </ToastDescription>
        </div>
      </Toast>
    </div>
  );
}

export function ToastPositionDemo() {
  const [position, setPosition] = useState<ToastPosition>("top-right");

  const positions: ToastPosition[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ];

  return (
    <DemoStage position={position}>
      <div className="flex w-full max-w-lg flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {positions.map((value) => (
            <Button
              key={value}
              size="sm"
              variant={position === value ? "primary" : "outline"}
              onClick={() => {
                setPosition(value);
                toast(`Position: ${value}`, {
                  description: "Toaster repositions without remounting the app.",
                  variant: "chrome",
                });
              }}
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
    </DemoStage>
  );
}
