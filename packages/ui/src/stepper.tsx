"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import {
  clampActiveStep,
  getStepStatus,
  type StepStatus,
} from "./stepper-utils";

export type { StepStatus };

type StepperContextValue = {
  activeStep: number;
  orientation: "horizontal" | "vertical";
  totalSteps: number;
};

const StepperContext = createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const ctx = useContext(StepperContext);
  if (!ctx) {
    throw new Error("Stepper components must be used within <Stepper>");
  }
  return ctx;
}

const stepperVariants = cva("flex w-full", {
  variants: {
    orientation: {
      horizontal: "flex-row items-start gap-2",
      vertical: "flex-col gap-0",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface StepperProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  activeStep?: number;
  children: ReactNode;
}

const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      className,
      orientation = "horizontal",
      activeStep = 0,
      children,
      ...props
    },
    ref,
  ) => {
    const steps = Children.toArray(children).filter(isValidElement);
    const totalSteps = steps.length;
    const clamped = clampActiveStep(activeStep, totalSteps);

    const value = useMemo(
      () => ({
        activeStep: clamped,
        orientation: orientation ?? "horizontal",
        totalSteps,
      }),
      [clamped, orientation, totalSteps],
    );

    return (
      <StepperContext.Provider value={value}>
        <div
          ref={ref}
          data-slot="stepper"
          data-orientation={orientation}
          className={cn(stepperVariants({ orientation, className }))}
          {...props}
        >
          {steps.map((child, index) => {
            if (!isValidElement(child)) {
              return child;
            }
            return (
              <StepClone key={child.key ?? index} index={index}>
                {child}
              </StepClone>
            );
          })}
        </div>
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

function StepClone({
  index,
  children,
}: {
  index: number;
  children: ReactElement;
}) {
  return (
    <StepIndexContext.Provider value={index}>{children}</StepIndexContext.Provider>
  );
}

const StepIndexContext = createContext(0);

const stepVariants = cva("group/step relative flex", {
  variants: {
    orientation: {
      horizontal: "flex-1 flex-col items-center gap-2",
      vertical: "w-full flex-row items-start gap-3 pb-8 last:pb-0",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface StepProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional override; normally injected by Stepper order. */
  index?: number;
}

const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ className, index: indexProp, children, ...props }, ref) => {
    const { orientation, activeStep } = useStepperContext();
    const contextIndex = useContext(StepIndexContext);
    const index = indexProp ?? contextIndex;
    const status = getStepStatus(index, activeStep);

    return (
      <div
        ref={ref}
        data-slot="step"
        data-status={status}
        data-index={index}
        data-orientation={orientation}
        className={cn(stepVariants({ orientation, className }))}
        {...props}
      >
        {orientation === "horizontal" && index > 0 ? (
          <div
            aria-hidden
            data-slot="step-connector"
            data-status={getStepStatus(index - 1, activeStep)}
            className={cn(
              "absolute left-0 right-1/2 top-4 h-px -translate-y-1/2",
              "bg-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
              index - 1 < activeStep &&
                "bg-[color-mix(in_oklch,var(--primary)_55%,transparent)]",
            )}
          />
        ) : null}
        {orientation === "horizontal" ? (
          <div
            aria-hidden
            data-slot="step-connector-after"
            className={cn(
              "absolute left-1/2 right-0 top-4 h-px -translate-y-1/2",
              "bg-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
              "group-last/step:hidden",
              status === "completed" &&
                "bg-[color-mix(in_oklch,var(--primary)_55%,transparent)]",
            )}
          />
        ) : null}
        {children}
      </div>
    );
  },
);
Step.displayName = "Step";

const stepIndicatorVariants = cva(
  [
    "relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
    "transition-[background,border-color,color,box-shadow] duration-[var(--duration-normal)]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
  ],
  {
    variants: {
      status: {
        completed: [
          "border-[color-mix(in_oklch,var(--primary)_45%,transparent)]",
          "bg-[color-mix(in_oklch,var(--primary)_22%,transparent)]",
          "text-primary",
        ],
        active: [
          "border-[color-mix(in_oklch,var(--primary)_55%,transparent)]",
          "bg-[color-mix(in_oklch,var(--primary)_28%,transparent)]",
          "text-primary",
          "shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_12%,transparent)]",
        ],
        upcoming: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
          "text-[var(--glass-chrome-fg-muted)]",
        ],
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  },
);

export interface StepIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  status?: StepStatus;
}

const StepIndicator = forwardRef<HTMLDivElement, StepIndicatorProps>(
  ({ className, status: statusProp, children, ...props }, ref) => {
    const { activeStep, orientation } = useStepperContext();
    const index = useContext(StepIndexContext);
    const status = statusProp ?? getStepStatus(index, activeStep);

    return (
      <div
        ref={ref}
        data-slot="step-indicator"
        data-status={status}
        className={cn(stepIndicatorVariants({ status, className }))}
        {...props}
      >
        {children ??
          (status === "completed" ? (
            <CheckIcon className="size-3.5" />
          ) : (
            <span>{index + 1}</span>
          ))}
        {/* vertical connector */}
        <div
          aria-hidden
          data-slot="step-connector-vertical"
          className={cn(
            "absolute left-1/2 top-8 hidden h-[calc(100%+0.5rem)] w-px -translate-x-1/2",
            "bg-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
            orientation === "vertical" && "block",
            orientation === "horizontal" && "hidden",
            "group-last/step:hidden",
            status === "completed" &&
              "bg-[color-mix(in_oklch,var(--primary)_55%,transparent)]",
          )}
        />
      </div>
    );
  },
);
StepIndicator.displayName = "StepIndicator";

const StepTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      data-slot="step-title"
      className={cn("text-sm font-semibold leading-none", className)}
      {...props}
    />
  ),
);
StepTitle.displayName = "StepTitle";

const StepDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="step-description"
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
StepDescription.displayName = "StepDescription";

const StepContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useStepperContext();
    return (
      <div
        ref={ref}
        data-slot="step-content"
        className={cn(
          orientation === "horizontal" && "flex flex-col items-center gap-1 text-center",
          orientation === "vertical" && "flex min-w-0 flex-1 flex-col gap-1 pt-1",
          className,
        )}
        {...props}
      />
    );
  },
);
StepContent.displayName = "StepContent";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export {
  Stepper,
  Step,
  StepIndicator,
  StepTitle,
  StepDescription,
  StepContent,
  stepperVariants,
  stepIndicatorVariants,
  getStepStatus,
  clampActiveStep,
};
