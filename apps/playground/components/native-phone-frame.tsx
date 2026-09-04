import type { ReactNode } from "react";
import { cn } from "@intelli/utils";

type NativePhoneFrameProps = {
  children: ReactNode;
  className?: string;
  caption?: string;
};

/** iPhone 16 Pro–style chrome for native docs previews. */
export function NativePhoneFrame({
  children,
  className,
  caption = "iPhone preview — same APIs as @intelli/ui-native",
}: NativePhoneFrameProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative" aria-label="iPhone preview">
        {/* Volume + silent (left) */}
        <span
          className="absolute -left-[3px] top-[92px] h-5 w-[3px] rounded-l-sm bg-[#3a3a3c]"
          aria-hidden
        />
        <span
          className="absolute -left-[3px] top-[124px] h-12 w-[3px] rounded-l-sm bg-[#3a3a3c]"
          aria-hidden
        />
        <span
          className="absolute -left-[3px] top-[180px] h-12 w-[3px] rounded-l-sm bg-[#3a3a3c]"
          aria-hidden
        />
        {/* Power (right) */}
        <span
          className="absolute -right-[3px] top-[150px] h-[72px] w-[3px] rounded-r-sm bg-[#3a3a3c]"
          aria-hidden
        />

        <div
          className="relative w-[min(100%,20.25rem)] overflow-hidden rounded-[3rem] p-[10px] shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          style={{
            background:
              "linear-gradient(160deg, #5c5c5e 0%, #1c1c1e 22%, #2c2c2e 50%, #0d0d0e 100%)",
          }}
        >
          <div className="relative overflow-hidden rounded-[2.35rem] bg-[#000]">
            {/* Screen */}
            <div
              className="relative min-h-[36rem] bg-background"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, color-mix(in oklch, var(--glass-surface-fill) 55%, var(--glass-mix-into)) 0%, var(--background) 42%)",
              }}
            >
              {/* Status bar + Dynamic Island */}
              <div className="relative z-10 grid h-11 grid-cols-[1fr_auto_1fr] items-end px-7 pb-1">
                <p className="text-[13px] font-semibold tabular-nums tracking-tight text-foreground">
                  9:41
                </p>
                <div
                  className="relative h-[22px] w-[78px] rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  aria-hidden
                >
                  <span className="absolute right-3 top-1/2 size-[7px] -translate-y-1/2 rounded-full bg-[#1a1a1c] ring-1 ring-[#2a2a2c]" />
                </div>
                <div className="flex items-center justify-end gap-1.5 text-foreground">
                  <CellularIcon />
                  <WifiIcon />
                  <BatteryIcon />
                </div>
              </div>

              <div className="px-4 pb-8 pt-3">{children}</div>

              {/* Home indicator */}
              <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
                <span className="h-[5px] w-[118px] rounded-full bg-foreground/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="max-w-[20rem] text-center text-xs text-muted-foreground">
        {caption}
      </p>
    </div>
  );
}

function CellularIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="0.5" opacity="0.35" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" opacity="0.55" />
      <rect x="9" y="3" width="3" height="9" rx="0.5" opacity="0.8" />
      <rect x="13.5" y="0.5" width="3" height="11.5" rx="0.5" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
      <path
        d="M1 4.2C4.4 1.2 11.6 1.2 15 4.2M3.4 6.6c2.3-2 6.9-2 9.2 0M6.2 9c1.1-.9 2.5-.9 3.6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden>
      <rect
        x="0.6"
        y="0.6"
        width="21"
        height="10.8"
        rx="2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <rect x="2" y="2.1" width="16.5" height="7.8" rx="1.4" fill="currentColor" />
      <path d="M22.4 4.1h1.2c.7 0 1.2.5 1.2 1.2v1.4c0 .7-.5 1.2-1.2 1.2h-1.2" fill="currentColor" opacity="0.45" />
    </svg>
  );
}
