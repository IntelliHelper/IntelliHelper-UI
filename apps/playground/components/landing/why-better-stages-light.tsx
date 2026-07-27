"use client";

import { Badge } from "@intelli/ui/badge";
import { Button } from "@intelli/ui/button";
import { GlassBar, GlassBarControls, GlassBarInfo, GlassBarMedia } from "@intelli/ui/glass-bar";
import { GlassContentCard, GlassContentPanel } from "@intelli/ui/glass-content-card";
import { GlassIconButton } from "@intelli/ui/glass-icon-button";
import {
  LayersIcon,
  PlayIcon,
  SearchIcon,
  SparkIcon,
  StageShell,
} from "./stage-shell";

/** Content panels + floating chrome — the design system story. */
export function DesignSystemStage() {
  return (
    <StageShell>
      <GlassContentCard
        animated={false}
        className="relative h-[10.75rem] sm:h-[11.5rem]"
      >
        <div className="flex h-full">
          <GlassContentPanel
            className="flex-[3] pb-14 sm:pb-16"
            glow={false}
            gradient="linear-gradient(160deg, oklch(0.48 0.19 275), oklch(0.58 0.17 230))"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] content-text-muted">
              Content layer
            </p>
            <div className="mt-auto space-y-1">
              <p className="text-lg font-bold leading-tight tracking-tight content-text sm:text-xl">
                Liquid Glass
                <br />
                system
              </p>
            </div>
          </GlassContentPanel>
          <GlassContentPanel
            className="flex-[2] pb-14 sm:pb-16"
            glow={false}
            gradient="linear-gradient(160deg, oklch(0.72 0.18 55), oklch(0.55 0.2 25))"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] content-text-muted">
              Themes
            </p>
            <div className="mt-auto">
              <p className="text-lg font-bold leading-tight tracking-tight content-text sm:text-xl">
                Five
                <br />
                palettes
              </p>
            </div>
          </GlassContentPanel>
        </div>
        <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3">
          <GlassBar size="sm" animated={false} className="pr-1">
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
            </GlassBarControls>
          </GlassBar>
        </div>
      </GlassContentCard>
    </StageShell>
  );
}

/** First-class glass primitives, not blog CSS. */
export function GlassPrimitivesStage() {
  return (
    <StageShell>
      <div className="flex flex-col items-center gap-3.5">
        <GlassBar size="sm" animated={false} className="w-full pr-1">
          <GlassIconButton
            type="button"
            size="sm"
            aria-label="Home"
            className="pointer-events-none"
            tabIndex={-1}
          >
            <LayersIcon />
          </GlassIconButton>
          <GlassBarMedia
            className="bg-gradient-to-br from-fuchsia-500/80 to-orange-400/70"
            aria-hidden
          />
          <GlassBarInfo title="Glass-bar" subtitle="Chrome capsule" />
          <GlassBarControls>
            <GlassIconButton
              type="button"
              size="sm"
              aria-label="Play"
              className="pointer-events-none"
              tabIndex={-1}
            >
              <PlayIcon />
            </GlassIconButton>
            <GlassIconButton
              type="button"
              size="sm"
              aria-label="Search"
              className="pointer-events-none"
              tabIndex={-1}
            >
              <SearchIcon />
            </GlassIconButton>
          </GlassBarControls>
        </GlassBar>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <GlassIconButton
            type="button"
            size="sm"
            aria-label="Icon chrome"
            className="pointer-events-none"
            tabIndex={-1}
          >
            <SparkIcon />
          </GlassIconButton>
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="pill"
            className="pointer-events-none"
            tabIndex={-1}
          >
            Outline
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            shape="pill"
            className="pointer-events-none"
            tabIndex={-1}
          >
            Primary CTA
          </Button>
          <Badge variant="secondary" size="sm">
            glass-content-card
          </Badge>
        </div>
      </div>
    </StageShell>
  );
}
