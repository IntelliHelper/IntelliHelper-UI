"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  getBackgroundPictureStyle,
  NONE_BACKGROUND_VALUE,
  type BackgroundPictureValue,
} from "@intelli/ui";

interface PlaygroundBackgroundContextValue {
  background: BackgroundPictureValue;
  setBackground: (value: BackgroundPictureValue) => void;
}

const PlaygroundBackgroundContext =
  createContext<PlaygroundBackgroundContextValue | null>(null);

export function PlaygroundBackgroundProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [background, setBackground] =
    useState<BackgroundPictureValue>(NONE_BACKGROUND_VALUE);

  return (
    <PlaygroundBackgroundContext.Provider
      value={{ background, setBackground }}
    >
      <PlaygroundBackgroundLayer background={background} />
      {children}
    </PlaygroundBackgroundContext.Provider>
  );
}

export function usePlaygroundBackground() {
  const context = useContext(PlaygroundBackgroundContext);
  if (!context) {
    throw new Error(
      "usePlaygroundBackground must be used within PlaygroundBackgroundProvider",
    );
  }
  return context;
}

function PlaygroundBackgroundLayer({
  background,
}: {
  background: BackgroundPictureValue;
}) {
  const hasCustomBackground = background.source !== "none";
  const backgroundStyle = getBackgroundPictureStyle(background);

  return (
    <div
      data-slot="playground-background"
      data-has-background={hasCustomBackground}
      className="mesh-background"
      aria-hidden="true"
      style={hasCustomBackground ? backgroundStyle : undefined}
    >
      {hasCustomBackground ? (
        <div className="absolute inset-0 bg-[color-mix(in_oklch,black_8%,transparent)]" />
      ) : (
        <>
          <div className="mesh-blob mesh-blob-1" />
          <div className="mesh-blob mesh-blob-2" />
          <div className="mesh-blob mesh-blob-3" />
        </>
      )}
    </div>
  );
}