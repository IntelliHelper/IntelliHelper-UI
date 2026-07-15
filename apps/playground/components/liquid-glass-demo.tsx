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

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-red-500"
    >
      <path d="M12 3l9 8v10h-6v-6H9v6H3V11l9-8z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MusicBrand() {
  return (
    <div className="flex items-center gap-1.5 content-text">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
        aria-hidden="true"
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="text-sm font-semibold tracking-tight">Music</span>
    </div>
  );
}

export function GlassContentCardDemo() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <GlassContentCard className="h-56">
        <div className="flex h-full">
          <GlassContentPanel
            className="flex-[3]"
            gradient="linear-gradient(160deg, oklch(0.52 0.18 270), oklch(0.62 0.16 220))"
          >
            <MusicBrand />
            <p className="mt-auto text-2xl font-bold leading-none tracking-tight content-text">
              Friends
              <br />
              Mix
            </p>
          </GlassContentPanel>
          <GlassContentPanel
            className="flex-[2]"
            gradient="linear-gradient(160deg, oklch(0.72 0.2 55), oklch(0.58 0.22 25))"
          >
            <MusicBrand />
            <p className="mt-auto text-2xl font-bold leading-none tracking-tight content-text">
              Get Up
              <br />
              Mix
            </p>
          </GlassContentPanel>
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <GlassBarDemo />
        </div>
      </GlassContentCard>
    </div>
  );
}

export function GlassBarDemo() {
  return (
    <GlassBar>
      <GlassIconButton aria-label="Home">
        <HomeIcon />
      </GlassIconButton>
      <GlassBarMedia
        className="bg-gradient-to-br from-neutral-700 to-neutral-900"
        aria-hidden="true"
      />
      <GlassBarInfo title="All Of Me" subtitle="Nao" />
      <GlassBarControls>
        <GlassIconButton aria-label="Play">
          <PlayIcon />
        </GlassIconButton>
        <GlassIconButton aria-label="Next track">
          <NextIcon />
        </GlassIconButton>
      </GlassBarControls>
      <GlassIconButton aria-label="Search">
        <SearchIcon />
      </GlassIconButton>
    </GlassBar>
  );
}

export function GlassIconButtonDemo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <GlassIconButton size="sm" aria-label="Small">
        <SearchIcon />
      </GlassIconButton>
      <GlassIconButton aria-label="Default">
        <SearchIcon />
      </GlassIconButton>
      <GlassIconButton size="lg" aria-label="Large">
        <SearchIcon />
      </GlassIconButton>
    </div>
  );
}

/** Combined showcase — not used in per-component examples. */
export function LiquidGlassDemo() {
  return (
    <div className="mx-auto max-w-lg">
      <GlassContentCardDemo />
      <div className="mt-6">
        <GlassIconButtonDemo />
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Content layer (saturated) + chrome layer (neutral glass) — icons adapt in
        light/dark
      </p>
    </div>
  );
}