"use client";

import type { ReactNode } from "react";

export function LayersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5"
    >
      <path d="m12 2 9 4.5-9 4.5L3 6.5 12 2Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17.5 9 4.5 9-4.5" />
    </svg>
  );
}

export function SparkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5"
    >
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="m5.6 5.6 2.1 2.1" />
      <path d="m16.3 16.3 2.1 2.1" />
      <path d="m16.3 7.7 2.1-2.1" />
      <path d="m5.6 18.4 2.1-2.1" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="size-3"
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function StageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-[13.5rem] items-center justify-center overflow-hidden p-4 sm:h-[14.5rem] sm:p-5 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 20%, oklch(0.62 0.16 270 / 0.28), transparent 55%), radial-gradient(ellipse 55% 50% at 85% 75%, oklch(0.7 0.14 55 / 0.22), transparent 55%), radial-gradient(ellipse 40% 40% at 50% 50%, oklch(0.65 0.1 200 / 0.12), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent)",
        }}
        aria-hidden
      />
      <div className="relative z-[1] w-full max-w-[22rem]">{children}</div>
    </div>
  );
}

export function StagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-[13.5rem] items-center justify-center sm:h-[14.5rem] ${className}`}
      aria-hidden
    >
      <div className="h-[10.75rem] w-full max-w-[22rem] rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_42%,transparent)] sm:h-[11.5rem]" />
    </div>
  );
}
