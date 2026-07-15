"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn, focusRing } from "@intelli/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ─────────────────────────────────────────────────────────────────────────── */

export type ToastVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "chrome"
  | "outline"
  | "loading";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastActionConfig = {
  label: string;
  onClick: () => void;
  altText?: string;
};

export type ToastInput = {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  duration?: number | null;
  icon?: ReactNode;
  action?: ToastActionConfig;
  cancel?: ToastActionConfig;
  closeButton?: boolean;
  important?: boolean;
  className?: string;
  onDismiss?: (id: string) => void;
  onAutoClose?: (id: string) => void;
};

export type ToastRecord = Required<
  Pick<ToastInput, "id" | "variant" | "closeButton" | "important">
> &
  Omit<ToastInput, "id" | "variant" | "closeButton" | "important" | "duration"> & {
    duration: number | null;
    createdAt: number;
    open: boolean;
  };

export type ToastPromiseMessages<T> = {
  loading: ReactNode | ToastInput;
  success: ReactNode | ((data: T) => ReactNode | ToastInput);
  error: ReactNode | ((error: unknown) => ReactNode | ToastInput);
};

type ToastStore = {
  toasts: ToastRecord[];
  listeners: Set<() => void>;
};

/* ─────────────────────────────────────────────────────────────────────────────
 * Store (module-level, works outside React)
 * ─────────────────────────────────────────────────────────────────────────── */

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 320;
const DEFAULT_DURATION = 4500;
const INFINITE = null;

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return `toast-${toastCount}`;
}

const store: ToastStore = {
  toasts: [],
  listeners: new Set(),
};

function emit() {
  for (const listener of store.listeners) {
    listener();
  }
}

function getSnapshot() {
  return store.toasts;
}

const serverSnapshot: ToastRecord[] = [];

function getServerSnapshot() {
  return serverSnapshot;
}

function subscribe(listener: () => void) {
  store.listeners.add(listener);
  return () => {
    store.listeners.delete(listener);
  };
}

const removeTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleRemove(id: string) {
  if (removeTimeouts.has(id)) {
    return;
  }

  const timeout = setTimeout(() => {
    removeTimeouts.delete(id);
    store.toasts = store.toasts.filter((toast) => toast.id !== id);
    emit();
  }, TOAST_REMOVE_DELAY);

  removeTimeouts.set(id, timeout);
}

function dismissToast(id?: string) {
  if (id === undefined) {
    for (const toast of store.toasts) {
      toast.onDismiss?.(toast.id);
    }
    store.toasts = store.toasts.map((toast) => ({ ...toast, open: false }));
    for (const toast of store.toasts) {
      scheduleRemove(toast.id);
    }
    emit();
    return;
  }

  const target = store.toasts.find((toast) => toast.id === id);
  target?.onDismiss?.(id);

  store.toasts = store.toasts.map((toast) =>
    toast.id === id ? { ...toast, open: false } : toast,
  );
  scheduleRemove(id);
  emit();
}

function upsertToast(input: ToastInput & { id: string }): string {
  const existing = store.toasts.find((toast) => toast.id === input.id);

  if (existing) {
    const previousTimeout = removeTimeouts.get(input.id);
    if (previousTimeout) {
      clearTimeout(previousTimeout);
      removeTimeouts.delete(input.id);
    }

    store.toasts = store.toasts.map((toast) =>
      toast.id === input.id
        ? {
            ...toast,
            ...input,
            open: true,
            duration:
              input.duration === undefined
                ? toast.duration
                : input.duration,
            variant: input.variant ?? toast.variant,
            closeButton: input.closeButton ?? toast.closeButton,
            important: input.important ?? toast.important,
          }
        : toast,
    );
    emit();
    return input.id;
  }

  const record: ToastRecord = {
    id: input.id,
    title: input.title,
    description: input.description,
    variant: input.variant ?? "default",
    duration:
      input.duration === undefined
        ? input.variant === "loading"
          ? INFINITE
          : DEFAULT_DURATION
        : input.duration,
    icon: input.icon,
    action: input.action,
    cancel: input.cancel,
    closeButton: input.closeButton ?? true,
    important: input.important ?? input.variant === "destructive",
    className: input.className,
    onDismiss: input.onDismiss,
    onAutoClose: input.onAutoClose,
    createdAt: Date.now(),
    open: true,
  };

  store.toasts = [record, ...store.toasts].slice(0, TOAST_LIMIT);
  emit();
  return record.id;
}

function normalizeMessage(
  message: ReactNode | ToastInput,
  fallbackVariant?: ToastVariant,
): ToastInput {
  if (
    message !== null &&
    typeof message === "object" &&
    !Array.isArray(message) &&
    ("title" in message ||
      "description" in message ||
      "variant" in message ||
      "duration" in message)
  ) {
    return message as ToastInput;
  }

  return {
    title: message as ReactNode,
    variant: fallbackVariant,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Imperative API
 * ─────────────────────────────────────────────────────────────────────────── */

type ToastHelper = {
  (message: ReactNode | ToastInput, data?: Omit<ToastInput, "title">): string;
  success: (
    message: ReactNode | ToastInput,
    data?: Omit<ToastInput, "title" | "variant">,
  ) => string;
  error: (
    message: ReactNode | ToastInput,
    data?: Omit<ToastInput, "title" | "variant">,
  ) => string;
  warning: (
    message: ReactNode | ToastInput,
    data?: Omit<ToastInput, "title" | "variant">,
  ) => string;
  info: (
    message: ReactNode | ToastInput,
    data?: Omit<ToastInput, "title" | "variant">,
  ) => string;
  loading: (
    message: ReactNode | ToastInput,
    data?: Omit<ToastInput, "title" | "variant">,
  ) => string;
  message: (
    message: ReactNode | ToastInput,
    data?: Omit<ToastInput, "title" | "variant">,
  ) => string;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: ToastPromiseMessages<T>,
  ) => Promise<T>;
  custom: (id: string | undefined, node: ReactNode, data?: ToastInput) => string;
  dismiss: (id?: string) => void;
  getHistory: () => ToastRecord[];
};

function createToast(
  message: ReactNode | ToastInput,
  data?: Omit<ToastInput, "title">,
  forcedVariant?: ToastVariant,
): string {
  const base =
    typeof message === "object" &&
    message !== null &&
    !Array.isArray(message) &&
    ("title" in message || "description" in message || "variant" in message)
      ? (message as ToastInput)
      : { title: message as ReactNode };

  const id = data?.id ?? base.id ?? genId();

  return upsertToast({
    ...base,
    ...data,
    id,
    variant: forcedVariant ?? data?.variant ?? base.variant ?? "default",
  });
}

const toast = ((
  message: ReactNode | ToastInput,
  data?: Omit<ToastInput, "title">,
) => createToast(message, data)) as ToastHelper;

toast.success = (message, data) => createToast(message, data, "success");
toast.error = (message, data) => createToast(message, data, "destructive");
toast.warning = (message, data) => createToast(message, data, "warning");
toast.info = (message, data) => createToast(message, data, "info");
toast.loading = (message, data) => createToast(message, data, "loading");
toast.message = (message, data) => createToast(message, data, "chrome");

toast.promise = async function toastPromise<T>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  messages: ToastPromiseMessages<T>,
): Promise<T> {
  const id = genId();
  const loading = normalizeMessage(messages.loading, "loading");
  upsertToast({ ...loading, id, variant: "loading", duration: INFINITE });

  try {
    const result =
      typeof promiseOrFn === "function" ? await promiseOrFn() : await promiseOrFn;
    const success = normalizeMessage(
      typeof messages.success === "function"
        ? messages.success(result)
        : messages.success,
      "success",
    );
    upsertToast({
      ...success,
      id,
      variant: success.variant ?? "success",
      duration: success.duration === undefined ? DEFAULT_DURATION : success.duration,
    });
    return result;
  } catch (error) {
    const failure = normalizeMessage(
      typeof messages.error === "function"
        ? messages.error(error)
        : messages.error,
      "destructive",
    );
    upsertToast({
      ...failure,
      id,
      variant: failure.variant ?? "destructive",
      duration: failure.duration === undefined ? DEFAULT_DURATION : failure.duration,
    });
    throw error;
  }
};

toast.custom = (id, node, data) =>
  upsertToast({
    ...data,
    id: id ?? genId(),
    title: node,
    variant: data?.variant ?? "chrome",
  });

toast.dismiss = dismissToast;
toast.getHistory = () => store.toasts;

function useToast() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(
    () => ({
      toasts,
      toast,
      dismiss: dismissToast,
    }),
    [toasts],
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Icons
 * ─────────────────────────────────────────────────────────────────────────── */

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function DefaultIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function defaultIconForVariant(variant: ToastVariant): ReactNode {
  switch (variant) {
    case "success":
      return <SuccessIcon />;
    case "destructive":
      return <ErrorIcon />;
    case "warning":
      return <WarningIcon />;
    case "info":
      return <InfoIcon />;
    case "loading":
      return <LoadingIcon />;
    case "chrome":
    case "outline":
    case "default":
    default:
      return <DefaultIcon />;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Variants
 * ─────────────────────────────────────────────────────────────────────────── */

const toastVariants = cva(
  [
    "group/toast pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden",
    "rounded-2xl border px-4 py-3.5 text-sm shadow-[var(--glass-chrome-shadow)]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
    "transition-[opacity,transform,filter] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "data-[state=open]:animate-glass-rise",
    "data-[state=closed]:scale-[0.96] data-[state=closed]:opacity-0 data-[state=closed]:blur-sm",
    "data-[swipe=move]:transition-none",
    "[&>[data-slot=toast-icon]]:mt-0.5 [&>[data-slot=toast-icon]]:size-4 [&>[data-slot=toast-icon]]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-[color-mix(in_oklch,var(--primary)_40%,transparent)]",
          "bg-[color-mix(in_oklch,var(--primary)_14%,var(--background))]",
          "text-foreground [&>[data-slot=toast-icon]]:text-primary",
          "shadow-[inset_0_1px_0_color-mix(in_oklch,white_18%,transparent),var(--glass-chrome-shadow)]",
        ],
        destructive: [
          "border-[color-mix(in_oklch,var(--destructive)_42%,transparent)]",
          "bg-[color-mix(in_oklch,var(--destructive)_12%,var(--background))]",
          "text-foreground [&>[data-slot=toast-icon]]:text-destructive",
          "shadow-[inset_0_1px_0_color-mix(in_oklch,white_12%,transparent),var(--glass-chrome-shadow)]",
        ],
        success: [
          "border-[color-mix(in_oklch,oklch(0.62_0.17_145)_40%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_12%,var(--background))]",
          "text-foreground",
          "[&>[data-slot=toast-icon]]:text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
        ],
        warning: [
          "border-[color-mix(in_oklch,oklch(0.78_0.16_75)_45%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.78_0.16_75)_14%,var(--background))]",
          "text-foreground",
          "[&>[data-slot=toast-icon]]:text-[color-mix(in_oklch,oklch(0.65_0.16_75)_90%,var(--foreground))]",
        ],
        info: [
          "border-[color-mix(in_oklch,oklch(0.65_0.14_230)_40%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.65_0.14_230)_12%,var(--background))]",
          "text-foreground",
          "[&>[data-slot=toast-icon]]:text-[color-mix(in_oklch,oklch(0.55_0.14_230)_90%,var(--foreground))]",
        ],
        chrome: [
          "glass-panel border-[var(--glass-chrome-border)]",
          "text-[var(--glass-chrome-fg)] [&>[data-slot=toast-icon]]:text-[var(--glass-chrome-fg)]",
        ],
        outline: [
          "border border-dashed border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--background)_88%,transparent)]",
          "text-foreground [&>[data-slot=toast-icon]]:text-[var(--glass-chrome-fg)]",
        ],
        loading: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_55%,transparent)]",
          "text-foreground [&>[data-slot=toast-icon]]:text-primary",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const toastViewportVariants = cva(
  [
    "pointer-events-none z-[var(--z-toast)] flex max-h-screen w-full flex-col gap-2 p-4",
    "sm:max-w-[24rem]",
  ],
  {
    variants: {
      position: {
        "top-left": "left-0 top-0 items-start",
        "top-center": "left-1/2 top-0 -translate-x-1/2 items-center",
        "top-right": "right-0 top-0 items-end",
        "bottom-left": "bottom-0 left-0 items-start",
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
        "bottom-right": "bottom-0 right-0 items-end",
      },
      scope: {
        viewport: "fixed",
        container: "absolute",
      },
    },
    defaultVariants: {
      position: "bottom-right",
      scope: "viewport",
    },
  },
);

/* ─────────────────────────────────────────────────────────────────────────────
 * Presentational primitives
 * ─────────────────────────────────────────────────────────────────────────── */

export interface ToastProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  open?: boolean;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, open = true, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-slot="toast"
      data-variant={variant}
      data-state={open ? "open" : "closed"}
      className={cn(toastVariants({ variant, className }))}
      {...props}
    />
  ),
);
Toast.displayName = "Toast";

const ToastTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      data-slot="toast-title"
      className={cn("text-sm font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
ToastTitle.displayName = "ToastTitle";

const ToastDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="toast-description"
    className={cn(
      "text-sm/relaxed text-muted-foreground [&_p]:leading-relaxed",
      className,
    )}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

export type ToastActionProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-slot="toast-action"
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-full px-3 text-xs font-semibold",
        "glass-chrome glass-chrome-interactive glass-chrome-text",
        "transition-[transform,box-shadow,background] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
        focusRing,
        className,
      )}
      {...props}
    />
  ),
);
ToastAction.displayName = "ToastAction";

export interface ToastCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, label = "Dismiss notification", ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-slot="toast-close"
      aria-label={label}
      className={cn(
        "absolute right-2.5 top-2.5 inline-flex size-7 items-center justify-center rounded-full",
        "opacity-70 transition-[opacity,transform,box-shadow,background] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
        "hover:opacity-100 glass-chrome glass-chrome-interactive glass-chrome-text",
        "[&_svg]:size-3.5",
        focusRing,
        className,
      )}
      {...props}
    >
      <CloseIcon />
    </button>
  ),
);
ToastClose.displayName = "ToastClose";

const ToastIcon = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="toast-icon"
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  ),
);
ToastIcon.displayName = "ToastIcon";

/* ─────────────────────────────────────────────────────────────────────────────
 * Toast item (timed lifecycle + swipe)
 * ─────────────────────────────────────────────────────────────────────────── */

type ToastItemProps = {
  toast: ToastRecord;
  showIcon?: boolean;
  showProgress?: boolean;
};

function ToastItem({ toast: item, showIcon = true, showProgress = true }: ToastItemProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const remainingRef = useRef(item.duration);
  const startedAtRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(1);
  const pausedRef = useRef(false);

  const duration = item.duration;
  const canAutoClose = duration !== null && duration > 0 && item.variant !== "loading";

  const close = useCallback(
    (reason: "dismiss" | "auto") => {
      if (reason === "auto") {
        item.onAutoClose?.(item.id);
      }
      dismissToast(item.id);
    },
    [item],
  );

  useEffect(() => {
    if (!canAutoClose || !item.open) {
      return;
    }

    remainingRef.current = duration;
    startedAtRef.current = null;
    setProgress(1);

    const tick = (now: number) => {
      if (pausedRef.current) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      if (startedAtRef.current === null) {
        startedAtRef.current = now;
      }

      const elapsed = now - startedAtRef.current;
      const left = Math.max(0, (remainingRef.current ?? duration) - elapsed);
      setProgress(left / duration);

      if (left <= 0) {
        close("auto");
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [canAutoClose, close, duration, item.open, item.id]);

  const pause = () => {
    if (!canAutoClose || pausedRef.current) {
      return;
    }
    pausedRef.current = true;
    if (startedAtRef.current !== null) {
      const elapsed = performance.now() - startedAtRef.current;
      remainingRef.current = Math.max(0, (remainingRef.current ?? duration) - elapsed);
      startedAtRef.current = null;
    }
  };

  const resume = () => {
    if (!canAutoClose) {
      return;
    }
    pausedRef.current = false;
  };

  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (
      target?.closest(
        "button, a, input, textarea, select, [role='button'], [data-slot='toast-action'], [data-slot='toast-close']",
      )
    ) {
      return;
    }

    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    setSwiping(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    pause();
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }
    const delta = event.clientX - startXRef.current;
    setOffsetX(delta);
  };

  const endSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }
    pointerIdRef.current = null;
    setSwiping(false);

    if (Math.abs(offsetX) > 96) {
      close("dismiss");
      return;
    }

    setOffsetX(0);
    resume();
  };

  const hasBody = item.title != null || item.description != null;
  const icon = item.icon === undefined ? defaultIconForVariant(item.variant) : item.icon;

  return (
    <Toast
      variant={item.variant}
      open={item.open}
      className={cn(
        item.closeButton && "pr-11",
        item.className,
      )}
      style={{
        transform: offsetX ? `translateX(${offsetX}px)` : undefined,
        opacity: offsetX ? Math.max(0.35, 1 - Math.abs(offsetX) / 180) : undefined,
      }}
      data-swipe={swiping ? "move" : undefined}
      role={item.important ? "alert" : "status"}
      aria-live={item.important ? "assertive" : "polite"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endSwipe}
      onPointerCancel={endSwipe}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      {showIcon && icon ? <ToastIcon>{icon}</ToastIcon> : null}

      {hasBody ? (
        <div className="grid min-w-0 flex-1 gap-1">
          {item.title != null ? <ToastTitle>{item.title}</ToastTitle> : null}
          {item.description != null ? (
            <ToastDescription>{item.description}</ToastDescription>
          ) : null}
          {(item.action || item.cancel) && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {item.action ? (
                <ToastAction
                  onClick={() => {
                    item.action?.onClick();
                    close("dismiss");
                  }}
                >
                  {item.action.label}
                </ToastAction>
              ) : null}
              {item.cancel ? (
                <ToastAction
                  className="bg-transparent shadow-none"
                  onClick={() => {
                    item.cancel?.onClick?.();
                    close("dismiss");
                  }}
                >
                  {item.cancel.label}
                </ToastAction>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      {item.closeButton ? (
        <ToastClose
          onClick={() => {
            close("dismiss");
          }}
        />
      ) : null}

      {showProgress && canAutoClose && item.open ? (
        <span
          data-slot="toast-progress"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-2xl bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)]"
        >
          <span
            className="block h-full origin-left bg-[color-mix(in_oklch,var(--foreground)_35%,transparent)] transition-none"
            style={{ transform: `scaleX(${progress})` }}
          />
        </span>
      ) : null}
    </Toast>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Toaster
 * ─────────────────────────────────────────────────────────────────────────── */

type ToasterContextValue = {
  position: ToastPosition;
  scope: "viewport" | "container";
};

const ToasterContext = createContext<ToasterContextValue>({
  position: "bottom-right",
  scope: "viewport",
});

export interface ToasterProps extends HTMLAttributes<HTMLDivElement> {
  position?: ToastPosition;
  scope?: "viewport" | "container";
  visibleToasts?: number;
  showIcon?: boolean;
  showProgress?: boolean;
  expand?: boolean;
  label?: string;
}

const Toaster = forwardRef<HTMLDivElement, ToasterProps>(
  (
    {
      className,
      position = "bottom-right",
      scope = "viewport",
      visibleToasts = 3,
      showIcon = true,
      showProgress = true,
      expand = false,
      label = "Notifications",
      ...props
    },
    ref,
  ) => {
    const toasts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [mounted, setMounted] = useState(false);
    const [hovered, setHovered] = useState(false);
    const reactId = useId();

    useEffect(() => {
      setMounted(true);
    }, []);

    const isTop = position.startsWith("top");
    const ordered = isTop ? toasts : [...toasts].reverse();
    const visible = ordered.slice(0, Math.max(1, visibleToasts));
    const expanded = expand || hovered;

    const viewport = (
      <ToasterContext.Provider value={{ position, scope }}>
        <div
          ref={ref}
          data-slot="toaster"
          data-position={position}
          data-scope={scope}
          aria-label={label}
          tabIndex={-1}
          className={cn(toastViewportVariants({ position, scope }), className)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          {...props}
        >
          <ol
            className={cn(
              "flex w-full list-none flex-col gap-2 p-0",
              isTop ? "flex-col" : "flex-col-reverse",
            )}
            aria-live="polite"
            aria-relevant="additions text"
            aria-atomic="false"
          >
            {visible.map((item, index) => {
              const stackIndex = expanded ? 0 : index;
              const scale = expanded ? 1 : Math.max(0.92, 1 - stackIndex * 0.04);
              const y = expanded ? 0 : stackIndex * (isTop ? 8 : -8);

              return (
                <li
                  key={`${reactId}-${item.id}`}
                  className="pointer-events-auto w-full origin-center transition-[transform,opacity] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]"
                  style={{
                    transform: `translateY(${y}px) scale(${scale})`,
                    zIndex: visible.length - index,
                    opacity: expanded || index === 0 ? 1 : Math.max(0.55, 1 - index * 0.15),
                  }}
                >
                  <ToastItem
                    toast={item}
                    showIcon={showIcon}
                    showProgress={showProgress}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </ToasterContext.Provider>
    );

    if (scope === "container") {
      return viewport;
    }

    if (!mounted || typeof document === "undefined") {
      return null;
    }

    return createPortal(viewport, document.body);
  },
);
Toaster.displayName = "Toaster";

function useToaster() {
  return useContext(ToasterContext);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Exports
 * ─────────────────────────────────────────────────────────────────────────── */

export {
  toast,
  useToast,
  useToaster,
  Toaster,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastIcon,
  toastVariants,
  toastViewportVariants,
};
