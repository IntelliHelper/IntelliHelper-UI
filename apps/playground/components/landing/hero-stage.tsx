"use client";

import {
  GlassBar,
  GlassBarControls,
  GlassBarInfo,
  GlassBarMedia,
  GlassContentCard,
  GlassContentPanel,
  GlassIconButton,
} from "@intelli/ui";

function LayersIcon() {
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
      className="size-4"
    >
      <path d="m12 2 9 4.5-9 4.5L3 6.5 12 2Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17.5 9 4.5 9-4.5" />
    </svg>
  );
}

function SparkIcon() {
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
      className="size-4"
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

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="size-3.5"
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" />
    </svg>
  );
}

/**
 * Signature hero demo: saturated content panels + floating chrome bar
 * (same composition pattern as the glass-system playground demos).
 */
export function HeroStage() {
  return (
    <div
      className="relative mx-auto w-full max-w-md lg:max-w-lg"
      aria-label="Live Liquid Glass component preview"
    >
      {/* Soft stage glow behind the card */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2.5rem] opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 40% 35%, oklch(0.62 0.18 270 / 0.45), transparent 70%), radial-gradient(ellipse 50% 45% at 75% 70%, oklch(0.7 0.16 55 / 0.35), transparent 70%)",
        }}
        aria-hidden
      />

      <GlassContentCard animated className="relative h-[19.5rem] sm:h-[21rem]">
        <div className="flex h-full">
          <GlassContentPanel
            className="flex-[3] pb-20"
            gradient="linear-gradient(160deg, oklch(0.48 0.19 275), oklch(0.58 0.17 230))"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] content-text-muted">
              Content layer
            </p>
            <div className="mt-auto space-y-2">
              <p className="text-2xl font-bold leading-[1.1] tracking-tight content-text sm:text-[1.75rem]">
                Ship frosted
                <br />
                product UI
              </p>
              <p className="max-w-[14rem] text-xs leading-relaxed content-text-muted sm:text-[13px]">
                Saturated panels carry the story. Chrome stays quiet above.
              </p>
            </div>
          </GlassContentPanel>

          <GlassContentPanel
            className="flex-[2] pb-20"
            gradient="linear-gradient(160deg, oklch(0.72 0.18 55), oklch(0.55 0.2 25))"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] content-text-muted">
              Expressive
            </p>
            <div className="mt-auto space-y-1">
              <p className="text-2xl font-bold leading-[1.1] tracking-tight content-text sm:text-[1.75rem]">
                Own the
                <br />
                source
              </p>
              <p className="text-xs content-text-muted sm:text-[13px]">
                CLI · copy-paste
              </p>
            </div>
          </GlassContentPanel>
        </div>

        {/* Chrome floats inside the content stage — not outside */}
        <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
          <GlassBar size="default" animated className="pr-1.5">
            <GlassIconButton
              type="button"
              size="sm"
              aria-label="Layers"
              className="pointer-events-none"
              tabIndex={-1}
            >
              <LayersIcon />
            </GlassIconButton>
            <GlassBarMedia
              className="bg-gradient-to-br from-violet-500/90 to-cyan-500/80"
              aria-hidden
            />
            <GlassBarInfo title="Chrome layer" subtitle="Quiet controls" />
            <GlassBarControls>
              <GlassIconButton
                type="button"
                size="sm"
                aria-label="Spark"
                className="pointer-events-none"
                tabIndex={-1}
              >
                <SparkIcon />
              </GlassIconButton>
              <GlassIconButton
                type="button"
                size="sm"
                aria-label="Play"
                className="pointer-events-none"
                tabIndex={-1}
              >
                <PlayIcon />
              </GlassIconButton>
            </GlassBarControls>
          </GlassBar>
        </div>
      </GlassContentCard>
    </div>
  );
}
