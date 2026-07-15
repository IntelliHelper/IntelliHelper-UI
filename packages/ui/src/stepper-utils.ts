export type StepStatus = "completed" | "active" | "upcoming";

/**
 * Derive visual status for a step given the controlled active index (0-based).
 */
export function getStepStatus(
  stepIndex: number,
  activeStep: number,
): StepStatus {
  if (stepIndex < activeStep) {
    return "completed";
  }
  if (stepIndex === activeStep) {
    return "active";
  }
  return "upcoming";
}

/**
 * Clamp active step into [0, totalSteps - 1]. Empty steppers return 0.
 */
export function clampActiveStep(activeStep: number, totalSteps: number): number {
  if (totalSteps <= 0) {
    return 0;
  }
  if (!Number.isFinite(activeStep)) {
    return 0;
  }
  return Math.min(Math.max(Math.trunc(activeStep), 0), totalSteps - 1);
}
